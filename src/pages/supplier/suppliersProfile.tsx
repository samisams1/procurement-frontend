import React from 'react';
import { Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import {  Dashboard } from '@mui/icons-material';import PageHeader from '../../components/PageHeader';
import { SupplierProfile } from '../../components/pageComponents/supplier/supplierProfile';
import { SuppllierProfileDetails } from '../../components/pageComponents/supplier/SupplierProfileDetails';
import Notification from '../notification/notification';

const SectionTitle = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
}));

const SuppliersProfile = () => {
 
  return (
    <Grid container spacing={3}>
      <Notification/>
      <Grid item xs={12}>
        <SectionTitle variant="outlined" square>
         <PageHeader
         title="Supplier Profile"
        icon={<Dashboard/>}  
         />

        </SectionTitle>
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
         <SupplierProfile/>
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
          <SuppllierProfileDetails/>
      </Grid>
    </Grid>
  );
};

export default SuppliersProfile
