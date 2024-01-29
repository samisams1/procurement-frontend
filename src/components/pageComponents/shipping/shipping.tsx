import React, { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid, createTheme, ThemeProvider, Typography } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions,MUIDataTableColumn, Responsive } from 'mui-datatables';
import { useNavigate } from 'react-router-dom';
import { RequestPageOutlined } from '@mui/icons-material';
import Button from '../../Button';
import { SectionTitle } from '../../Section';
import PageHeader from '../../PageHeader';
import { UserContext } from '../../../auth/UserContext';
import Spinner from '../../Spinner';
interface Shipping {
  id: number;
  address: string;
  status:string;
  user:{
    firstName:string;
    lastName:string;
  }
  order: {
    id: number;
    referenceNumber: string;
    supplier:{
      name:string
    };
  };
  
}

interface GetShippingsData {
  shippings: Shipping[];
}
export const SHIPPINGS = gql`
query ShippingsByUserId($userId: Float!) {
  shippingsByUserId(userId: $userId) {
    id
    address
    status
    user{
      firstName
      lastName
    }
    order{
      id
      referenceNumber
    }
  }
}
`;

// Define your GraphQL query
const ViewShipping: React.FC = () => {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }

  const id = currentUser.id as number; // Type assertion

  return <Shipping id={id}  />;
};
  const Shipping: React.FC<{ id: number }> = ({ id }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const { loading, error, data } = useQuery<{ shippingsByUserId: Shipping[] }>(SHIPPINGS,{
    variables: {
      userId: id,
    },
  });
  if (!currentUser) {
    return <Spinner />;
  }

  
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const { shippingsByUserId } = data!;
  const handleClick = (id: string) => {
    navigate(`/manageRfq/${id}`);
  };
  const columns: MUIDataTableColumn[] = [
    {
      name: 'SN',
      options: {
        customBodyRenderLite: (dataIndex) => {
          return (
            <div>
              {dataIndex + 1}
            </div>
          );
        },
      },
    },
    {
      name: 'Customer',
      options: {
        customBodyRenderLite: (dataIndex) => {
          return (shippingsByUserId[dataIndex].user.firstName  + " " +  " " + shippingsByUserId[dataIndex].user.lastName);
        },
      },
    },
    {
      name: 'Status',
      options: {
        customBodyRenderLite: (dataIndex) => {
          return shippingsByUserId[dataIndex].status;
        },
      },
    },
    {
      name: 'Reference Number',
      options: {
        customBodyRenderLite: (dataIndex) => {
          return shippingsByUserId[dataIndex].order.referenceNumber;
        },
      },
    },
    {
      name: 'Address',
      options: {
        customBodyRenderLite: (dataIndex) => {
          return shippingsByUserId[dataIndex].address;
        },
      },
    },
    {
      name: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          return (
            <Button
              text="View Details"
             // onClick={() => handleClick(shippings[dataIndex].id)}
              style={{ cursor: 'pointer' }}
            />
          );
        },
      },
    },
  ];

  const tableData = shippingsByUserId.map((shipping) => [
 
  ]);

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

  const theme = createTheme({
    components: {
      MUIDataTableHeadCell: {
        styleOverrides: {
          root: {
            backgroundColor: '#1976d2',
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <SectionTitle variant="outlined" square>
          <PageHeader title="Shippings" icon={<RequestPageOutlined />} />
        </SectionTitle>
      </Grid>
      <Grid item xs={12}>
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