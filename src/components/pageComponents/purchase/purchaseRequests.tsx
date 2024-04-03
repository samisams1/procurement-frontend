import React, { useEffect, useMemo } from 'react';
import { Grid, createTheme, ThemeProvider } from '@mui/material';
import { Button } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../PageHeader';
import '../../PrintPage.css';
import { ShoppingCart } from '@mui/icons-material';
import { useQuotation } from '../../../context/quotationContext';
import { tableOptions } from '../Table/table';

const GET_QUOTATION = gql`
  query QuotationBydSupplierId($suplierId: Int!) {
    quotationBydSupplierId(suplierId: $suplierId) {
      id
      purchaseRequestId
      status
      remark
      customer {
        firstName
        lastName
      }
      supplier {
        category {
          name
        }
      }
      purchaseRequest {
        referenceNumber
      }
      createdAt
    }
  }
`;

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

interface PurchaseRequestId {
  supplierId: number;
}

const PurchaseRequests: React.FC<PurchaseRequestId> = ({ supplierId }) => {
  const navigate = useNavigate();
  const { quotations, setQuotations } = useQuotation();
  const { loading, error, data, refetch } = useQuery(GET_QUOTATION, {
    variables: { suplierId: Number(supplierId) },
  });

  useEffect(() => {
    refetch(); // Trigger the query after component mounts
  }, [refetch]);

  useEffect(() => {
    if (!loading && !error && data) {
      console.log('Fetched data:', data);
      setQuotations(data?.quotationBydSupplierId);
    }
  }, [loading, error, data, setQuotations]);

  const handleListItemClick = (
    id: number,
    qId: number,
    referenceNumber: string,
    requestedDate: string,
    customerName: string,
    category: string
  ) => {
    navigate('/sendRfq', {
      state: { id, qId, supplierId, referenceNumber, requestedDate, customerName, category },
    });
  };

  const tableData = useMemo(
    () =>
      quotations
        ?.filter((quotation: any) => quotation.status === 'pending')
        .map((quotation: any) => ({
          id: quotation.purchaseRequestId,
          qId: quotation.id,
          status: quotation.status,
          customerName: `${quotation?.customer?.firstName} ${quotation?.customer?.lastName}`,
          category: quotation?.supplier?.category?.name,
          referenceNumber: quotation.purchaseRequest.referenceNumber,
          createdAt: new Date(quotation.createdAt).toLocaleDateString(),
        })),
    [quotations]
  );

  const columns = [
    {
      name: 'id',
      label: 'ID',
    },
    {
      name: 'qId',
      label: 'QId',
    },
    {
     name: 'status',
      label: 'Status',
      options: {
        customBodyRender: (value: any, tableMeta: any) => {
          const status = tableMeta.rowData[2]; // Assuming the status is located in the second column

          return <span style={{ color: 'red' }}>{status}</span>;
        },
      },
    },
    {
      name: 'customerName',
      label: 'Customer Name',
    },
    {
      name: 'category',
      label: 'Category',
    },
    {
      name: 'referenceNumber',
      label: 'Reference Number',
    },
    {
      name: 'createdAt',
      label: 'Created At',
    },
    {
      name: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: any, tableMeta: any) => {
          const id = tableMeta.rowData[0];
          const qId = tableMeta.rowData[1];
          const customerName = tableMeta.rowData[3];
          const referenceNumber = tableMeta.rowData[5];
          const requestedDate = tableMeta.rowData[6];
          const category = tableMeta.rowData[4];

          return (
            <Button
              variant="outlined"
              onClick={() =>
                handleListItemClick(id, qId, referenceNumber, requestedDate, customerName, category)
              }
              style={{ whiteSpace: 'nowrap' }}
            >
              View Detail
            </Button>
          );
        },
      },
    },
  ];

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="print-content">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PageHeader title="Purchase Request" icon={<ShoppingCart />} imageSrc="salesForce.png" />
          <ThemeProvider theme={theme}>
            <MUIDataTable
              title="Requests"
              data={tableData}
              columns={columns}
              options={tableOptions}
             // isLoading={loading}
            />
          </ThemeProvider>
        </Grid>
      </Grid>
    </div>
  );
};

export default PurchaseRequests;