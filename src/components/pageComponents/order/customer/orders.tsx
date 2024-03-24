import React, { useContext, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid, createTheme, ThemeProvider } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { useNavigate } from 'react-router-dom';
import Button from '../../../Button';
import { UserContext } from '../../../../auth/UserContext';
import Spinner from '../../../Spinner';

const ORDER_QUERY = gql`
  query GetOrderUserById($getOrderByUserIdId: Int!) {
    getOrderByUserId(id: $getOrderByUserIdId) {
      id
      customerId
      supplierId
      totalPrice
      tax
      shippingCost
      status
      createdAt
      updatedAt
      referenceNumber
      purchaseRequestId
      supplier {
        name
      }
      customer {
        username
      }
    }
  }
`;
const Orders: React.FC<{userId: number}> = ({userId}) => {
  const navigate = useNavigate();
  const { loading, error, data,refetch } = useQuery(ORDER_QUERY, {
    variables: { getOrderByUserIdId: Number(userId)  }, // Specify the userId here
  });
  useEffect(() => {
    refetch(); // Trigger the query after component mounts
  }, [refetch]);
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>{error.message}</p>;
  }
  console.log("order")


  const order = data.getOrderByUserId;
  const shipping = order.shippingCost;
  console.log(order)
  const columns = [
    { name: 'SN', options: { filter: false, sort: false } },
    'ID',
    {
      name: 'Reference Number',
      options: {
        display: true,
      },
    },
   
    {
      name: 'Status',
      options: {
        display: true,
      },
    },
    'Date',
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
            onClick={() => {
              navigate(`/orderDetail/${id}`);
            }}
            style={{ whiteSpace: 'nowrap' }}
          text="View Detail"  
          />
          );
        },
      },
    },
  ];
  const tableData = data.getOrderByUserId.map((order: any, index: number) => {
    const createdAtDate = new Date(order.createdAt);
    const formattedDate = createdAtDate.toLocaleString();
  
    return [
      index + 1,
      order.id,
      order.referenceNumber,
      order.status === 'pending' ? (
        <span style={{ color: 'red' }}>{order.status}</span>
      ) : (
        <span style={{ color: 'green' }}>{order.status}</span>
      ),
      formattedDate,
      '',
    ];
  });

  const options: MUIDataTableOptions = {
    filter: true,
    download: true,
    print: true,
    search: true,
    selectableRows: 'none', // or 'single' for single row selection
    responsive: 'standard',
    viewColumns: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50],
  };
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ThemeProvider theme={theme}>
          <MUIDataTable
            title={shipping}
            data={tableData}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </Grid>
    </Grid>
  );
};

export default Orders;