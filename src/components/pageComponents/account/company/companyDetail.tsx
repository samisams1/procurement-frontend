import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Grid,
  Button
} from '@mui/material';
//import { UserContext } from '../../../../auth/UserContext';
import { gql, useQuery, useMutation } from '@apollo/client';

interface Supplier {
  id: number;
  name: string;
  address: string;
  country: string;
  city: string;
  subCity: string;
  isVerified:boolean;
  contactNumber: string;
  houseNumber: string;
  specificName: string;
}
interface GetSupplierIdByUserIdData {
  supplierIdByUserId: Supplier;
}
interface UpdateSupplierMutationData {
  updateSupplier: {
    id: number;
  };
}
const GET_SUPPLIER_ID_BY_USER_ID = gql`
  query SupplierIdByUserId($userId: Int!) {
    supplierIdByUserId(userId: $userId) {
      id
      name
      address
      country
      city
      subCity
      contactNumber
      houseNumber
      specificName
      isVerified
    }
  }
`;

const UPDATE_SUPPLIER = gql`
  mutation UpdateSupplier($id: Int!, $input: SupplierInput!) {
    updateSupplier(id: $id, input: $input) {
      id
    }
  }
`;
interface CompanyDetailProps {
  onProfileCompletion: (completion: number) => void;
}

export const CompanyDetail: React.FC<CompanyDetailProps> = ({ onProfileCompletion }) => {
  //const { currentUser } = useContext(UserContext);
 // const userId = currentUser?.id || '';
  const { error, data } = useQuery<GetSupplierIdByUserIdData>(GET_SUPPLIER_ID_BY_USER_ID, {
    variables: { userId: Number(1) },
  });
  const [updateSupplier] = useMutation<UpdateSupplierMutationData>(UPDATE_SUPPLIER);
 /* useEffect(() => {
    onProfileCompletion(15);
  }, []); 
*/
  useEffect(() => {
    if (data) {
      console.log(data);
    }
    if (error) {
      console.error(error);
    }
  }, [data, error]);
  useEffect(() => {
    if (data) {
      let completion = 20;
      if (data?.supplierIdByUserId?.name) completion += 2;
      if (data?.supplierIdByUserId?.address) completion += 2;
      if (data?.supplierIdByUserId?.country) completion += 2;
      if (data?.supplierIdByUserId?.city) completion += 2;
      if (data?.supplierIdByUserId?.subCity) completion += 2;
      if (data?.supplierIdByUserId?.contactNumber) completion += 2;
      if (data?.supplierIdByUserId?.houseNumber) completion += 2;
      if (data?.supplierIdByUserId?.specificName) completion += 2;
      if (data?.supplierIdByUserId?.isVerified === true) completion += 40;
  
      onProfileCompletion(completion);
    }
  }, [data, onProfileCompletion]);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await updateSupplier({
        variables: {
          id: data?.supplierIdByUserId?.id,
          input: {
            name: data?.supplierIdByUserId?.name,
            address: data?.supplierIdByUserId?.address,
            country: data?.supplierIdByUserId?.country,
            city: data?.supplierIdByUserId?.city,
            subCity: data?.supplierIdByUserId?.subCity,
            contactNumber: data?.supplierIdByUserId?.contactNumber,
            houseNumber: data?.supplierIdByUserId?.houseNumber,
            specificName: data?.supplierIdByUserId?.specificName,
          },
        },
      });

      alert('Changes saved successfully!');
    } catch (error) {
      console.error(error);
      alert('An error occurred while saving changes.');
    }
  };

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Your Company Information" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Company Name" name="name" required value={data?.supplierIdByUserId?.name || ''} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Contact Number" name="contactNumber" required value={data?.supplierIdByUserId?.contactNumber || ''} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Country" name="country" required value={data?.supplierIdByUserId?.country || ''} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="City" name="city" required value={data?.supplierIdByUserId?.city || ''} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Sub City" name="subCity" type="text" value={data?.supplierIdByUserId?.subCity || ''} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Specific Name" name="specificName" required value={data?.supplierIdByUserId?.specificName || ''} />
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
  );
};