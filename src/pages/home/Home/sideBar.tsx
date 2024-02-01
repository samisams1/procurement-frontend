import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Drawer, Typography, MenuList, MenuItem } from '@mui/material';
import useResponsive from '../../../hooks/useResponsive';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { ContactMail, Phone } from '@mui/icons-material';

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  px: 2.5,
  py: 3,
  padding:'500',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'blue',
}));

const LogoTitle = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontWeight: 'bold',
  marginTop: '8px',
}));

const Sidebar: React.FC<{}> = () => {
  const { pathname } = useLocation();
  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    // Perform any necessary side effects here
  }, [pathname]);

  const renderContent = (
    <>
      <LogoContainer>
        <LogoTitle variant="h6">ET Proforma</LogoTitle>
      </LogoContainer>
      <MenuList>
        <MenuItem
          component={RouterLink}
          to="/"
          selected={pathname === '/'}
          sx={{
            '&:hover': {
              backgroundColor: 'blue',
              color: 'white',
            },
            fontWeight: 'bold',
          }}
        >
          <HomeIcon sx={{ marginRight: 1 }} />
          Home
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to="/about"
          selected={pathname === '/about'}
          sx={{
            '&:hover': {
              backgroundColor: 'blue',
              color: 'white',
            },
            fontWeight: 'bold',
          }}
        >
          <InfoIcon sx={{ marginRight: 1 }} />
          About
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to="/contact"
          selected={pathname === '/contact'}
          sx={{
            '&:hover': {
              backgroundColor: 'blue',
              color: 'white',
            },
            fontWeight: 'bold',
          }}
        >
          <ContactMail sx={{ marginRight: 1 }} />
          Contact
        </MenuItem>
      </MenuList>
      <Box sx={{ flexGrow: 1 }} />
    </>
  );

  return (
    <RootStyle>
      <Drawer
        open
        variant={isDesktop ? 'persistent' : undefined}
        PaperProps={{
          sx: {
            width: DRAWER_WIDTH,
            bgcolor: 'background.default',
            borderRightStyle: isDesktop ? 'dashed' : undefined,
          },
        }}
      >
        {renderContent}
      </Drawer>
    </RootStyle>
  );
};

export default Sidebar;