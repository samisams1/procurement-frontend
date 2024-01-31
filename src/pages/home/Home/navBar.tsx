import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import LanguageSelector from '../../../layoutes/LanguageSelector';
import { Link } from 'react-router-dom';
import Sidebar from './sideBar';

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

interface DashboardNavbarProps {
  onOpenSidebar?: () => void;
}

export default function Navbar({ onOpenSidebar }: DashboardNavbarProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth <= 960); // Set the visibility of the sidebar based on the viewport width
    };

    handleResize(); // Call the handleResize function on initial render

    window.addEventListener('resize', handleResize); // Add event listener for window resize

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up the event listener on component unmount
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

        <ActionWrapper>
          <Button
            color="inherit"
            component={Link}
            to="/home"
            sx={{
              '&:hover': {
                color: '#ffffff',
              },
              fontWeight: 'bold', // Make the text bold
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
              fontWeight: 'bold', // Make the text bold
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
              fontWeight: 'bold', // Make the text bold
            }}
          >
            Contact
          </Button>
          <LanguageSelector />
        </ActionWrapper>

        {showSidebar &&  <Sidebar isOpenSidebar={isSidebarOpen} onCloseSidebar={handleSidebarClose} />} {/* Render the Sidebar component based on the showSidebar state */}
      </ToolbarStyle>
    </RootStyle>
  );
}