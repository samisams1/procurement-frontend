import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Grid,
  Button, Alert
} from '@mui/material';
import { gql, useQuery, useMutation } from '@apollo/client';
import ConfirmationDialog from '../../../ConfirmationDialog';
import { UserContext } from '../../../../auth/UserContext';
interface Supplier {
  id:number;
  name: string;
  country: string;
  city: string;
  subCity: string;
  email:string;
  isVerified:boolean;
  contactNumber: string;
  phonenumber: string;
  specificName: string;
  houseNumber: string;
}
interface GetSupplierIdByUserIdData {
    companyByUserId: Supplier;
}
interface UpdateSupplierMutationData {
  updateSupplier: {
    id: number;
    name: string;
    country: string;
    city: string;
    subCity: string;
    email:string;
    isVerified:boolean;
    contactNumber: string;
    phonenumber: string;
    specificName: string;
    houseNumber: string;

  };
}
const GET_CUSTOMER_ID_BY_USER_ID = gql`
query CompanyByUserId($userId: Int!) {
    companyByUserId(userId: $userId) {
      id
      name
      userId
      email
      address
      phonenumber
      createdAt
      updatedAt
      country
      city
      houseNumber
      contactNumber
      specificName
      subCity
      isVerified
    }
  }
`;

const UPDATE_COMPANY = gql`
mutation UpdateCompany($id: Int!, $input: UpdateCompanyInput!) {
    updateCompany(id: $id, input: $input) {
      name
      email
      userId
    }
  }
`;
interface CompanyDetailProps {
  onProfileCompletion: (completion: number) => void;
}

export const CompanyDetailUser: React.FC<CompanyDetailProps> = ({ onProfileCompletion }) => {
  const { currentUser } = useContext(UserContext);
  const userId = currentUser?.id || '';
  const { error, data,refetch } = useQuery<GetSupplierIdByUserIdData>(GET_CUSTOMER_ID_BY_USER_ID, {
    variables: { userId: Number(userId) },
  });
  const [updateSupplier] = useMutation<UpdateSupplierMutationData>(UPDATE_COMPANY);
  const [name,setName] = useState(data?.companyByUserId?.name || '');
  const [email,setEmail] = useState(data?.companyByUserId?.email || '');
  const [country,setCountry] = useState(data?.companyByUserId?.country || '');
  const [city,setCity] = useState(data?.companyByUserId?.city || '');
  const [phonenumber,setPhoneNumber] = useState(data?.companyByUserId?.phonenumber || '');
  const [contactNumber,setContactNumber] = useState(data?.companyByUserId?.contactNumber || '');
  const [specificName,setSpecificName] = useState(data?.companyByUserId?.specificName || '');
  const [subCity,setSubCity] = useState(data?.companyByUserId?.subCity || '');
  const [houseNumber,setHouseNumber] = useState(data?.companyByUserId?.houseNumber || '');


  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
const [showAlert, setShowAlert] = useState(false);
const [successMessage, setSuccessMessage] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  useEffect(() => {
    if (data) {
      console.log(data);
      setName(data?.companyByUserId?.name);
      setEmail(data?.companyByUserId?.email);
      setCountry(data?.companyByUserId?.country);
      setCity(data?.companyByUserId?.city);
      setPhoneNumber(data?.companyByUserId?.phonenumber);
      setContactNumber(data?.companyByUserId?.contactNumber);
      setSpecificName(data?.companyByUserId?.specificName); 
      setSubCity(data?.companyByUserId?.subCity);
      setHouseNumber(data?.companyByUserId?.houseNumber);


    }
    if (error) {
      console.error(error);
    }
  }, [data, error]);
  const hideAlert = () => {
    setShowAlert(false);
  };
  
  useEffect(() => {
    if (showAlert) {
      const timeoutId = setTimeout(hideAlert, 5000); // Hide the alert after 5 seconds
  
      return () => {
        clearTimeout(timeoutId); // Clear the timeout when the component unmounts or when showAlert changes
      };
    }
  }, [showAlert]);
  useEffect(() => {
    if (data) {
      let completion = 20;
      if (data?.companyByUserId?.name) completion += 2;
      if (data?.companyByUserId?.country) completion += 2;
      if (data?.companyByUserId?.city) completion += 2;
      if (data?.companyByUserId?.subCity) completion += 2;
      if (data?.companyByUserId?.contactNumber) completion += 2;
      if (data?.companyByUserId?.houseNumber) completion += 2;
      if (data?.companyByUserId?.specificName) completion += 2;
      if (data?.companyByUserId?.isVerified === true) completion += 40;
  
      onProfileCompletion(completion);
    }
  }, [data, onProfileCompletion]);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    setOpenConfirmationDialog(true);
  };
  const handleConfirmationDialogClose = async (confirmed: boolean) => {
    setOpenConfirmationDialog(false);
  
    if (confirmed) {
      try {
        await updateSupplier({
          variables: {
            id: data?.companyByUserId?.id,
            input: {
              name,
              country,
              city,
              email,
              phonenumber,
              houseNumber,
              contactNumber,
              specificName,
              subCity,
            },
          },
        });
  
        setSuccessMessage('Changes saved successfully!');
        setAlertSeverity('success');
        setShowAlert(true);
  
        // Refetch the data after the mutation
        await refetch();
      } catch (error) {
        console.error(error);
        setErrorMessage('An error occurred while saving changes.');
        setAlertSeverity('error');
        setShowAlert(true);
      }
    }
  };
  return (
    <div>
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Your Company Information" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
              <TextField
  fullWidth
  label="Company Name"
  name="name"
  value={name}
  onChange={(event) => setName(event.target.value)}
/>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Contact Number" name="contactNumber" value={contactNumber} onChange={(event) => setContactNumber(event.target.value)}/>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Email" name="email" value={email} onChange={(event) => setEmail(event.target.value)}/>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Country" name="country" onChange={(event) => setCountry(event.target.value)} value={country} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="City" name="city"  value={city} onChange={(event) => setCity(event.target.value)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Sub City" name="subCity" type="text" value={subCity} onChange={(event) => setSubCity(event.target.value)}/>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Specific Name" name="specificName"  value={specificName} onChange={(event) => setSpecificName(event.target.value)}/>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Box sx={{ p: 2 }}>
          <Button type="submit" variant="contained">
            Save Changes
          </Button>
        </Box>
      </Card>
    </form>
    {/* Confirmation Dialog */}
    <ConfirmationDialog
    Detail={"Are you sure you want to save the changes?"}
    open={openConfirmationDialog}
    onClose={() => handleConfirmationDialogClose(false)}
    onConfirm={() => handleConfirmationDialogClose(true)}
  />

  {showAlert && (
  <Alert severity={alertSeverity} onClose={() => setShowAlert(false)}>
    {alertSeverity === 'success' ? successMessage : errorMessage}
  </Alert>
)}
    </div>
  );
};