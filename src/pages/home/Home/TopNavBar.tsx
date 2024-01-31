import React from 'react';
import { styled } from '@mui/system';
import { AppBar, Toolbar, IconButton, Typography, Button, Grid } from '@mui/material';
import { Email, Phone, Facebook, Twitter, Instagram } from '@mui/icons-material';

const TopAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'black',
  height: '30px',
  position: 'fixed',
  width: '100%',
  left: 0, // Change to 'right: 0' if you want it positioned to the right
}));

const SocialMediaIcons = styled(Grid)(({ theme }) => ({
  '& .MuiIconButton-root': {
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}));

const EmailText = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const PhoneNumberText = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const TopNavBar = () => {
  return (
    <TopAppBar position="static">
      <Toolbar>
        <SocialMediaIcons>
          <IconButton aria-label="Facebook">
            <Facebook />
          </IconButton>
          <IconButton aria-label="Twitter">
            <Twitter />
          </IconButton>
          <IconButton aria-label="Instagram">
            <Instagram />
          </IconButton>
        </SocialMediaIcons>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Email />
          </Grid>
          <Grid item>
            <EmailText variant="body2">email@example.com</EmailText>
          </Grid>
          <Grid item>
            <Phone />
          </Grid>
          <Grid item>
            <PhoneNumberText variant="body2">123-456-7890</PhoneNumberText>
          </Grid>
          <Grid item>
            <Button color="inherit">Login</Button>
          </Grid>
          <Grid item>
            <Button color="inherit">Register</Button>
          </Grid>
        </Grid>
      </Toolbar>
    </TopAppBar>
  );
};

export default TopNavBar;