import React, { useContext, useState } from 'react';
import { Chip, Grid, Stack } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../auth/UserContext';
import Spinner from '../../Spinner';
import Button from '../../Button';
import Popup from '../../Popup';
import OrderDetail from '../order/customer/orderDetail';
import MUIDataTable from 'mui-datatables';
const ORDER_QUERY = gql`
query GetApprovedOrderByCustomerId($customerId: Float!) {
    getApprovedOrderByCustomerId(customerId: $customerId) {
     id
      status
      tax
      totalPrice
      createdAt
      shippingCost
      customerId
    supplierId
    orderDetails {
      id
      price
      quantity
    }
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
  newstatus: string;
}
const MakePaymentComponent : React.FC = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  if (!currentUser) {
    return <Spinner />;
  }

  const id = currentUser.id as number; // Type assertion

  return <List id={id} navigate={navigate} />;
};

  const List: React.FC<{ id: number; navigate: any }> = ({ id, navigate }) => {

  const [openPopup, setOpenPopup] = useState(false);
const { loading, error, data } = useQuery(ORDER_QUERY, {
  variables: { customerId: id },
});
  if (loading) return <Spinner />;
  if (error) return <p>{error.message}</p>;

  const productList = data.getApprovedOrderByCustomerId.map((row: OrderInterface) => [
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
    {
      name: 'Status',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return (
            <Stack direction="row" spacing={1}>
              {value === 'approved' ? (
                <Chip label={value} color="primary" />
              ) : (
                <Chip label={value} color="secondary" />
              )}
            </Stack>
          );
        },
      },
    },
    {
      name: 'Invoice',
      options: {
        filter: true,
        sort: false,
        empty: true,
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          const orderId = productList[tableMeta.rowIndex][0];
          return (
            <Button 
              text="Show Detail"
              variant="outlined"
              onClick={() => handleClick(orderId)}        
            />
          );
        },
      },
    },
    
  ];

  const handleClick = (id: string) => {
    navigate(`/orderDetail/${id}`);
  };
  return (
    <Grid container>
      <Grid item xs={12}>
        <MUIDataTable title="Order" data={productList} columns={columns} />
      </Grid>
      <Popup
        title="Order Detail "
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        {<OrderDetail  />}
      </Popup>
    </Grid>
  );
};
export default MakePaymentComponent
