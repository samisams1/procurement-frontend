import React, { useContext, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, createTheme, ThemeProvider } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { useNavigate } from 'react-router-dom';
import Button from '../../../Button';
import { UserContext } from '../../../../auth/UserContext';
import Spinner from '../../../Spinner';
import { GET_ORDER_BY_SUPPLIER_ID_QUERY } from '../../../../graphql/Order';
const ConfirmedOrders: React.FC<{userId: number}> = ({userId}) => {
  const navigate = useNavigate();
  const { loading, error, data,refetch } = useQuery(GET_ORDER_BY_SUPPLIER_ID_QUERY, {
    variables: { id: Number(userId),status:"comformed"  }, // Specify the userId here
  });
  const { currentUser } = useContext(UserContext);
  useEffect(() => {
    refetch();
  }, [refetch]);
  if (!currentUser) {
    return <Spinner />;
  }

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

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
  const tableData = data.getOrderBySupplierId.map((order: any, index: number) => {
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
            title="Orders"
            data={tableData}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </Grid>
    </Grid>
  );
};

export default ConfirmedOrders;