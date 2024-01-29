import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table, TableHead, TableRow, TableCell, TableBody, Input,Accordion, AccordionSummary, AccordionDetails, 
  Checkbox,
} from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { SelectChangeEvent } from '@mui/material/Select';
import Spinner from '../../Spinner';
import PageHeader from '../../PageHeader';
import { PeopleTwoTone } from '@mui/icons-material';

export interface SaleInput {
  productTitle: string;
  code:string;
  partNumber  :string;
  uom :string;
  quantity :number;
  mark  :string;
  description :string;
  manufacturer  :string;
  model  :string;
}
export interface AdditionalData {
  remark: string;
  estimatedDelivery: string;
  addressDetail: string;

}

interface RequestFormProps {
  onSubmit: (products: SaleInput[], selectedSuppliers: number[], additional: AdditionalData,selectedType:string) => Promise<void>;
}

interface SupplierData {
    id: number;
    name:string
}

const GET_CATEGORIES = gql`
query{
  categories{
    id
    name
  }
}
`;
const GET_SUPPLIERS_BY_CATEGORY_ID = gql`
query GetSuppliersByCategoryId($categoryId: Int!) {
  suppliersByCategoryId(categoryId: $categoryId) {
    id
  }
}
`
const GET_SUPPLIERS = gql`
query{
  suppliers{
    id
    name
  }
}
`
const RequestForm: React.FC<RequestFormProps> = ({ onSubmit }) => {
  const [productTitles, setProductTitles] = useState<string[]>(['']);
  const [itemCodes, setItemCodes] = useState<string[]>(['']);
  const [itemCodeErrors, setItemCodeErrors] = useState<string[]>(['']);
  const [partNumbers, setPartNumbers] = useState<string[]>(['']);
  const [partNumberErrors, setPartNumberErrors] = useState<string[]>(['']);
  const [uoms, setUoms] = useState<string[]>(['']);
  const [uomErrors, setUomErrors] = useState<string[]>(['']);
  const [quantities, setQuantities] = useState<string[]>([]);
  const [quantityErrors, setQuantityErrors] = useState<string[]>(['']);

  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  //const [agentId, setAgentId] = useState<number>(0);

  const [agentId, setAgentId] = useState<number | undefined>(undefined);



  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);
  const [selectedType,setSelectedType] = useState('');

  const [manufacturers, setManufacturers] = useState<string[]>(['']);
  const [descriptions, setDescriptions] = useState<string[]>(['']);
  const [marks, setMarks] = useState<string[]>(['']);
  const [models, setModels] = useState<string[]>(['']);

  const [remark, setRemark] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  //const [remarkErrors, setemarkErrors] = useState<string[]>('');


  const [expanded, setExpanded] = useState<string | false>(false);
  const [error, setError] = useState('');
  const [titleErrors, setTitleErrors] = useState<string[]>(['']);


  // for check box select type
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOption1, setSelectedOption1] = useState('');
  const [selectedOption2, setSelectedOption2] = useState('');
  
  const { loading, data } = useQuery(GET_CATEGORIES);
  /*const { loading: loading1, error: error1, data: data1 } = useQuery(GET_SUPPLIERS_BY_CATEGORY_ID, {
    variables: { categoryId: categoryId || 0 },
  });*/
  
  //const { loading: loadingCategories } = useQuery(GET_CATEGORIES);
  const { loading: loadingSuppliers, error: errorSuppliers, data: supplierData } = useQuery(
    GET_SUPPLIERS_BY_CATEGORY_ID,
    {
      variables: { categoryId: categoryId || 0 },
    }
  );
  const { loading: loadingSup, error: errorSup, data: supData } = useQuery(GET_SUPPLIERS);
 /* useEffect(() => {
    if (supplierData) {
      const suppliers = supplierData.suppliersByCategoryId || [];
      const supplierIds = suppliers.map((supplier: SupplierData) => supplier.id);
      setSelectedSuppliers(supplierIds);

      console.log(supplierIds);
    }
  }, [supplierData]);
*/
useEffect(() => {
  if (supplierData) {
    const suppliers = supplierData.suppliersByCategoryId || [];
    const supplierIds = suppliers.map((supplier: SupplierData) => supplier.id);

    if (selectedType === 'x-company') {
      // Custom logic for x-company selected type
      // Modify or filter the supplierIds array based on the selected type
      setSelectedSuppliers(supplierIds);
    } else if (selectedType === 'agent') {
      setSelectedSuppliers(agentId !== undefined ? [agentId] : []);
    } else if (selectedType === 'supplier') {
      // Custom logic for supplier selected type
      // Modify or filter the supplierIds array based on the selected type
      setSelectedSuppliers(supplierIds);
    }

    console.log(supplierIds);
  }
}, [supplierData, selectedType]);
  //for Agent
  if (loading) {
    return <div>Loading...</div>;
  }
  if (loadingSup) {
    return <Spinner />; // Or any other loading indicator
  }
  
  if (errorSup) {
    return <div>Error: {errorSup.message}</div>; // Or handle the error in an appropriate way
  }
  const suppliers = data.categories;
  const supNewData = supData?.suppliers;


  const handleTitleChange = (index: number, value: string) => {
    const updatedTitles = [...productTitles];
    updatedTitles[index] = value;
    setProductTitles(updatedTitles);

    const updatedTitleErrors = [...titleErrors];
    if (value.trim() === '') {
      updatedTitleErrors[index] = 'Please enter a valid item name.';
    } else {
      updatedTitleErrors[index] = '';
    }
    setTitleErrors(updatedTitleErrors);
  };

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleItemCodeChange = (index: number, value: string) => {
    const updatedItemCodes = [...itemCodes];
    updatedItemCodes[index] = value;
    setItemCodes(updatedItemCodes);

    const updatedCodeErrors = [...itemCodeErrors];
    if (value.trim() === '') {
      updatedCodeErrors[index] = 'Please enter a valid item code.';
    } else {
      updatedCodeErrors[index] = '';
    }
    setItemCodeErrors(updatedCodeErrors);
  };

  const handlePartNumberChange = (index: number, value: string) => {
    const updatedPartNumbers = [...partNumbers];
    updatedPartNumbers[index] = value;
    setPartNumbers(updatedPartNumbers);

    const updatedPartNumberErrors = [...partNumberErrors];
    if (value.trim() === '') {
      updatedPartNumberErrors[index] = 'Please enter a valid part number.';
    } else {
      updatedPartNumberErrors[index] = '';
    }
    setPartNumberErrors(updatedPartNumberErrors);
  };

  const handleUomChange = (index: number, value: string) => {
    const updatedUoms = [...uoms];
    updatedUoms[index] = value;
    setUoms(updatedUoms);

    const updatedUomErrors = [...uomErrors];
    if (value.trim() === '') {
      updatedUomErrors[index] = 'Please enter a valid UOM.';
    } else {
      updatedUomErrors[index] = '';
    }
    setUomErrors(updatedUomErrors);
  };
  const handleQuantityChange = (index: number, value: number) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] = value.toString(); // Convert value to a string
    setQuantities(updatedQuantities);
  
    const updatedQuantityErrors = [...quantityErrors];
    if (value.toString().trim() === '') { // Convert value to a string
      updatedQuantityErrors[index] = 'Please enter a valid quantity.';
    } else {
      updatedQuantityErrors[index] = '';
    }
    setQuantityErrors(updatedQuantityErrors);
  };
  const handleDescriptionChange = (index: number, value: string) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = value;
    setDescriptions(updatedDescriptions);

  };
  const handleMarkChange = (index: number, value: string) => {
    const updatedMarks = [...marks];
    updatedMarks[index] = value;
    setMarks(updatedMarks);

  };
  const handleModelChange = (index: number, value: string) => {
    const updatedModels = [...models];
    updatedModels[index] = value;
    setModels(updatedModels);

  };
  const handleManufacturersChange = (index: number, value: string) => {
    const updatedManufacturers = [...manufacturers];
    updatedManufacturers[index] = value;
    setManufacturers(updatedManufacturers);

  };
  const handleAddTitle = () => {
    setProductTitles([...productTitles, '']);
    setTitleErrors([...titleErrors, '']);
  };

  const handleRemoveTitle = (index: number) => {
    const updatedTitles = [...productTitles];
    updatedTitles.splice(index, 1);
    setProductTitles(updatedTitles);

    const updatedTitleErrors = [...titleErrors];
    updatedTitleErrors.splice(index, 1);
    setTitleErrors(updatedTitleErrors);
  };
  const handleRemarkChange = (value: string) => {
    setRemark(value);
  };
  const handleAddressChange = (value: string) => {
    setAddressDetail(value);
  };

  const handleReset = () => {
    //setProducts([]);
    setSelectedSuppliers([]);
   /// setAdditional({ remark: '', estimatedDelivery: '', addressDetail: '' });
    //onFormReset(); // Call onFormReset prop to indicate form reset
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  /*  if (selectedSuppliers.length === 0) {
      setError('Please select Category.');
      return;
    }*/

    if (selectedOptions.length === 0) {
      setError('Please select  Type Of Bussines.');
      return;
    }
    if (selectedOptions.includes('x-company')) {
      // X-Company option selected, perform appropriate actions
      console.log('X-Company option selected');
      setError('X-Company option selected');
      setSelectedType('x-company');
    }
    if (selectedOptions.includes('supplier')) {
      if (categoryId === undefined) {
        setError('Category not selected for Supplier option');
        return;
      } 
      setSelectedType('supplier');
    }
    
    if (selectedOptions.includes('agent')) {
      if (agentId === undefined) {
        setError('Agent not selected for Agent option');
        return;
      }
      setSelectedType('agent');

    }
    const updatedTitleErrors = productTitles.map((title) => {
      if (title.trim() === '') {
        return 'Please enter a valid item name.';
      }
      return '';
    });
    setTitleErrors(updatedTitleErrors);

    if (updatedTitleErrors.some((error) => error !== '')) {
      return;
    }
    const updateItemCodeErrors = itemCodes.map((code) => {
      if (code.trim() === '') {
        return 'Please enter a valid item itemCodes.';
      }
      return '';
    });
    setItemCodeErrors(updateItemCodeErrors);

    if (updateItemCodeErrors.some((error) => error !== '')) {
      return;
    }
    const updatePartNumberErrors = partNumbers.map((partNumber) => {
      if (partNumber.trim() === '') {
        return 'Please enter a valid item partNumbers.';
      }
      return '';
    });
    setPartNumberErrors(updatePartNumberErrors);

    if (updatePartNumberErrors.some((error) => error !== '')) {
      return;
    }
    const updateUomsErrors = uoms.map((uom) => {
      if (uom.trim() === '') {
        return 'Please enter a valid item uom.';
      }
      return '';
    });
    setUomErrors(updateUomsErrors);

    if (updateUomsErrors.some((error) => error !== '')) {
      return;
    }
    const updateQuantitieErrors = quantities.map((quantitie) => {
      if (quantitie.trim() === '') {
        return 'Please enter a valid item quantities.';
      }
      return '';
    });
    setQuantityErrors(updateQuantitieErrors);
    if (updateQuantitieErrors.some((error) => error !== '')) {
      return;
    }

    // Create an array of SaleInput objects from the productTitles array
    const products: SaleInput[] = productTitles.map((title,index) => ({ 
      productTitle: title, 
      code: itemCodes[index],
      partNumber: partNumbers[index],
      uom: uoms[index],
      quantity: Number(quantities[index]), // Convert the quantity value
      mark: marks[index],
      model: models[index],
      description: descriptions[index],
      manufacturer:manufacturers[index],
    }));

    const additional = {
      remark:remark,
      addressDetail:addressDetail,
      estimatedDelivery:estimatedDelivery
    }
    onSubmit(products, selectedSuppliers,additional,selectedType);
  };
  const handleChange = async (event: SelectChangeEvent) => {
    const selectedCategoryId = Number(event.target.value);
  setCategoryId(selectedCategoryId !== 0 ? selectedCategoryId : undefined);
  setSelectedType("supplier");
  setSelectedSuppliers([]); // Clear the selected suppliers when the category changes
  };

  const handleAgentChange = (event: SelectChangeEvent) => {
    const selectedAgentId = event.target.value !== '' ? parseInt(event.target.value) : undefined;
    setAgentId(selectedAgentId);
    setSelectedType("agent");
  };

 if(loadingSuppliers){
  return <Spinner/>
 }
  if (errorSuppliers) {
    return <p>Error: {errorSuppliers.message}</p>;
  }

  //const categories = categoryData.categories;
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEstimatedDelivery(event.target.value);
  };
  const renderDateOptions = () => {
    const options = [];
    for (let i = 1; i <= 30; i++) {
      options.push(
        <MenuItem key={i} value={i.toString()}>
         with in    {" " + i} {i===1? "day":"days"}
       </MenuItem>
      );
    }
    return options;
  };
// select type
const handleOptionChange = (option: string) => {
  if (selectedOptions.includes(option)) {
    setSelectedOptions(selectedOptions.filter((item) => item !== option));
  } else {
    setSelectedOptions([option]);
    setSelectedOption1('');
    setSelectedOption2('');
  }
};
  return (
<Grid container spacing={2}>
  <Grid item xs={12}>
    <Paper elevation={3} sx={{ padding: '20px' }}>
    <PageHeader
            title="NEW REQUISITION FORM"
            subTitle="Create new requisition"
            icon={<PeopleTwoTone fontSize="large" />}
        /> 
    <Paper elevation={2} style={{ padding: '1rem' }}>
      <Typography variant="h5">Please select your type of purchase:</Typography>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div>
          <Checkbox
            checked={selectedOptions.includes('supplier')}
            onChange={() => handleOptionChange('supplier')}
            disabled={selectedOptions.length === 1 && !selectedOptions.includes('supplier')}
          />
          <span>Category</span>
          {selectedOptions.includes('supplier') && (
           <FormControl fullWidth>
           <InputLabel id="demo-simple-select-label">Category</InputLabel>
           <Select
             labelId="demo-simple-select-label"
             id="demo-simple-select"
             value={categoryId !== undefined ? categoryId.toString() : ''}
             label="Category"
             onChange={handleChange}
           >
             {suppliers.map((supplier: SupplierData) => (
               <MenuItem key={supplier.id} value={supplier.id}>
                 {supplier.name}
               </MenuItem>
             ))}
           </Select>
         </FormControl>
          )}
        </div>
        <div>
          <Checkbox
            checked={selectedOptions.includes('agent')}
            onChange={() => handleOptionChange('agent')}
            disabled={selectedOptions.length === 1 && !selectedOptions.includes('agent')}
          />
          <span>Agent</span>
          {selectedOptions.includes('agent') && (
         <FormControl fullWidth>
         <InputLabel id="demo-simple-select-label">Agent</InputLabel>
         <Select
           labelId="demo-simple-select-label"
           id="demo-simple-select"
           value={agentId !== undefined ? agentId.toString() : ''}
           label="Category"
           onChange={handleAgentChange}
         >
           {supNewData.map((supplier: any) => (
             <MenuItem key={supplier.id} value={supplier.id}>
               {supplier.name}
             </MenuItem>
           ))}
         </Select>
       </FormControl>
          )}
        </div>
        <div>
          <Checkbox
            checked={selectedOptions.includes('x-company')}
            onChange={() => handleOptionChange('x-company')}
            disabled={selectedOptions.length === 1 && !selectedOptions.includes('x-company')}
          />
          <span>X-Company</span>
          {selectedOptions.includes('x-company') && <span>{selectedOptions[0]}</span>}
        </div>
      </div>
      {error && categoryId === undefined && <Typography color="error">{error}</Typography>}
    </Paper>
     
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}></Grid>
          <Grid item xs={12} sm={12}>
            <Paper elevation={3} sx={{ padding: '20px' }}>
            <div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px',
}}>
  
  <Button
    variant="outlined"
    color="primary"
    startIcon={<AddIcon />}
    onClick={handleAddTitle}
    style={{ whiteSpace: 'nowrap' }}
  >
    Add Item
  </Button>
</div>

<Table>
  <TableHead>
    <TableRow sx={{ backgroundColor: '#1c9fef' }}>
      <TableCell sx={{ padding: '4px', height: '32px' }}>Image</TableCell>
      <TableCell sx={{ padding: '4px', height: '32px' }}>Item Name</TableCell>
      <TableCell sx={{ padding: '4px', height: '32px' }}>Item Code</TableCell>
      <TableCell sx={{ padding: '4px', height: '32px' }}>Part Number</TableCell>
      <TableCell sx={{ padding: '4px', height: '32px' }}>UOM</TableCell>
      <TableCell sx={{ padding: '4px', height: '32px' }}>Qty</TableCell>
      <TableCell sx={{ padding: '4px', height: '32px' }}>More</TableCell>
      <TableCell sx={{ padding: '4px', height: '32px' }}>Action</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {productTitles.map((title, index) => (
      <TableRow key={index} sx={{ height: '1px' }}>
        <TableCell sx={{  padding: '1px', height: '2px' }}>
          <FormControl style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '6px 10px',
                cursor: 'pointer',
              }}
            >
              <input
                type="file"
                accept=".pdf"
                style={{
                  display: 'none',
                }}
                // onChange={handleFileChange}
              />
              <label htmlFor="attachment-input">
               
                <Button
                  variant="outlined"
                  style={{
                    textTransform: 'none',
                    fontSize: '14px',
                    color: '#1c9fef',
                    borderColor: '#1c9fef',
                  }}
                >
                  Browse
                </Button>
              </label>
            </div>
          </FormControl>
        </TableCell>
        <TableCell sx={{   padding: '0px', height: '1px' }}>
          
        <Input
placeholder="Item Name"
    value={title}
    onChange={(e) => handleTitleChange(index, e.target.value)}
    error={titleErrors[index] !== ''}
    fullWidth
  />
  
        </TableCell>
        <TableCell sx={{ padding: '0px', height: '24px' }}>
        <Input
          placeholder="Item Code"
          value={itemCodes[index]}
          onChange={(e) => handleItemCodeChange(index, e.target.value)}
          error={itemCodeErrors[index] !== ''}
          fullWidth
        />
        </TableCell>
        <TableCell sx={{ padding: '0px', height: '24px' }}>
        <Input
          placeholder="Part Number"
          value={partNumbers[index]}
          onChange={(e) => handlePartNumberChange(index, e.target.value)}
          error={partNumberErrors[index] !== ''}
          fullWidth
        />
        </TableCell>
        <TableCell sx={{ padding: '0px', height: '24px' }}>
        <Input
  placeholder="UOM"
  value={uoms[index]}
  onChange={(e) => handleUomChange(index, e.target.value)}
  error={uomErrors[index] !== ''}
  fullWidth
/>
        </TableCell>
        <TableCell sx={{ padding: '0px', height: '24px' }}>
        <Input
  placeholder="Qty"
  value={quantities[index]}
  //onChange={(e) => handleQuantityChange(index, e.target.value)}
  onChange={(e) => handleQuantityChange(index, Number(e.target.value))}

  error={quantityErrors[index] !== ''}
  fullWidth
/>
        </TableCell> 
        <TableCell sx={{ padding: '1px', height: '0px', minWidth: '24px' }}>
        <div>
        <Accordion
    key={index}
    expanded={expanded === `panel${index}`}
    onChange={handleAccordionChange(`panel${index}`)}
    style={{ width: '240px', marginBottom: '15px' }}
  >
        <AccordionSummary expandIcon={<AddIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography>Add More</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
          <Input
          placeholder="Mark"
          value={marks[index]}
          onChange={(e) => handleMarkChange(index, e.target.value)}
          fullWidth
        />
         <Input
          placeholder="Description"
          value={descriptions[index]}
          onChange={(e) => handleDescriptionChange(index, e.target.value)}
          fullWidth
        />
          <Input
          placeholder="Manufacture"
          value={manufacturers[index]}
          onChange={(e) => handleManufacturersChange(index, e.target.value)}
          fullWidth
        />
           <Input
          placeholder="Model"
          value={models[index]}
          onChange={(e) => handleModelChange(index, e.target.value)}
          error={itemCodeErrors[index] !== ''}
          fullWidth
        />
          </div>
        </AccordionDetails>
      </Accordion>


      {/* Rest of your code */}
    </div>
        </TableCell>
        <TableCell sx={{ padding: '0px', height: '24px' }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleRemoveTitle(index)}
            disabled={productTitles.length === 1}
            startIcon={<DeleteIcon />}
          >
            
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
</Paper>
           </Grid>
           <Grid item xs={12} sm={12}>
            <Paper elevation={3} sx={{ padding: '20px' }}>
<Grid container spacing={2}>
<Grid item xs={12} sm={6}>
    <TextField
      label="Address details"
      variant="outlined"
      fullWidth
      value={addressDetail}
      onChange={(e) => handleAddressChange(e.target.value)}
     // error={remarkErrors !== ''}
    />
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <FormControl variant="outlined" fullWidth>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '6px 10px',
          cursor: 'pointer',
        }}
      >
        <input
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          // onChange={handleFileChange}
        />
        <label htmlFor="attachment-input">
          <span
            style={{
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginRight: '10px',
            }}
          >
            Attache a file
          </span>
          <Button
            variant="outlined"
            style={{
              textTransform: 'none',
              fontSize: '14px',
              color: '#1c9fef',
              borderColor: '#1c9fef',
            }}
          >
            Browse
          </Button>
        </label>
      </div>
    </FormControl>
  </Grid>

  <Grid item xs={12} sm={6} md={4}>
    <Grid item xs={12}>
          <TextField
            select
            required
            label="Estimated Delivery Date"
            value={estimatedDelivery}
            onChange={handleDateChange}
            fullWidth
          >
            {renderDateOptions()}
          </TextField>
        </Grid>

  </Grid>

  <Grid item xs={12} sm={6}>
    <TextField
      label="Remark"
      variant="outlined"
      value={remark}
      onChange={(e) => handleRemarkChange(e.target.value)}
     // error={remarkErrors !== ''}
      fullWidth

    />
  </Grid>
</Grid>

</Paper>
   </Grid>

            <Grid item xs={12} sm={12}>
              <Button type="submit" variant="contained" color="primary">
                  Send Purchase Request
                </Button>
              </Grid> 
            </Grid>
      </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RequestForm;