import { useMediaQuery, useTheme, TextField, Button, Grid } from '@mui/material';
import { Edit, Delete, AccountCircle } from '@mui/icons-material';
import Controls from '../../Controls';

const MyComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const data = [
    {
      image: 'image1.jpg',
      itemName: 'Item 1',
      itemCode: 'Code 1',
      partNumber: 'Part 123',
      uom: 'Pieces',
      qty: '10',
    },
    // Add more data items as needed
  ];

  return (
    <div>
      {isMobile ? (
        <Grid container spacing={2}>
          {data.map((item, index) => (
            <Grid item xs={12} key={index} sx={{  marginLeft:'1rem', padding: '8px', border: '1px solid #ddd' }}>
              <Controls.Input  name="image"  label="Image"  value={item.image}
                //onChange={handleInputChange}
               // error={errors.image}
                fullWidth  icon={<AccountCircle />} // Add icon for the field
                sx={{
                  width: '100%',
                  marginTop: '1rem',
                }}   
              />
              <Controls.Input  name="itemName"  label="Item Name"  value={item.itemName}
                //onChange={handleInputChange}
               // error={errors.itemName}
                fullWidth  icon={<AccountCircle />} // Add icon for the field
                sx={{
                  width: '100%',
                  marginTop: '1rem',
                }}   
              />
              <Controls.Input  name="itemCode"  label="Item Code"  value={item.itemCode}
                //onChange={handleInputChange}
               // error={errors.itemCode}
                fullWidth  icon={<AccountCircle />} // Add icon for the field
                sx={{
                  width: '100%',
                  marginTop: '1rem',
                }}   
              />
              <Controls.Input  name="partNumber"  label="Part Number"  value={item.partNumber}
                //onChange={handleInputChange}
               // error={errors.partNumber}
                fullWidth  icon={<AccountCircle />} // Add icon for the field
                sx={{
                  width: '100%',
                  marginTop: '1rem',
                }}   
              />
              <Controls.Input  name="uom"  label="UOM"  value={item.uom}
                //onChange={handleInputChange}
               // error={errors.uom}
                fullWidth  icon={<AccountCircle />} // Add icon for the field
                sx={{
                  width: '100%',
                  marginTop: '1rem',
                }}   
              />
              <Controls.Input  name="qty"  label="Qty"  value={item.qty}
                //onChange={handleInputChange}
               // error={errors.qty}
                fullWidth  icon={<AccountCircle />} // Add icon for the field
                sx={{
                  width: '100%',
                  marginTop: '1rem',
                }}   
              />
              <Button variant="contained" color="primary" startIcon={<Edit />}>
                Edit
              </Button>
              <Button variant="contained" color="secondary" startIcon={<Delete />}>
                Delete
              </Button>
            </Grid>
          ))}
        </Grid>
      ) : (
        <table>
          <thead>
            <tr style={{ backgroundColor: '#00b0ad' }}>
              <th>Image</th>
              <th>Item Name</th>
              <th>Item Code</th>
              <th>Part Number</th>
              <th>UOM</th>
              <th>Qty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>
                  <TextField value={item.image} fullWidth />
                </td>
                <td>
                  <TextField value={item.itemName} fullWidth />
                </td>
                <td>
                  <TextField value={item.itemCode} fullWidth />
                </td>
                <td>
                  <TextField value={item.partNumber} fullWidth />
                </td>
                <td>
                  <TextField value={item.uom} fullWidth />
                </td>
                <td>
                  <TextField value={item.qty} fullWidth />
                </td>
                <td>
                  <Button variant="contained" color="primary" startIcon={<Edit />}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" startIcon={<Delete />}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyComponent;