import React from 'react';
import { useQuery, gql } from '@apollo/client';
import MUIDataTable from 'mui-datatables';
import PageHeader from '../../PageHeader';
import { Paper } from '@mui/material';
import { Inventory2Outlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Controls from '../../Controls';
import { SectionTitle } from '../../Section';
import { createTheme, ThemeProvider } from '@mui/material';
interface Payment {
  id: number;
  paidAt: string;
  status: string;
  amount:number
  referenceNumber: string;
  paymentMethod: string;
}

const GET_PAYMENTS = gql`
query PaymentBycustomer($customerId: Int!) {
  paymentBycustomer(customerId: $customerId) {
      id
      paidAt
      amount
      status
      referenceNumber
      paymentMethod
    }
  }
`;
interface userId { 
  userId:Number;
}
const Invoice: React.FC<userId> = ({userId}) => {
  const { loading, error, data } = useQuery<{ paymentBycustomer: Payment[] }>(GET_PAYMENTS,{
    variables:{customerId:userId}
  });
 const navigate = useNavigate();
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const payments = data?.paymentBycustomer || [];

  const columns = [
    'ID',
    'Paid At',
    'Status',
    'Reference Number',
    'Payment Method',
    'Amount',
    {
      name: 'Actions',
      options: {
        customBodyRenderLite: (dataIndex: number) => (
         <Controls.ActionButton
                color="primary"
                onClick={() => handleViewDetail(payments[dataIndex].id)}
                >
                 View Detail
          </Controls.ActionButton>
           
        ),
      },
    },
  ];

  const options = {
    filterType: 'checkbox' as const,
    responsive: 'vertical' as const,
    selectableRows: 'none' as const,
    print: false,
    download: false,
    viewColumns: false,
    pagination: false,
    search: true,
    rowHover: false,
  };

  const tableData = payments.map((payment) => [
    payment.id,
    payment.paidAt,
    payment.status,
    payment.referenceNumber,
    payment.paymentMethod,
    payment.amount,
   
  ]);
  const handleViewDetail = (id: number) => {
    navigate(`/paymentConfirmation/${id}`)
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
    <div>
      <Helmet>
        <title>Et-proforma</title>
      </Helmet>
      <Paper elevation={3} sx={{ padding: '20px' }}>
        <SectionTitle>
          <PageHeader
            title="Invoice "
            subTitle="you can view invoice"
            icon={<Inventory2Outlined fontSize="large" />}
          />
          </SectionTitle>
          <Paper elevation={3} >
      {payments.length > 0 ? (
          <ThemeProvider theme={theme}>
        <MUIDataTable
          title=""
          data={tableData}
          columns={columns}
          options={options}
        />
        </ThemeProvider>
      ) : (
        <div>No data available</div>
      )}
      </Paper>
      </Paper>
      
    </div>
  );
};

export default Invoice;