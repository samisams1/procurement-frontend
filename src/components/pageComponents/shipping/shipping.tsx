import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import MUIDataTable, { MUIDataTableOptions, Responsive } from 'mui-datatables';
import { UserContext } from '../../../auth/UserContext';
import Spinner from '../../Spinner';
import { SectionTitle } from '../../Section';
import PageHeader from '../../PageHeader';
import { Details, ShoppingCart } from '@mui/icons-material';
import { Grid, createTheme, ThemeProvider, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const GET_SHIPPING_BY_USER_ID = gql`
  query ShippingByUserId($userId: Int!) {
    shippingByUserId(userId: $userId) {
      id
      orderId
      address
      userId
      status
      createdAt
      updatedAt
    }
  }
`;

const ViewShipping: React.FC = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const userId = currentUser?.id ?? '';

  const { loading, error, data } = useQuery(GET_SHIPPING_BY_USER_ID, {
    variables: { userId:Number(userId) },
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    // Handle the error state
    return <div>Error: {error.message}</div>;
  }

  const tableData = data?.shippingByUserId || [];
  const columns = [
    // Define your table columns here
    { name: 'id', label: 'ID' },
    { name: 'orderId', label: 'Order ID' },
    { name: 'address', label: 'Address' },
    { name: 'userId', label: 'User ID' },
    { name: 'status', label: 'Status' },
    { name: 'createdAt', label: 'Created At' },
    { name: 'updatedAt', label: 'Updated At' },
    {
      name: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: any, tableMeta: any) => {
          const id = tableMeta.rowData[1];
          return (
            <Button
            variant="outlined"
            color="primary"
            startIcon={<Details />}
            onClick={() => {
              navigate(`/shippingDetail/${id}`);
            }}
            style={{ whiteSpace: 'nowrap' }}
          >
            Detail
          </Button>
           );
        },
      },
    },
  ];
  const theme = createTheme({
    components: {
      MUIDataTableHeadCell: {
        styleOverrides: {
          root: {
            backgroundColor: '#00b0ad',
            color: 'white',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
      },
    },
  });
  
  const options: MUIDataTableOptions = {
    filter: true,
    download: true,
    print: true,
    search: true,
    selectableRows: 'none', // or 'single' for single row selection
    responsive: 'standard' as Responsive,
    viewColumns: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50],
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <SectionTitle variant="outlined" square>
          <PageHeader
            Title="Shippings"
            icon={<ShoppingCart />}
            subTitle="List of all Shippigs "
            imageSrc = "salesForce.png"
          />
        </SectionTitle>
        <ThemeProvider theme={theme}>
          <MUIDataTable
            title="Shippings"
            data={tableData}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </Grid>
    </Grid>
  );
};

export default ViewShipping;