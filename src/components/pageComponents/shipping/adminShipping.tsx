import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid, createTheme, ThemeProvider } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions,MUIDataTableColumn, Responsive } from 'mui-datatables';
import { useNavigate } from 'react-router-dom';
import { RequestPageOutlined } from '@mui/icons-material';
import Button from '../../Button';
import { SectionTitle } from '../../Section';
import PageHeader from '../../PageHeader';
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
query{
  shippings{
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
`
// Define your GraphQL query
const AdminShipping: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery<{ shippings: Shipping[] }>(SHIPPINGS);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const { shippings } = data!;
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
          return (shippings[dataIndex].user.firstName  + " " +  " " + shippings[dataIndex].user.lastName);
        },
      },
    },
    {
      name: 'Status',
      options: {
        customBodyRenderLite: (dataIndex) => {
          return shippings[dataIndex].status;
        },
      },
    },
    {
      name: 'Reference Number',
      options: {
        customBodyRenderLite: (dataIndex) => {
          return shippings[dataIndex].order.referenceNumber;
        },
      },
    },
    {
      name: 'Address',
      options: {
        customBodyRenderLite: (dataIndex) => {
          return shippings[dataIndex].address;
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

  const tableData = shippings.map((shipping) => [
 
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

export default AdminShipping;