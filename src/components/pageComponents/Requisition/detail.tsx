import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';

interface Product {
  id: number;
  Description: string;
  code: string;
  manufacture: string;
  model: string;
  partNumber: string;
  quantity: number;
  title: string;
  uom: string;
}

interface PurchaseRequest {
  id: number;
  userId: string;
  status: string;
  remark: string;
  addressDetail: string;
  estimatedDelivery: string;
  referenceNumber: string;
  createdAt: string;
  products: Product[];
}

interface PurchaseRequestByIdQueryResponse {
  purchaseRequestById: PurchaseRequest;
}

interface PurchaseRequestByIdVariables {
  purchaseRequestByIdId: number;
}

const PURCHASE_REQUEST_BY_ID_QUERY = gql`
  query PurchaseRequestById($purchaseRequestByIdId: Int!) {
    purchaseRequestById(id: $purchaseRequestByIdId) {
      id
      userId
      status
      remark
      addressDetail
      estimatedDelivery
      referenceNumber
      createdAt
      products {
        id
        Description
        code
        manufacture
        model
        partNumber
        quantity
        title
        uom
      }
    }
  }
`;

const Detail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { loading, error, data } = useQuery<PurchaseRequestByIdQueryResponse, PurchaseRequestByIdVariables>(
    PURCHASE_REQUEST_BY_ID_QUERY,
    {
      variables: { purchaseRequestByIdId: Number(id) },
    }
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const purchaseRequest = data?.purchaseRequestById;

  if (!purchaseRequest) {
    return <p>No data available</p>;
  }

  return (
    <div>
      <h2>Purchase Request Details</h2>
      <p>ID: {purchaseRequest.id}</p>
      <p>User ID: {purchaseRequest.userId}</p>
      <p>Status: {purchaseRequest.status}</p>
      {/* Display other fields as needed */}
      
      <h3>Products</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Code</th>
            <th>Manufacture</th>
            <th>Model</th>
            <th>Part Number</th>
            <th>Quantity</th>
            <th>Title</th>
            <th>UOM</th>
          </tr>
        </thead>
        <tbody>
          {purchaseRequest.products?.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.Description}</td>
              <td>{product.code}</td>
              <td>{product.manufacture}</td>
              <td>{product.model}</td>
              <td>{product.partNumber}</td>
              <td>{product.quantity}</td>
              <td>{product.title}</td>
              <td>{product.uom}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Detail;