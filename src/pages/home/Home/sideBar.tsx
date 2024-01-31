import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Drawer, Typography, MenuList, MenuItem } from '@mui/material';
import useResponsive from '../../../hooks/useResponsive';

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));



type DashboardSidebarProps = {
  isOpenSidebar: boolean;
  onCloseSidebar: () => void;
};

const Sidebar: React.FC<DashboardSidebarProps> = ({ isOpenSidebar, onCloseSidebar }) => {
  const { pathname } = useLocation();
  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Box sx={{ px: 2.5, py: 3, display: 'flex', alignItems: 'center' }}>
      <img src={require('../../../assets/pro.png')} alt="logo" style={{ marginRight: '8px' }} />
      <Typography variant="h6" sx={{ color: '#1c9fef' }}>
        ET Proforma
      </Typography>
    </Box>
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
          <MenuList>
            <MenuItem component={RouterLink} to="/" selected={pathname === '/'}>
              Home
            </MenuItem>
            <MenuItem component={RouterLink} to="/about" selected={pathname === '/about'}>
              About
            </MenuItem>
            <MenuItem component={RouterLink} to="/contact" selected={pathname === '/contact'}>
              Contact
            </MenuItem>
          </MenuList>
          <Box sx={{ flexGrow: 1 }} />
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
          <MenuList>
            <MenuItem component={RouterLink} to="/" selected={pathname === '/'}>
              Home
            </MenuItem>
            <MenuItem component={RouterLink} to="/about" selected={pathname === '/about'}>
              About
            </MenuItem>
            <MenuItem component={RouterLink} to="/contact" selected={pathname === '/contact'}>
              Contact
            </MenuItem>
          </MenuList>
          <Box sx={{ flexGrow: 1 }} />
        </Drawer>
      )}
    </RootStyle>
  );
};

export default Sidebar;