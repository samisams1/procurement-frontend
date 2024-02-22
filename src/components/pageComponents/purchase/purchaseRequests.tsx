import React, { useEffect, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { ThemeProvider, useTheme } from '@mui/material/styles';
//import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import {Button} from "@mui/material";
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import PageHeader from "../../PageHeader";
interface PurchaseRequest {
  id: number;
  userId: number;
  status: string;
  remark: string;
  addressDetail: string;
  estimatedDelivery: string;
  referenceNumber: string;
  createdAt: string;
  user: {
    firstName: string;
  };
  products: {
    id: number;
    Description: string;
    title: string;
  }[];
}

interface PurchaseRequestData {
  purchaseRequestBYSupplierId: PurchaseRequest[];
}

interface FilterInput {
  field: string;
  value: string;
}

interface Variables {
  userId: number;
  orderBy?: string;
  filter?: FilterInput;
  page?: number;
  pageSize?: number;
  search?: string;
}

const GET_PURCHASE_REQUESTS = gql`
  query PurchaseRequests(
    $userId: Int!
    $search: String
    $filter: FilterInput
    $page: Int
    $pageSize: Int
    $orderBy: String
  ) {
    purchaseRequestBYSupplierId(
      userId: $userId
      search: $search
      filter: $filter
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
    ) {
      id
      userId
      status
      remark
      addressDetail
      estimatedDelivery
      referenceNumber
      createdAt
      user {
        firstName
      }
      products {
        id
        Description
        title
      }
    }
  }
`;

const PurchaseRequests: React.FC = () => {
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [searchValue] = useState('');
  const [filterValue] = useState('');
  const [orderByValue] = useState('');
  const [page] = useState(1);
  const [pageSize] = useState(10);

  const navigate = useNavigate();
  const [getPurchaseRequests, { loading, error, data }] = useLazyQuery<PurchaseRequestData, Variables>(
    GET_PURCHASE_REQUESTS
  );

  useEffect(() => {
    getPurchaseRequests({
      variables: {
        userId: 1,
        orderBy: orderByValue || undefined,
        filter: filterValue
          ? { field: "referenceNumber", value: filterValue }
          : undefined,
        page,
        pageSize,
        search: searchValue || undefined,
      },
    });
  }, [getPurchaseRequests, searchValue, filterValue, orderByValue, page, pageSize]);

  useEffect(() => {
    if (data) {
      setPurchaseRequests(data.purchaseRequestBYSupplierId);
    }
  }, [data]);

  const theme = useTheme();
  //const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /*const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value);
  };

  const handleOrderByChange = (event: SelectChangeEvent) => {
    setOrderByValue(event.target.value as string);
  };

  const handlePageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(parseInt(event.target.value, 10));
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
  }; */

  const handleListItemClick = (id: number) => {
    navigate('/sendRfq', { state: { id } });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  const columns = [
    '#',
    'ID',
    'Reference Number',
    'Status',
    'Created At',
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
              onClick={() => handleListItemClick(id)}
              style={{ whiteSpace: 'nowrap' }}
            >
              View Detail
            </Button>
          );
        },
      },
    },
  ];

  const dataTable = purchaseRequests.map((request, index) => [
    index + 1,
    request.id,
    request.referenceNumber,
    request.status,
    new Date(request.createdAt).toLocaleString(),
  ]);

  const options: MUIDataTableOptions = {
    //responsive: Responsive.MultipleBreakpoints,
    selectableRows: 'none',
  };

  return (
    <ThemeProvider theme={theme}>
      <PageHeader
      title="Purchase Requests"
      />
    <MUIDataTable
      title="Purchase Requests"
      data={dataTable}
      columns={columns}
      options={options}
    />
  </ThemeProvider>
  );
};

export default PurchaseRequests;