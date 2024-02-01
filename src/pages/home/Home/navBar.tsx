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
  ListItemIcon,
} from '@mui/material';
import LanguageSelector from '../../../layoutes/LanguageSelector';
import { Link } from 'react-router-dom';
import logoImage from '../../../assets/pro.png'; // Path to your logo image
import {  HomeTwoTone, LoginTwoTone, Menu as MenuIcon, PeopleTwoTone, PhoneTwoTone } from '@mui/icons-material';


const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: '#00b0ad',
  height: '64px', // Set a fixed height for the app bar
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
  color: '#333333',
  fontSize: '1.5rem', // Updated font size
  [theme.breakpoints.up('lg')]: {
    fontSize: '2rem', // Adjust the size for larger screens if needed
  },
}));
const LogoImage = styled('img')(({ theme }) => ({
  height: 40,
  [theme.breakpoints.up('lg')]: {
    height: 50,
  },
}));

const ActionWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const Sidebar = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 240,
    backgroundColor: '#00b0ad', // Set the same background color as the app bar
    paddingTop: '64px', // Add top padding to align with the app bar
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
          <LogoImage src={logoImage} alt="Logo" />
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
        ) : (
          <LanguageSelector />
        )}
      </ToolbarStyle>

      <Sidebar
        open={isSidebarOpen}
        onClose={handleSidebarClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: { width: 240, backgroundColor: '#00b0ad' }, // Set the same background color as the app bar
        }}
      >
        <List>
        <ListItem button component={Link} to="/home">
  <ListItemIcon>
    <HomeTwoTone sx={{ color: '#ffffff' }} />
  </ListItemIcon>
  <ListItemText
    primary="Home"
    primaryTypographyProps={{
      style: {
        fontSize: '1.4rem', // Increase the font size as desired
        fontWeight:'900',
        color: '#ffffff', // Change the font color
      },
    }}
  />
</ListItem>
          <ListItem button component={Link} to="/about">
            <ListItemIcon>
              <PeopleTwoTone sx={{ color: '#ffffff' }} />
            </ListItemIcon>
            <ListItemText
    primary="About"
    primaryTypographyProps={{
      style: {
        fontSize: '1.4rem', // Increase the font size as desired
        fontWeight:'900',
        color: '#ffffff', // Change the font color
      },
    }}
  />
          </ListItem>
          <ListItem button component={Link} to="/contact">
            <ListItemIcon>
              <PhoneTwoTone sx={{ color: '#ffffff' }} />
            </ListItemIcon>
            <ListItemText
    primary="Contact us"
    primaryTypographyProps={{
      style: {
        fontSize: '1.4rem', // Increase the font size as desired
        fontWeight:'900',
        color: '#ffffff', // Change the font color
      },
    }}
  />
          </ListItem>
          <ListItem button component={Link} to="/contact">
            <ListItemIcon>
              <LoginTwoTone sx={{ color: '#ffffff' }} />
            </ListItemIcon>
            <ListItemText
    primary="LOG IN"
    primaryTypographyProps={{
      style: {
        fontSize: '1.4rem', // Increase the font size as desired
        fontWeight:'900',
        color: '#ffffff', // Change the font color
      },
    }}
  />
          </ListItem>
        </List>
      </Sidebar>
    </RootStyle>
  );
}