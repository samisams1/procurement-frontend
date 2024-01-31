import React, { useState } from 'react';
import { styled } from '@mui/system';
import { Typography, Button, Card, Grid } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import Popup from '../../../components/Popup';
import Login from '../../login/Login';

const PurchaseRequestCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `2px solid ${theme.palette.primary.main}`,
  width: '100%',
}));

const RequestTitle = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(2),
  fontWeight: 'bold',
}));

const RequestButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    boxShadow: `0px 0px 10px 3px ${theme.palette.secondary.main}`,
    transform: 'scale(1.1)',
  },
  height: '60px',
  borderRadius: '30px',
  padding: theme.spacing(0, 4),
  '& .MuiButton-label': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));


const NewPurchaseRequest = () => {
  const [openPopup,setOpenPopup] = useState(false);
  const handleRequestClick = () => {
    // Handle click event
    setOpenPopup(true);
    console.log('Purchase Request clicked');
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <PurchaseRequestCard>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6}>
              <RequestTitle variant="h6">New Purchase Request</RequestTitle>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                "New Purchase Request" is a formal process used to acquire goods or services. 
                It involves a detailed request, budget consideration, and evaluation. It ensures
                 accountability, transparency, and efficient resource allocation, enabling organizations
                  to make informed decisions and initiate the procurement process.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <RequestButton
                variant="contained"
                onClick={handleRequestClick}
              >
                <ShoppingCart />
                Purchase Requested
              </RequestButton>
            </Grid>
          </Grid>
        </PurchaseRequestCard>
      </Grid>
      <Popup
title="Login"
openPopup={openPopup}
setOpenPopup={setOpenPopup}
      >
        <Login/>
      </Popup>
    </Grid>
  );
};

export default NewPurchaseRequest;