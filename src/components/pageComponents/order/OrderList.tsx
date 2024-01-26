/*import React, { useContext, useState } from 'react';
import { Chip, Grid, Stack } from '@mui/material';
import OrderDetail from './OrderDetail';
import { UserContext } from '../../../auth/UserContext';
import Spinner from '../../Spinner';
import Button from '../../Button';
import MUIDataTable from 'mui-datatables';
import Popup from '../../Popup';
import { gql, useQuery } from '@apollo/client';

const ORDER_QUERY = gql`
  query GetOrderDetailBySupplierId($supplierId: Float!) {
    getOrderBySupplierId(supplierId: $supplierId) {
      id
      status
      tax
      totalPrice
      createdAt
      shippingCost
      customerId
    supplierId
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

interface CreateOrderComponentProps {
  supplierId: number;

}

const OrderList: React.FC =()=> {
  const { currentUser } = useContext(UserContext);
  
  if (!currentUser) {
    return <Spinner />;
  }
  
  const customerId = currentUser.id as number; // Type assertion
  
  return <List   supplierId = {customerId}  />;
  };

  const List: React.FC<CreateOrderComponentProps> = ({supplierId}) => {

  const [openPopup, setOpenPopup] = useState(false);
  const [newData, setNewData] = useState<any>('');
  const { loading, error, data } = useQuery(ORDER_QUERY, {
    variables: { supplierId: supplierId },
  });

  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }

  if (loading) return <Spinner />;
  if (error) return <p>{error.message}</p>;

  const productList = data.getOrderBySupplierId.map((row: OrderInterface) => [
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
          return (
            <Button
              text="Show Detail"
              variant="outlined"
              onClick={() => {
                setOpenPopup(true);
                setNewData(tableMeta.rowData);
              }}
            />
          );
        },
      },
    },
  ];

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
        {newData && <OrderDetail id={newData[0]}  status={newData[5]} newstatus={"comformed"} />}
      </Popup>
    </Grid>
  );
};

export default OrderList; */
import React, { useContext, useState } from 'react';
import { Chip, Grid, Stack } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import { gql, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../Spinner';
import { UserContext } from '../../../auth/UserContext';
import Button from '../../Button';
import Popup from '../../Popup';
import SubOrderDetail from './OrderDetail';
const ORDER_QUERY = gql`
query GetOrderDetailBySupplierId($supplierId: Float!) {
  getOrderBySupplierId(supplierId: $supplierId) {
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
const OrderList : React.FC = () => {
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
  variables: { supplierId: id },
});
  if (loading) return <Spinner />;
  if (error) return <p>{error.message}</p>;

  const productList = data.getOrderBySupplierId.map((row: OrderInterface) => [
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
    navigate(`/subOrderDetail/${id}`);
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
        {<SubOrderDetail />}
      </Popup>
    </Grid>
  );
};
export default OrderList
