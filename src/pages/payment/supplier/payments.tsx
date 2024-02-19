import { useQuery } from '@apollo/client';
import { SUPPLIER_PAYMENTS } from '../../../graphql/payments';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { Grid, createTheme, ThemeProvider } from '@mui/material';
import Controls from '../../../components/Controls';

interface SupplierPaymentDetailsProps {
  supplierPaymentsId: number;
}

function SupplierPaymentDetails({ supplierPaymentsId }: SupplierPaymentDetailsProps) {
  const { loading, error, data } = useQuery<{ supplierPayments: any[] }>(SUPPLIER_PAYMENTS, {
    variables: { supplierPaymentsId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  const supplierPayments = data?.supplierPayments || [];
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
    'amount',
    {
        name: 'Actions',
        options: {
          customBodyRenderLite: (dataIndex: number) => (
           <Controls.ActionButton
                  color="primary"
                //  onClick={() => handleViewDetail(payments[dataIndex].id)}
                  >
                   View Detail
            </Controls.ActionButton>
             
          ),
        },
      },
  ];

 
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
  const paymentData = supplierPayments.map((payment: any, index: number) => [
    index + 1,
    payment.id,
    payment.referenceNumber,
    payment.status,
    payment.paidAt,
    payment.amount,
  ]);
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
      title="Supplier Payment Details"
      data={paymentData}
      columns={columns}
      options={options}
    />
  </ThemeProvider>
</Grid>
</Grid>
  );
}

export default SupplierPaymentDetails;