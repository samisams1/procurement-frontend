import React, { useState } from 'react';
import { TextField, Button, Grid, Paper } from '@mui/material';
import PageHeader from '../../PageHeader';
import {LocalShippingSharp, ViewAgenda } from '@mui/icons-material';
import Controls from '../../Controls';
import { useNavigate } from 'react-router-dom';

interface ShippingFormValues {
  shipmentId: string;
  senderName: string;
  senderAddress: string;
  senderContact: string;
  recipientName: string;
  recipientAddress: string;
  recipientContact: string;
  packageDimensions: string;
  packageWeight: string;
  shippingMethod: string;
}

const CreateShipping: React.FC = () => {
    const navigate  = useNavigate();
  const [formValues, setFormValues] = useState<ShippingFormValues>({
    shipmentId: '',
    senderName: '',
    senderAddress: '',
    senderContact: '',
    recipientName: '',
    recipientAddress: '',
    recipientContact: '',
    packageDimensions: '',
    packageWeight: '',
    shippingMethod: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission, e.g., call an API to create the shipping record
    console.log(formValues);
  };
  const handleClick = ()=>{
    navigate('/shipping')
}
  return (
    <Grid>
    <Paper elevation={3} sx={{ padding: '20px' }}>
        <Grid>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <PageHeader
    title="CREATE SHIPPING"
    subTitle="Create new shipping"
    icon={<LocalShippingSharp fontSize="large" />}
  />
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Controls.ActionButton 
    color="primary"
    onClick={handleClick}
    >
        
      <ViewAgenda fontSize="small" /> Shippings
    </Controls.ActionButton>

    
  </div>
</div>
  </Grid>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Grid container spacing={3}>
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="shipmentId"
            label="Shipment ID"
            value={formValues.shipmentId}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="senderName"
            label="Sender Name"
            value={formValues.senderName}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="senderAddress"
            label="Sender Address"
            value={formValues.senderAddress}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="senderContact"
            label="Sender Contact"
            value={formValues.senderContact}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="recipientName"
            label="Recipient Name"
            value={formValues.recipientName}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="recipientAddress"
            label="Recipient Address"
            value={formValues.recipientAddress}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="recipientContact"
            label="Recipient Contact"
            value={formValues.recipientContact}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="packageDimensions"
            label="Package Dimensions"
            value={formValues.packageDimensions}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="packageWeight"
            label="Package Weight"
            value={formValues.packageWeight}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="shippingMethod"
            label="Shipping Method"
            value={formValues.shippingMethod}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Create Shipping
          </Button>
        </Grid>
      </Grid>
    </form>
    </Grid>
    </Paper>
    </Paper>
    </Grid>
  );
};

export default CreateShipping;