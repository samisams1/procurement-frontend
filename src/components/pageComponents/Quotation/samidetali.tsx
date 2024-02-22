import React, { useState } from 'react';
import { Grid, Paper, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Button } from '@mui/material';
import { useQuery, gql } from '@apollo/client';

const QUOTATION_BY_REQUEST_ID = gql`
  query QuotationByRequestId($id: Int!) {
    quotationByRequestId(id: $id) {
      id
      productId
      quotationId
      status
      createdAt
      updatedAt
      product {
        id
        Description
        code
        manufacture
        model
        partNumber
        quantity
        title
        uom
        mark
      }
      quotation {
        id
        supplierId
        shippingPrice
        status
        customer {
          id
        }
        supplier {
          name
        }
      }
    }
  }
`;

type ProductPrice = {
  id: string;
  status: string;
  product: {
    id: string;
    title: string;
    quantity: number;
  };
  quotation: {
    id: string;
    supplier: {
      name: string;
    };
    customer: {
      id: string;
    };
  };
  quotationId: string; // Add the quotationId property
  // Add other properties as needed
};

type SelectedItems = {
  [productId: string]: boolean;
};

type QuotationDetailProps = {
  qId: number;
};

const QuotationDetail: React.FC<QuotationDetailProps> = ({ qId }) => {
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});

  const { loading, error, data } = useQuery(QUOTATION_BY_REQUEST_ID, {
    variables: { id: qId },
  });

  const handleCheckboxChange = (productId: string, checked: boolean) => {
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [productId]: checked,
    }));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const { quotationByRequestId: productPrices } = data;

  return (
    <Grid container spacing={2}>
      {productPrices.map((productPrice: ProductPrice) => {
        const { quotation, product, quotationId } = productPrice;
        const { id: supplierId, supplier, customer } = quotation;
        const { name: supplierName } = supplier;
        const { id: customerId } = customer;

        return (
          <Grid item xs={12} key={quotationId}>
            <Paper>
              <h1>Quotation - {quotationId}</h1>
              <h2>Supplier: {supplierName}</h2>
              <h3>Customer ID: {customerId}</h3>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Select</TableCell>
                    <TableCell>quotationId</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Quantity</TableCell>
                    {/* Add the remaining table headers */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productPrices.map((productPrice: ProductPrice, index: number) => {
                    const { product, id, status } = productPrice;
                    const isOrdered = status === 'ordered';

                    return (
                      <TableRow key={id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={selectedItems[id] || false}
                            onChange={(event) => handleCheckboxChange(id, event.target.checked)}
                            disabled={isOrdered}
                          />
                        </TableCell>
                        <TableCell>{quotationId}</TableCell>
                        <TableCell>{product.title}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        {/* Add the remaining table cells */}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default QuotationDetail;