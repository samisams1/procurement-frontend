import React, { useState } from 'react';
import { Grid, Paper, TextField, Button, Typography, Checkbox } from '@mui/material';
import { gql, useQuery } from '@apollo/client';

export interface SaleInput {
  productTitle: string;
  // Add other relevant properties based on your application's requirements
}

interface RequestFormProps {
  onSubmit: (products: SaleInput[], selectedSuppliers: number[]) => void;
}

interface SupplierData {
  suppliers: {
    id: number;
    user: {
      firstName: string;
      lastName: string;
    };
  }[];
}

const GET_SUPPLIERS = gql`
  query GetSuppliers {
    suppliers {
      id
      user {
        firstName
        lastName
      }
    }
  }
`;

const RequestForm: React.FC<RequestFormProps> = ({ onSubmit }) => {
  const [productTitles, setProductTitles] = useState<string[]>(['']);
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);

  const { loading, error, data } = useQuery<SupplierData>(GET_SUPPLIERS);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { suppliers } = data!;

  const handleTitleChange = (index: number, value: string) => {
    const updatedTitles = [...productTitles];
    updatedTitles[index] = value;
    setProductTitles(updatedTitles);
  };

  const handleAddTitle = () => {
    setProductTitles([...productTitles, '']);
  };

  const handleRemoveTitle = (index: number) => {
    const updatedTitles = [...productTitles];
    updatedTitles.splice(index, 1);
    setProductTitles(updatedTitles);
  };

  const handleSupplierChange = (supplierId: number) => {
    const isSelected = selectedSuppliers.includes(supplierId);
    let updatedSelectedSuppliers: number[];

    if (isSelected) {
      updatedSelectedSuppliers = selectedSuppliers.filter((id) => id !== supplierId);
    } else {
      updatedSelectedSuppliers = [...selectedSuppliers, supplierId];
    }

    setSelectedSuppliers(updatedSelectedSuppliers);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create an array of SaleInput objects from the productTitles array
    const products: SaleInput[] = productTitles.map((title) => ({ productTitle: title }));

    onSubmit(products, selectedSuppliers);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ padding: '20px' }}>
          <Typography variant="h3" align="center">
            Purchase Request Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3} sx={{ padding: '20px' }}>
                  <Typography variant="h6">Supplier Information</Typography>
                  <Typography>Please select supplier to send purchase request.</Typography>
                  {suppliers.map((supplier) => (
                    <div style={{ display: 'flex', alignItems: 'center' }} key={supplier.id}>
                      <Checkbox
                        checked={selectedSuppliers.includes(supplier.id)}
                        onChange={() => handleSupplierChange(supplier.id)}
                      />
                      <Typography>
                        {supplier.user.firstName} {supplier.user.lastName}
                      </Typography>
                    </div>
                  ))}
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3} sx={{ padding: '20px' }}>
                  <Typography variant="h6">Product Form</Typography>
                  <Typography>Please send us your request by filling in the form below.</Typography>
                  {productTitles.map((title, index) => (
                    <Grid container alignItems="center" spacing={2} key={index}>
                      <Grid item xs={10}>
                        <TextField
                          label="Product Title"
                          variant="outlined"
                          value={title}
                          onChange={(e) => handleTitleChange(index, e.target.value)}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleRemoveTitle(index)}
                          fullWidth
                        >
                          Remove
                        </Button>
                      </Grid>
                      <Grid item xs={12} sx={{ height: '8px' }} />
                    </Grid>
                  ))}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Button variant="contained" color="primary" onClick={handleAddTitle}
                      fullWidth>
                        Add Product
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button type="submit" variant="contained" color="primary" fullWidth>
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RequestForm;