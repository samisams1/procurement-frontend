import React from 'react';
import { useQuery, gql } from '@apollo/client';
import MUIDataTable from 'mui-datatables';
import PageHeader from '../../PageHeader';
import { Paper } from '@mui/material';
import { Inventory2Outlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Controls from '../../Controls';

interface Payment {
  id: number;
  paidAt: string;
  status: string;
  referenceNumber: string;
  paymentMethod: string;
}

const GET_PAYMENTS = gql`
  query GetPayments {
    payments {
      id
      paidAt
      status
      referenceNumber
      paymentMethod
    }
  }
`;

const Invoice: React.FC = () => {
  const { loading, error, data } = useQuery<{ payments: Payment[] }>(GET_PAYMENTS);
 const navigate = useNavigate();
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const payments = data?.payments || [];

  const columns = [
    'ID',
    'Paid At',
    'Status',
    'Reference Number',
    'Payment Method',
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
  ]);
  const handleViewDetail = (id: number) => {
    navigate(`/paymentConfirmation/${id}`)
  };
  return (
    <div>
      <Helmet>
        <title>Et-proforma</title>
      </Helmet>
      <Paper elevation={3} sx={{ padding: '20px' }}>
          <PageHeader
            title="Invoice "
            subTitle="you can view invoice"
            icon={<Inventory2Outlined fontSize="large" />}
          />
          <Paper elevation={3} >
      {payments.length > 0 ? (
        <MUIDataTable
          title=""
          data={tableData}
          columns={columns}
          options={options}
        />
      ) : (
        <div>No data available</div>
      )}
      </Paper>
      </Paper>
      
    </div>
  );
};

export default Invoice;