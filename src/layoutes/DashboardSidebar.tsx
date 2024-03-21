import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar, IconButton } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import Spinner from '../components/Spinner';
import { UserContext } from '../auth/UserContext';
import NavSection from './NavSection';
import LogoutIcon from '@mui/icons-material/Logout';
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

  const renderContent = (
    <div>
      <LogoStyle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LogoImage src={require('../assets/pro.png')} alt="logo" />
          <Typography variant="h6" sx={{ color: '#00b0ad' }}>
     Etproforma
          </Typography>
        </Box>
        <IconButton color="inherit" component={RouterLink} to="/home">
          <LogoutSharp />
        </IconButton>
      </LogoStyle>
      <Box sx={{ mb: 2, mx: 1 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={require('../assets/pro.png')} alt="photoURL" />
            <Box sx={{ ml: 1 }}>
              <Typography variant="body2" sx={{ color: 'white' }}>
                Welcome, {currentUser.username}!
              </Typography>
            </Box>
            <IconButton color="inherit" component={RouterLink} to="/logout">
              <LogoutIcon />
            </IconButton>
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