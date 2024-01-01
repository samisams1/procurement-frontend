import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import Spinner from '../components/Spinner';
import { UserContext } from '../auth/UserContext';
import NavSection from './NavSection';

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
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: '#3c44b1',
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
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <img src={require('../assets/inventory.png')} alt="logo" />
        <h1 style={{ color: '#9c27b0' }}> </h1>
      </Box>
      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={require('../assets/sams.jpg')} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}></Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                welcome {' ' + currentUser.username}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>
      <NavSection/>
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