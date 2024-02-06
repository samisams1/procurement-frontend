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
import {  CreateNewFolderTwoTone, HomeTwoTone, LoginTwoTone, Menu as MenuIcon, PeopleTwoTone, PhoneTwoTone } from '@mui/icons-material';
import Popup from '../../../components/Popup';
import Login from '../../../components/pageComponents/login/LoginForm';
import Register from '../../account/Register';


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
  color: '#ffffff',
  fontSize: '1.5rem', // Updated font size
  [theme.breakpoints.up('lg')]: {
    fontSize: '2rem', // Adjust the size for larger screens if needed
  },
}));
const WelcomeTitle = styled(Typography)(({ theme }) => ({
  backgroundColor: '#00b0ad',
  padding: theme.spacing(1),
  color: '#ffffff',
  fontWeight: 'bold',
  fontSize: '1.5rem',
  [theme.breakpoints.up('lg')]: {
    fontSize: '2rem',
  },
}))
const LogoImage = styled('img')(({ theme }) => ({
  height: 40,
  [theme.breakpoints.up('lg')]: {
    height: 50,
  },
}));

const ActionWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color:"#ffffff"
}));

const Sidebar = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 240,
    backgroundColor: '#ffffff', // Set the same background color as the app bar
  },
}));
const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  '& .MuiSvgIcon-root': {
    color: '#00b0ad', // Red color
  },
}));
interface DashboardNavbarProps {
  onOpenSidebar?: () => void;
}

export default function Navbar({ onOpenSidebar }: DashboardNavbarProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(true);

  const [openLoginPopup,setLoginOpenPopup] =useState(false);
  const [openRegisterPopup,setRegisterOpenPopup] =useState(false);


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
  const handleLoginOpenPopUp =()=>{
    setLoginOpenPopup(true);
  }
  const handleRegisterOpenPopUp =()=>{
    setRegisterOpenPopup(true);
  }
  return (
    <RootStyle>
      <ToolbarStyle>
        <IconButton
          onClick={handleSidebarOpen}
          sx={{ mr: 1, color: '#ffffff', display: { lg: 'none' } }}
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
            <Button
              color="inherit"
              onClick={handleLoginOpenPopUp}
              sx={{
                borderRadius: '999px',
                '&:hover': {
                  color: '#ffffff',
                },
                fontWeight: 'bold',
                border: '5px double #ffffff',
              }}
            >
              Login
            </Button>
            <Button
              onClick={handleRegisterOpenPopUp}
              color="inherit"
              sx={{
                '&:hover': {
                  color: '#ffffff',
                },
                fontWeight: 'bold',
              }}
            >
              Register
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
    sx: { width: 240 },
  }}
>
  <WelcomeTitle variant="h6">Hi, Welcome</WelcomeTitle>
  <List>
    <ListItem button component={Link} to="/home">
      <StyledListItemIcon>
        <HomeTwoTone />
      </StyledListItemIcon>
      <ListItemText primary="Home" />
    </ListItem>
    <ListItem button component={Link} to="/about">
      <StyledListItemIcon>
        <PeopleTwoTone />
      </StyledListItemIcon>
      <ListItemText primary="About" />
    </ListItem>
    <ListItem button component={Link} to="/contact">
      <StyledListItemIcon>
        <PhoneTwoTone />
      </StyledListItemIcon>
      <ListItemText primary="Contact us" />
    </ListItem>
    <ListItem onClick={handleLoginOpenPopUp}>
      <StyledListItemIcon>
        <LoginTwoTone />
      </StyledListItemIcon>
      <ListItemText primary="Login" />
    </ListItem>
    <ListItem onClick={handleRegisterOpenPopUp}>
      <StyledListItemIcon>
        <CreateNewFolderTwoTone />
      </StyledListItemIcon>
      <ListItemText primary="Register" />
    </ListItem>
  </List>
</Sidebar>
<Popup title="Login" openPopup={openLoginPopup} setOpenPopup={setLoginOpenPopup}>
          <Login />
</Popup>

<Popup title="Choose Account" openPopup={openRegisterPopup} setOpenPopup={setRegisterOpenPopup}>
          <Register />
</Popup>

    </RootStyle>
  );
}