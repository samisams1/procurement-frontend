import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import Input from '../../Input';
import { Box, TextField } from '@mui/material';

interface Product {
  id: number;
  uom: string | null;
  title: string;
  quantity: string;
}

interface Quotation {
  purchaseRequestId: string;
}

interface ProductPrice {
  id: number;
  createdAt: string;
  price: number;
  status: string;
  product: Product;
  quotation: Quotation;
}

interface QuotationByRequestIdAdSupplierIdData {
  quotationByRequestIdAdSupplierId: ProductPrice[];
}

interface QuotationByRequestIdAdSupplierIdVariables {
  id: number | null;
  supplierId: number;
}

const GET_QUOTATION_QUERY = gql`
  query QuotationByRequestIdAdSupplierId($id: Int!, $supplierId: Int!) {
    quotationByRequestIdAdSupplierId(id: $id, supplierId: $supplierId) {
      id
      createdAt
      price
      status
      product {
        id
        uom
        title
        quantity
      }
      quotation {
        purchaseRequestId
      }
    }
  }
`;

interface Props {
  id: number;
  supplierId: number;
  status:string;
  customerId:string;
  
}

const PurchaseDetail: React.FC<{
  id: number | null;
  status: string;
  customerId: string;
  supplierId: number;
}> = ({ id, status, customerId, supplierId }) => {
  const [prices, setPrices] = useState<{ [key: string]: string }>({});
  const { loading, error, data } = useQuery<
    QuotationByRequestIdAdSupplierIdData,
    QuotationByRequestIdAdSupplierIdVariables
  >(GET_QUOTATION_QUERY, {
    variables: { id: id, supplierId: supplierId },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const quotationByRequestIdAdSupplierId = data?.quotationByRequestIdAdSupplierId || [];
  const handlePriceChange = (productId: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPrices((prevPrices) => ({
      ...prevPrices,
      [productId]: (event.target as HTMLInputElement).value,
    }));
  };
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Created At</th>
            <th>Price</th>
            <th>Status</th>
            <th>Product ID</th>
            <th>UOM</th>
            <th>Title</th>
            <th>Quantity</th>
            <th>Purchase Request ID</th>
          </tr>
        </thead>
        <tbody>
          {quotationByRequestIdAdSupplierId.map((quotation) => (
            <tr key={quotation.id}>
              <td>{quotation.id}</td>
              <td>{quotation.createdAt}</td>
              <td>{quotation.price}</td>

              <td>
                <Input
                  type="number"
                  placeholder="Please Enter Price"
                  value={quotation.price || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handlePriceChange(String(quotation.id), e)
                  }
                />
              </td>
        
              <td>{quotation.status}</td>
              <td>{quotation.product.id}</td>
              <td>{quotation.product.uom}</td>
              <td>{quotation.product.title}</td>
              <td>{quotation.product.quantity}</td>
              <td>{quotation.quotation.purchaseRequestId}</td>
            </tr>
          ))}
        </tbody>
      </table>
     
    </div>
  );
};

export default PurchaseDetail;