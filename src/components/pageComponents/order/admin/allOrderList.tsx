import React, { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid, createTheme, ThemeProvider } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions, Responsive } from 'mui-datatables';
import { useNavigate } from 'react-router-dom';
import Button from '../../../Button';
import { SectionTitle } from '../../../Section';
import PageHeader from '../../../PageHeader';
import { ShoppingCart } from '@mui/icons-material';
import { UserContext } from '../../../../auth/UserContext';
import Spinner from '../../../Spinner';
// Define your GraphQL query
const ORDER_QUERY = gql`
query{
  orders{
     id
      status
      tax
      totalPrice
      createdAt
      shippingCost
      customerId
    supplierId
  }
}
`;
interface OrderInterface {
  id: string;
  customerId: string;
  supplierId: string;
  totalPrice: number;
  createdAt: string;
  status: string;
  newstatus:string;
}
const AllOrderList: React.FC = () => {
  const navigate  = useNavigate();
  const { loading, error, data } = useQuery(ORDER_QUERY);
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  if (loading) return <Spinner />;
  if (error) return <p>{error.message}</p>;

  // Access the data returned by the query
  const columns = [
    { name: 'SN', options: { filter: false, sort: false } },
    'ID',
    'Reference Number',
    'User',
    'Suppliers',
    'Status',
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
              text="View Details"
              onClick={() => {
              //  setOpenPopup(true);
              //  setNewData(tableMeta.rowData);
              navigate(`/orderDetail/${id}`);
              }}
              
              style={{ cursor: 'pointer' }}
            />
          );
        },
      },
    },
  ];

  const tableData = data.orders.map((order: OrderInterface, index: number) => [
    index + 1,
    order.id,
    order.customerId,
    order.supplierId,
    order.totalPrice,
    order.status ==="pending" ?
    <span style={{ color: 'red' }}>{order.status}</span>:
    <span style={{ color: 'green' }}>{order.status}</span>,
    order.createdAt,
    '',
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
        <SectionTitle variant="outlined" square>
          <PageHeader title="order" icon={<ShoppingCart />} />
        </SectionTitle>
      </Grid>
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

export default AllOrderList;