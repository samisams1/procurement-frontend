import React, { useContext } from 'react';
import { Grid } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../Spinner';
import MUIDataTable from 'mui-datatables';
import { UserContext } from '../../../auth/UserContext';

interface Order {
  id: string;
  customerId: string;
  supplierId: string;
  totalPrice: number;
  tax: number;
  shippingCost: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  referenceNumber: string;
  purchaseRequestId: string;
}

interface GetApprovedOrdersData {
  getApprovedOrderByCustomerId: Order[];
}

interface GetApprovedOrdersVariables {
  customerId: number;
}

const ORDER_QUERY = gql`
  query GetApprovedOrderByCustomerId($customerId: Int!) {
    getApprovedOrderByCustomerId(customerId: $customerId) {
      id
      customerId
      supplierId
      totalPrice
      tax
      shippingCost
      status
      createdAt
      updatedAt
      referenceNumber
      purchaseRequestId
    }
  }
`;

const List: React.FC<{ id: number; navigate: any }> = ({ id, navigate }) => {
 // const [openPopup, setOpenPopup] = useState(false);
  const { loading, error, data } = useQuery<GetApprovedOrdersData, GetApprovedOrdersVariables>(ORDER_QUERY, {
    variables: { customerId: 1 },
  });

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  const orderData = data?.getApprovedOrderByCustomerId || [];

  // Add a check to ensure orderData is an array
  if (!Array.isArray(orderData)) {
    return <p>No order data available</p>;
  }

  const productList = orderData.map((row: Order) => [
    row.id,
    row.customerId,
    row.supplierId,
    row.totalPrice,
    row.createdAt,
    row.status,
  ]);

  const columns = [
    {
      name: '#Order Id',
      options: {
        filter: true,
      },
    },
    {
      name: 'Customer',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'Supplier',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'Total Price',
      options: {
        filter: true,
      },
    },
    {
      name: 'Date',
      options: {
        filter: true,
        sort: false,
      },
    },
  ];

  /*const handleClick = (id: string) => {
    navigate(`/orderDetail/${id}`);
  };*/

  return (
    <Grid container>
      <Grid item xs={12}>
        <MUIDataTable title="Order" data={productList} columns={columns} />
      </Grid>
    </Grid>
  );
};

const MakePaymentComponent: React.FC = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  if (!currentUser) {
    return <Spinner />;
  }

  const id = currentUser.id as number;

  return <List id={id} navigate={navigate} />;
};

export default MakePaymentComponent;