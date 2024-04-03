import React, { useEffect } from 'react';
import { Grid, createTheme, ThemeProvider } from '@mui/material';
import {Button} from "@mui/material";
import MUIDataTable, { MUIDataTableOptions, Responsive } from 'mui-datatables';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../PageHeader';
import { ShoppingCart } from '@mui/icons-material';
import { SectionTitle } from '../../Section';
import { useQuotation } from '../../../context/quotationContext';

const GET_QUOTATION = gql`
query QuotationBydSupplierId($suplierId: Int!) {
  quotationBydSupplierId(suplierId: $suplierId) {
      id
      purchaseRequestId
      status
      customer {
        firstName
        lastName
      }
      supplier {
        name
        category{
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
interface purchaseRequestId {
  supplierId:number;
  }

const SentProformaComponent: React.FC<purchaseRequestId> = ({supplierId }) => {
  const navigate = useNavigate()
  const { quotations, setQuotations } = useQuotation();
  const { loading, error, data } = useQuery(GET_QUOTATION, {
    variables: { suplierId:Number(supplierId)},
  });
  const handleListItemClick = (id: number,qId:number,referenceNumber:string,requestedDate:string) => {
    navigate('/sendRFqDetail', { state: { id,qId,supplierId,referenceNumber,requestedDate} });
  };
  useEffect(() => {
    if (!loading && !error && data) {
      console.log('Fetched data:', data);
      setQuotations(data?.quotationBydSupplierId);
    }
  }, [loading, error, data, setQuotations]);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  //const { quotationBydSupplierId } = data;

  /*const tableData = quotations?.map((quotation: any) => ({
    id: quotation.purchaseRequestId,
    qId:quotation.id,
    status: quotation.status,
    customerName: `${quotation?.customer?.firstName} ${quotation?.customer?.lastName}`,
    supplierName: quotation?.supplier?.name,
    referenceNumber: quotation.purchaseRequest.referenceNumber,
    createdAt: quotation.createdAt,
  }));*/
const tableData = quotations
  ?.filter((quotation: any) => quotation.status === "quoted")
  .map((quotation: any) => ({
    id: quotation.purchaseRequestId,
    qId: quotation.id,
    status: quotation.status,
    customerName: `${quotation?.customer?.firstName} ${quotation?.customer?.lastName}`,
    category: quotation?.supplier?.category?.name,
    referenceNumber: quotation.purchaseRequest.referenceNumber,
    createdAt: quotation.createdAt,
  }));
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
  
          return (
            <span style={{ color: 'red' }}>{status}</span>
          );
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
          const referenceNumber = tableMeta.rowData[5];
          const requestedDate = tableMeta.rowData[6];

          return (
            <Button
              variant="outlined"
              onClick={() => handleListItemClick(id,qId,referenceNumber,requestedDate)}
              style={{ whiteSpace: 'nowrap' }}
            >
              View Detail sams
            </Button>
          );
        },
      },
    },
  ];

  return (
    <Grid container spacing={3}>
    
      <Grid item xs={12}>
      <SectionTitle variant="outlined" square>
      <PageHeader
      Title="Purchase Requests"
      icon={<ShoppingCart/>}
      subTitle="list of all purchase Requests"
      />
       </SectionTitle>
        <ThemeProvider theme={theme}>
          <MUIDataTable title="Requests" data={tableData} columns={columns} options={options} />
        </ThemeProvider>
      </Grid>
    </Grid>
  );
};

export default SentProformaComponent;