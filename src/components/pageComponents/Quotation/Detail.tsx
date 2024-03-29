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
  totalDiscountPrice:number;
  supplierName: string;
  shippingPrice: number; // Added shippingPrice property
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
        totalDiscountPrice
        supplierName
        shippingPrice
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
    selectableRows: 'none',
    responsive: 'standard',
    viewColumns: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50],
    customToolbar: () => {
      return (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Details />}
          onClick={() => handleClick(qId.toString())}
          style={{ whiteSpace: 'nowrap' }}
        >
          Best Price sasaw
        </Button>
      );
    },
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
      label: 'Total Amount (ETB)', // Added tax column
      options: {
        customBodyRender: (value: any, tableMeta: any) => {
          const totalAmount = tableData[tableMeta.rowIndex]?.totalAmount;
          const discount = tableData[tableMeta.rowIndex]?.totalDiscountPrice;

          const shippingPrice = tableData[tableMeta.rowIndex]?.shippingPrice;
          const subTotal  = totalAmount + shippingPrice;
          const tax = Number(calculateTax(subTotal));
          const vat = Number(calculateVat(subTotal));
          const serviseCharge = Number(calculateServiseCharge(subTotal));
          const total= subTotal + tax + vat + serviseCharge;
          return `${(total - Number(discount)).toLocaleString() } `;
        },
      },
    },
    {
      name: 'availabilityDate',
      label: 'Availability Date (DAYS)',
    },
    {
      name: 'action',
      label: 'Action',
      options: {
        customBodyRender: (value: any, tableMeta: any) => {
          const supplierId = tableData[tableMeta.rowIndex]?.supplierId;
          return (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleActionClick(supplierId)}
              style={{ whiteSpace: 'nowrap' }}
            >
              Action
            </Button>
          );
        },
      },
    },
  ];

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
    navigate('/bestQuotation', {state: { qId: qId, customerId: customerId } });
  };

  const handleActionClick = (supplierId: number) => {
    navigate('/bestQuotation', { state: { qId: qId, customerId: customerId, supplierId: supplierId } });
  };

  const calculateTax = (subTotal: number, ) => {
    const taxPercentage = 0.35; // Assuming tax rate is 10%
    const tax =subTotal * taxPercentage;
    return tax.toFixed(2);
  };
  const calculateVat = (subTotal: number, ) => {
    const taxPercentage = 0.15; // Assuming tax rate is 10%
    const vat =subTotal * taxPercentage;
    return vat.toFixed(2);
  };
  const calculateServiseCharge = (subTotal: number, ) => {
    const taxPercentage = 0.01; // Assuming tax rate is 10%
    const serviceCharge =subTotal * taxPercentage;
    return serviceCharge.toFixed(2);
  };
  return (
    <div>
      <PageHeader
        title="Quotation"
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
            title=""
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