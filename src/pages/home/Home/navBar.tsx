import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import LanguageSelector from '../../../layoutes/LanguageSelector';
import { Link } from 'react-router-dom';

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: '#1976d2',
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(1, 5),
  },
}));

const LogoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: theme.spacing(1),
  [theme.breakpoints.up('lg')]: {
    marginLeft: theme.spacing(2),
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.light,
  fontSize: '1.5rem', // Updated font size
  [theme.breakpoints.up('lg')]: {
    fontSize: '2rem', // Adjust the size for larger screens if needed
  },
}));

const ActionWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const Sidebar = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 240,
  },
}));

interface DashboardNavbarProps {
  onOpenSidebar?: () => void;
}

export default function Navbar({ onOpenSidebar }: DashboardNavbarProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setMenuVisible(window.innerWidth > 960);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <RootStyle>
      <ToolbarStyle>
        <IconButton
          onClick={handleSidebarOpen}
          sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <LogoWrapper>
          <LogoText variant="h6" sx={{ fontWeight: 'bold' }}>
            ET Pro-forma
          </LogoText>
        </LogoWrapper>

        {isMenuVisible ? (
          <ActionWrapper>
            <Button
              color="inherit"
              component={Link}
              to="/home"
              sx={{
                '&:hover': {
                  color: '#ffffff',
                },
                fontWeight: 'bold',
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/about"
              sx={{
                '&:hover': {
                  color: '#ffffff',
                },
                fontWeight: 'bold',
              }}
            >
              About
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/contact"
              sx={{
                '&:hover': {
                  color: '#ffffff',
                },
                fontWeight: 'bold',
              }}
            >
              Contact
            </Button>
            <LanguageSelector />
          </ActionWrapper>
        ) : null}

        <Sidebar
          anchor="left"
          open={isSidebarOpen}
          onClose={handleSidebarClose}
        >
          <List>
            <ListItem button component={Link} to="/home">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/about">
              <ListItemText primary="About" />
            </ListItem>
            <ListItem button component={Link} to="/contact">
              <ListItemText primary="Contact" />
            </ListItem>
          </List>
        </Sidebar>
      </ToolbarStyle>
    </RootStyle>
  );
}