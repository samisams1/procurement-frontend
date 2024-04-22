import React, { useContext, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar, IconButton } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import Spinner from '../components/Spinner';
import { UserContext } from '../auth/UserContext';
import NavSection from './NavSection';
import { LogoutSharp } from '@mui/icons-material';

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.primary.main,
}));

const LogoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2.5),
}));

const LogoImage = styled('img')(({ theme }) => ({
  width: 80,
  height: 80,
  marginRight: theme.spacing(1),
}));

type DashboardSidebarProps = {
  isOpenSidebar: boolean;
  onCloseSidebar: () => void;
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpenSidebar, onCloseSidebar }) => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);
  const { pathname } = useLocation();
  const isDesktop = useResponsive('up', 'lg');
  const { currentUser } = React.useContext(UserContext);

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!currentUser) {
    return <Spinner />;
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setCurrentUser(null); // Assuming there is a setCurrentUser function in the UserContext
    navigate('/home');
  };

  const renderContent = (
    <div>
      <LogoStyle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LogoImage src={require('../assets/pro.png')} alt="logo" />
          <Typography variant="h6" sx={{ color: '#00b0ad' }}>
            Etproforma
          </Typography>
        </Box>
        <IconButton
  color="inherit"
  onClick={handleLogout}
  sx={{ p: 1, borderRadius: '60%' }}
>
  <LogoutSharp fontSize="small" />
  <Typography variant="body2" sx={{ fontSize: '10px', marginLeft: '4px', color: 'red' }}>
    Logout
  </Typography>
</IconButton>
      </LogoStyle>
<Box >
  <Link underline="none" component={RouterLink} to="#">
    <AccountStyle>
      <Avatar src={require('../assets/pro.png')} alt="photoURL" />
      <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'white' }}>
          Welcome, {currentUser.username}!
        </Typography>
        <Typography variant="body2" sx={{ color: 'white', marginLeft: '4px' }}>
          Role, {currentUser.role}
        </Typography>
      </Box>
    </AccountStyle>
  </Link>
</Box>
      <NavSection />
      <Box sx={{ flexGrow: 1 }} />
    </div>
  );

  return (
    <RootStyle>
      {isOpenSidebar && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
};

export default DashboardSidebar;