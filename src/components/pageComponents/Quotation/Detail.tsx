import React, { useEffect, useState } from 'react';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { gql, useQuery } from '@apollo/client';
import {
  Button,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import PageHeader from '../../PageHeader';
import { Details, RequestPageRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

type QuotationDetailProps = {
  qId: number;
  customerId: number;
  supplierId: number;
};

type SupplierTotals = {
  supplierId: number;
  totalAmount: number;
  supplierName: string;
  Sn?: number;
};

type QuotationData = {
  sendQuotationByRequestId: {
    supplierTotals: SupplierTotals[];
  };
};

const GET_ALL_PRODUCT_PRICES = gql`
  query SendQuotationByRequestId($id: Int!) {
    sendQuotationByRequestId(id: $id) {
      supplierTotals {
        supplierId
        totalAmount
        supplierName
        availabilityDate
      }
    }
  }
`;

const QuotationDetail: React.FC<QuotationDetailProps> = ({ qId, customerId, supplierId }) => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState<SupplierTotals[]>([]);
  const { loading, data, error } = useQuery<QuotationData>(GET_ALL_PRODUCT_PRICES, {
    variables: { id: qId },
  });

  useEffect(() => {
    if (data) {
      const updatedTableData = data.sendQuotationByRequestId.supplierTotals.map((item, index) => ({
        ...item,
        Sn: index + 1,
      }));
      setTableData(updatedTableData);
    }
  }, [data]);

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

  const columns = [
    {
      name: 'Sn',
      label: 'SN',
    },
    {
      name: 'supplierName',
      label: 'Supplier',
    },
    {
      name: 'totalAmount',
      label: 'Total Amount (Birr)',
      options: {
        customBodyRender: (value: number) => `${value} Birr`,
      },
    },
    {
      name: 'availabilityDate',
      label: 'Price Valid until',
      options: {
        customBodyRender: (value: number) => `${value} Days`,
      },
    },
  ];;

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

  const handleClick = (id: string) => {
    navigate('/bestQuotation', { state: { qId: qId, customerId: customerId } });
  };

  return (
    <div>
      <PageHeader
        title="Send Order"
        subTitle="select your price from given below of different price samples"
        icon={<RequestPageRounded fontSize="large" />}
        imageSrc="tra.jpg"
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <ThemeProvider theme={theme}>
          <MUIDataTable
            title={
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Details />}
                  onClick={() => handleClick(qId.toString())}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Best  Price
                </Button>
              </div>
            }
            data={tableData}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      )}
    </div>
  );
};

export default QuotationDetail;