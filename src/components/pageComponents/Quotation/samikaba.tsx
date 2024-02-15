import React from 'react';
import { gql, useMutation } from '@apollo/client';
const CREATE_ORDER_MUTATION = gql`
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    customerId
    supplierId
    totalPrice
    tax
    shippingCost
    status
  }
}
`;
interface Order {
  id: string;
  customerId: number;
  supplierId: number;
  totalPrice: number;
  tax: number;
  shippingCost: number;
  status: string;
}

interface OrderDetail {
  title: string;
  productId: number;
  price: number;
  quantity: number;
}

interface CreateOrderInput {
  customerId: number;
  supplierId: number;
  orderDetails: OrderDetail[];
  totalPrice: number;
  tax: number;
  status: string;
  shippingCost: number;
}

interface CreateOrderResponse {
  createOrder: Order;
}

const Samikaba: React.FC = () => {
  const [createOrder, { error }] = useMutation<CreateOrderResponse>(CREATE_ORDER_MUTATION);

  const handleSubmit = async () => {
    const input: CreateOrderInput = {
      customerId: 1,
      supplierId: 1,
      orderDetails: [
        {
          title: 'Product 1',
          productId: 1,
          price: 10.99,
          quantity: 2,
        },
        {
          title: 'Product 2',
          productId: 2,
          price: 19.99,
          quantity: 1,
        },
      ],
      totalPrice: 41,
      tax: 4.19,
      status: 'pending',
      shippingCost: 5.99,
    };

    try {
      const response = await createOrder({ variables: { input } });
      console.log('Mutation response:', response.data?.createOrder);
    } catch (error) {
      console.error('Mutation error:', error);
    }
  };

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      {/* Your component code here */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Samikaba;