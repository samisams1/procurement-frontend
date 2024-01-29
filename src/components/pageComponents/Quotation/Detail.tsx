import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Typography, Box, Grid, Checkbox, Table, TableHead, TableRow, TableCell, TableBody, } from '@mui/material';
import Button from '../../Button';

const GET_QUOTATION = gql`
  query GetQuotationById($id: Float!) {
    quotation(id: $id) {
      id
      customerId
      supplierId
      shippingPrice
      createdAt
      productPrices {
        price
        product {
          id
          title
          code
          partNumber
          uom
          quantity
          mark
          Description
          manufacturer
          model
          status
        }
      }
    }
  }
`;

const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      customerId
      supplierId
      orderDetails {
        id
        title
        price
        quantity
      }
      totalPrice
      tax
    }
  }
`;

interface QuotationData {
  quotation: {
    id: string;
    supplierId:number;
    shippingPrice: number;
    productPrices: {
      price: number;
      product: {
        id: string;
        title: string;
        code:string;
            partNumber  :string;
            uom :string;
            quantity :number;
            mark  :string;
            description :string;
            manufacturer  :string;
            model  :string;
            status :string;
      };
    }[];
  };
}
type QuotationDetailProps = {
    id: number;
    newId:number;
  };
  
const QuotationDetail: React.FC<QuotationDetailProps> = (props) => {
  const { id,newId } = props;
  const [quantities] = useState<{ [key: string]: number }>({});
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
  const [shipping, setShipping] = useState<number>(0);
  const [supplierId, setSupplierId] = useState<number>(0);


  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [createOrder] = useMutation(CREATE_ORDER);

  const [showTitleColumn, setShowTitleColumn] = useState(true);
  const [showPriceColumn, setShowPriceColumn] = useState(true);

  const { loading, error, data,refetch } = useQuery<QuotationData>(GET_QUOTATION, {
    variables: { id: id}
  });


  
  React.useEffect(() => {
    if (data?.quotation.shippingPrice !== undefined) {
      setShipping(data.quotation.shippingPrice);
    } 
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!data?.quotation) {
      setErrorMessage('Quotation data not found!');
      return;
    }

    const selectedProducts = data.quotation.productPrices.filter(
      (product) => selectedItems[product.product.title]
    );

    if (selectedProducts.length === 0) {
      setErrorMessage('Please select at least one product!');
      return;
    }
    console.log("supplierId")
console.log(supplierId)
 const input = {
      customerId: newId,
      supplierId: supplierId,
      orderDetails: selectedProducts.map(({ product, price }) => ({
        title: product.title,
        productId:product.id,
        price,
        quantity: quantities[product.title] || 0,
      })),
      totalPrice: calculateTotal(),
      tax: calculateVAT(),
      status: 'pending',
      shippingCost: shipping,
    }
    /*try {
      const response = await createOrder({ variables: { input } });
      const createdOrder = response.data.createOrder;
      // Perform actions with the created order
      console.log('Order created:', createdOrder);
      setSuccessMessage('Order created successfully!');
      // Refetch the data after creating
      const refetchResponse = await client.query<QuotationData>({
        query: GET_QUOTATION,
        variables: { id: id },
      });
      const updatedData = refetchResponse.data; // or perform any other action with the updated data
      console.log('Updated data:', updatedData);
    
    } catch (error: any) {
      setErrorMessage(error.message);
    }  */

    try {
      const response = await createOrder({ variables: { input } });
      const createdOrder = response.data.createOrder;
      const createdOrderId = createdOrder.id; // Access the created ID
      console.log('Order created with ID:', createdOrderId);
      setSuccessMessage('Order created successfully!');
      //navigate(`/orderDetail/${createdOrderId}`)
      refetch();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };


  const { quotation } = data!;


  const handleCheckboxChange = (title: string, checked: boolean, supplierId: number) => {
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [title]: checked,
    }));

    setSupplierId(supplierId); // Update the supplierId state variable
  };

 
  const calculateTotal = () => {
    let total = 0;
    quotation.productPrices.forEach(({ product, price }) => {
      const quantity = product.quantity;
      total += quantity * price;
    });
    total += shipping;
    return total;
  };
  const calculateVAT = () => {
    const total = calculateTotal();
    return total * 0.15; // Assuming 15% VAT
  };
  const calculateSubTotal = () => {
    let subTotal = 0;
    quotation.productPrices.forEach(({ product, price }) => {
      const quantity = product.quantity;
      subTotal += quantity * price;
    });
    return subTotal;
  };
 const handleTitleColumnToggle = () => {
    setShowTitleColumn(!showTitleColumn);
  };

  const handlePriceColumnToggle = () => {
    setShowPriceColumn(!showPriceColumn);
  };
  const isWaiting = quotation.productPrices.some(
    ({ product }) => product.status === 'wait'
  );

  return (
<div>
    {isWaiting && <div>
      <form onSubmit={handleSubmit}>

        {successMessage && (
          <Typography color="success">
            {successMessage}
          </Typography>
        )}
        {errorMessage && (
          <Typography color="error">
            {errorMessage}
          </Typography>
        )}
<Box display="flex" alignItems="center" borderBottom={1} pb={1} mb={2}>
  <Grid container>
    <Grid item xs={4}>
      <Typography mt={2}>Requested for/Project: <span style={{ textDecoration: "underline" }}> Samisams</span> </Typography>
    </Grid>
<Grid item xs={4} textAlign="center">
  <Typography mt={2} >
   Item Category: <span style={{ textDecoration: "underline" }}> Construction</span> 
  </Typography>
</Grid>
    <Grid item xs={4} textAlign="right">
      <Typography mt={2}  >No: <span style={{ textDecoration: "underline" }}> 525</span> </Typography>
    </Grid>
  </Grid>
</Box>
<div>
        <label>
          <Checkbox checked={showTitleColumn} onChange={handleTitleColumnToggle} />
          Show Title Column
        </label>
        <label>
          <Checkbox checked={showPriceColumn} onChange={handlePriceColumnToggle} />
          Show Price Column
        </label>
      </div>
        <Box mt={2}>
          <Grid container spacing={2}>
    <Table>
    <TableHead>
    <TableRow sx={{ backgroundColor: '#1c9fef' }} >
    <TableCell sx={{ padding: '4px', height: '32px' }}>#</TableCell>
    <TableCell sx={{ padding: '4px', height: '32px' }}>Selcet</TableCell>
    {showTitleColumn && <TableCell sx={{ padding: '4px', height: '32px' }}>Image</TableCell>}
    {showTitleColumn && <TableCell>Title</TableCell>}
    {showTitleColumn &&  <TableCell sx={{ padding: '4px', height: '32px' }}>Item Code</TableCell>}
    {showTitleColumn && <TableCell sx={{ padding: '4px', height: '32px' }}>Part Number</TableCell>}

      {showTitleColumn && <TableCell sx={{ padding: '4px', height: '32px' }}>UOM</TableCell>}
      {showTitleColumn && <TableCell sx={{ padding: '4px', height: '32px' }}>Qty</TableCell>}
      {showTitleColumn && <TableCell sx={{ padding: '4px', height: '32px' }}>Price</TableCell>} 
      {showTitleColumn && <TableCell sx={{ padding: '4px', height: '32px' }}>Sub total</TableCell>}

     </TableRow>
  </TableHead>
 
            {quotation.productPrices.map(({ product, price },index) => (
  <TableBody key={product.title}>
  <TableRow>
    <TableCell sx={{ padding: '0px', height: '24px' }}>
      {index + 1}
    </TableCell>

    <TableCell sx={{ padding: '0px', height: '24px' }}>
          <Checkbox
            checked={selectedItems[product.title] || false}
            onChange={(e) => {
              if (product.status === 'wait') {
                handleCheckboxChange(product.title, e.target.checked, quotation.supplierId);
              }

            }}
            disabled={product.status !== 'wait'}
          />
        </TableCell>
    {showTitleColumn && <TableCell sx={{ padding: '0px', height: '24px' }}>{"image.jpeg"}</TableCell>}
    <TableCell sx={{ padding: '0px', height: '24px' }}>
                    {showTitleColumn && <TableCell>{product.title}</TableCell>}
                    </TableCell>
                    {showTitleColumn &&     <TableCell sx={{ padding: '0px', height: '24px' }}>
                   {product.code}
                    </TableCell>}
                    {showTitleColumn &&   <TableCell sx={{ padding: '0px', height: '24px' }}>
                      {product.status}
                    </TableCell> }

                    {showTitleColumn &&  <TableCell sx={{ padding: '0px', height: '24px' }}>
                    {product.uom}
                    </TableCell>}
                    {showTitleColumn &&  <TableCell sx={{ padding: '0px', height: '24px' }}>
                    {product.quantity}
                    </TableCell>}
                    {showTitleColumn && <TableCell sx={{ padding: '0px', height: '24px' }}>
                    {price}
                    </TableCell>}
                    {showTitleColumn &&  <TableCell sx={{ padding: '0px', height: '24px' }}>
                     {price * product.quantity}
                    </TableCell>}
  </TableRow>
</TableBody>
            ))}
  <TableBody/>
  </Table>
          </Grid>
        </Box>
      <Box mt={2} textAlign="right">
    <Typography>Subtotal: ${calculateSubTotal().toFixed(2)}</Typography>
    <Typography>VAT: ${calculateVAT().toFixed(2)}</Typography>
    <Typography>Shipping Price: ${200}</Typography>
    <Typography>Total: ${calculateTotal().toFixed(2)}</Typography>
  </Box>
  <Box display="flex" alignItems="center"  mb={2}>
  <Grid container>
    <Grid item xs={4}>
      <Typography mt={2}>Requested  Date : 2024/05/25</Typography>
    </Grid>
    <Grid item xs={4} textAlign="center">
      <Typography mt={2}>Checked  Date : 2024/05/25</Typography>
    </Grid>
    <Grid item xs={4} textAlign="right">
      <Typography mt={2}>Approved Date : 2024/05/25</Typography>
    </Grid>
  </Grid>
</Box>
  <Box display="flex" alignItems="center" borderBottom={1} pb={1} mb={2}>
  <Grid container>
    <Grid item xs={4}>
      <Typography mt={2}>Requested by: <span style={{ textDecoration: "underline" }}> Samisams</span> </Typography>
    </Grid>
    <Grid item xs={4} textAlign="center">
      <Typography mt={2}>Checked by: <span style={{ textDecoration: "underline" }}> Admin</span> </Typography>
    </Grid>
    <Grid item xs={4} textAlign="right">
      <Typography mt={2}>Approved by: <span style={{ textDecoration: "underline" }}> Yosis</span> </Typography>
    </Grid>
  </Grid>
</Box>
<Box mt={2} textAlign="center">
  <Button type="submit" variant="contained" color="primary" text="Send Order" />
</Box>
      </form>
    </div>
        }
        </div>
  );
};

export default QuotationDetail;