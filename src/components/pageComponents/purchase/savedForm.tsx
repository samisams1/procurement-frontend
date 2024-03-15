import React, { useState, useEffect, useRef } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import {
  SelectChangeEvent,
  Box,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
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
import { Add, DeleteOutlineTwoTone, RequestPageOutlined, RequestPageTwoTone, RestoreFromTrash, Save, Send } from '@mui/icons-material';
import PageHeader from '../../PageHeader';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { SectionTitle } from '../../Section';
interface Category {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  name: string;
}
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
export interface Product {
  title: string;
  code:string;
  partNumber  :string;
  uom :string;
  quantity :string;
  mark  :string;
  description :string;
  manufacturer  :string;
  model  :string;
}
export interface AdditionalData {
  remark: string;
  estimatedDelivery: string;
  addressDetail: string;
  requestedBy:string;
  approvedBy:string;

}

/*interface RequestFormProps {
  onSubmit: (selectedType: string, selectedValue: string[]) => void;
}*/
interface RequestFormProps {
    purchaseRequestId:number;
    estimatedDate:string;
    remarkData:string;
    addressData:string;
    categoryIdData:number;
    sourceType:string;
    savedProducts:[Product]
  onSubmit: (products: SaleInput[], supplierNewId: string[], additional: AdditionalData,selectedType:string,categoryId:string,buttonType:string) => Promise<void>;
  loading:boolean
}
const GET_CATEGORIES = gql`
 query GetCategories {
    getCategories {
      id
      name
    }
  }
`;

const GET_SUPPLIERS_BY_CATEGORY_ID = gql`
query SuppliersByCategoryId($categoryId: Int!) {
  suppliersByCategoryId(categoryId: $categoryId) {
    id
    name
  }
}
`;
const GET_SUPPLIERS = gql`
query Suppliers {
  suppliers {
    id
    name
  }
}
`;
const UPLOAD_PROFILE_PICTURE_MUTATION = gql`
mutation UploadProfilePicture($file: Upload!) {
  uploadProfilePicture(file: $file) {
    filename
    mimetype
    encoding
  }
}
`;
const SavedForm: React.FC<RequestFormProps> = ({ onSubmit,loading,purchaseRequestId,remarkData,categoryIdData,addressData,estimatedDate,sourceType,savedProducts }) => {

  const [productTitles, setProductTitles] = useState<string[]>(savedProducts.map(product => product.title));

 // const [productTitles, setProductTitles] = useState<string[]>(['']);
  const [itemCodes, setItemCodes] = useState<string[]>(savedProducts.map(product => product.code));
 // const [itemCodeErrors, setItemCodeErrors] = useState<string[]>(['']);
  const [partNumbers, setPartNumbers] =useState<string[]>(savedProducts.map(product => product.partNumber));
  //const [partNumberErrors, setPartNumberErrors] = useState<string[]>(['']);
  const [uoms, setUoms] = useState<string[]>(savedProducts.map(product => product.title));
  //const [uomErrors, setUomErrors] = useState<string[]>(['']);
  const [quantities, setQuantities] = useState<string[]>(savedProducts.map(product => product.quantity));
  const [quantityErrors, setQuantityErrors] = useState<string[]>(['']);
  
  const [manufacturers, setManufacturers] = useState<string[]>(savedProducts.map(product => product.manufacturer));
  const [descriptions, setDescriptions] = useState<string[]>(savedProducts.map(product => product.description));
  const [marks, setMarks] = useState<string[]>(savedProducts.map(product => product.mark));
  const [models, setModels] = useState<string[]>(savedProducts.map(product => product.model));

  const [remark, setRemark] = useState(remarkData);
  const [addressDetail, setAddressDetail] = useState(addressData);
  const [estimatedDelivery, setEstimatedDelivery] = useState(estimatedDate);
  const [titleErrors, setTitleErrors] = useState<string[]>(['']);

  const saveButtonRef = useRef<HTMLButtonElement>(null);

  const [approvedBy, setAprovedBy] = useState(addressData);
  const [requestedBy, setRequestedBy] = useState(addressData);

  const [selectedValue, setSelectedValue] = useState('1');
  const [errorMessage, setErrorMessage] = useState('');
  const [categoryId, setCategoryId] = useState<string>('1');
  const [supplierIds, setSupplierIds] = useState<string[]>([]);

  const [selectedType, setSelectedType] = useState('');

  const [selectedOptions, setSelectedOptions] = useState<string[]>([sourceType]);
  const [expanded, setExpanded] = useState<string | false>(false);

  const [uploadProfilePictureMutation] = useMutation(UPLOAD_PROFILE_PICTURE_MUTATION);
  const {  data } = useQuery(GET_CATEGORIES);
  const { loading: loadingSuppliers, data: supplierData } = useQuery(GET_SUPPLIERS_BY_CATEGORY_ID, {
    variables: { categoryId: parseInt(categoryId) },
  });

  
  useEffect(() => {
    if (categoryId && supplierData && supplierData.suppliersByCategoryId) {
      const suppliers = supplierData.suppliersByCategoryId;
      const supplierIds = suppliers.map((supplier: any) => supplier.id);
      setSupplierIds(supplierIds);
    }
  }, [categoryId, supplierData]);
  console.log(supplierIds)
  console.log("samisams")
  console.log(categoryId)
  const { data: supData } = useQuery(GET_SUPPLIERS);

  useEffect(() => {
    if (supData) {
      setSelectedValue(supData.suppliers[0]?.id || '');
    }
  }, [supData]);

  const handleChange = (event: SelectChangeEvent) => {
    const selectedCategoryId = event.target.value as string;
    setSelectedValue(selectedCategoryId);
    setCategoryId(selectedCategoryId);
    if (supplierData && supplierData.refetch) {
      supplierData.refetch({ categoryId: parseInt(selectedCategoryId) });
    }
  };

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

    /*const updatedCodeErrors = [...itemCodeErrors];
    if (value.trim() === '') {
      updatedCodeErrors[index] = 'Please enter a valid item code.';
    } else {
      updatedCodeErrors[index] = '';
    }
    setItemCodeErrors(updatedCodeErrors);*/
  };

  const handlePartNumberChange = (index: number, value: string) => {
    const updatedPartNumbers = [...partNumbers];
    updatedPartNumbers[index] = value;
    setPartNumbers(updatedPartNumbers);

   /* const updatedPartNumberErrors = [...partNumberErrors];
    if (value.trim() === '') {
      updatedPartNumberErrors[index] = 'Please enter a valid part number.';
    } else {
      updatedPartNumberErrors[index] = '';
    }
    setPartNumberErrors(updatedPartNumberErrors);*/
  };

  const handleUomChange = (index: number, value: string) => {
    const updatedUoms = [...uoms];
    updatedUoms[index] = value;
    setUoms(updatedUoms);

/*    const updatedUomErrors = [...uomErrors];
    if (value.trim() === '') {
      updatedUomErrors[index] = 'Please enter a valid UOM.';
    } else {
      updatedUomErrors[index] = '';
    }
  setUomErrors(updatedUomErrors);*/
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
  const handleRequestedByChange = (value: string) => {
    setRequestedBy(value);
  };
  const handleApprovedByChange = (value: string) => {
    setAprovedBy(value);
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
    setAddressDetail('');
    setEstimatedDelivery('');
    setItemCodes(['']);
    setManufacturers(['']);
    setModels(['']);
    setPartNumbers(['']);
    setProductTitles(['']);
    setQuantities(['']);
    setUoms(['']);
    setSelectedValue('');
    setSupplierIds(['']);
    setDescriptions(['']);
    setRemark('');
  };

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
  
  const handleSubmit = () => {
    const  buttonType = "send";
    if (selectedOptions.length === 0) {
      setErrorMessage('Please select an option');
      return;
    }
  
    if (selectedOptions.includes('supplier') && (!selectedValue || !categoryId)) {
      setErrorMessage('Please select a category');
      return;
    }
  
    if (selectedOptions.includes('agent') && !selectedValue) {
      setErrorMessage('Please select an agent');
      return;
    }
  
    if (selectedOptions.includes('x-company') && !selectedValue) {
      setErrorMessage('Please select an X-company');
      return;
    }
    const updatedTitleErrors = productTitles.map((title) => {
      if (title.trim() === '') {
        return 'Please enter a valid item name.';
      }
      return '';
    });
    setTitleErrors(updatedTitleErrors);

   /* if (updatedTitleErrors.some((error) => error !== '')) {
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
    }*/
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
      estimatedDelivery:estimatedDelivery,
      requestedBy:"requestedBy",
      approvedBy:"approvedBy",
    }
    setErrorMessage('');

    let supplierNewId: string[] = [];
    if (selectedType === 'supplier') {
  //    supplierNewId = ['1','2'];
      supplierNewId = supplierIds;
   //  onSubmit(selectedType, supplierNewId);
   console.log(supplierIds)
console.log(supplierIds)
      onSubmit(products, supplierNewId,additional,selectedType,categoryId,buttonType);

    } else if (selectedType === 'agent' || selectedType === 'x-company') {
      supplierNewId = [selectedValue];
   
     // onSubmit(selectedType, supplierNewId);
     onSubmit(products, supplierNewId,additional,selectedType,categoryId,buttonType);

     

    }
  };
  const handleSave = (buttonType: 'save' | 'send') => {
    /* if (buttonType === 'save') {
       // Save button was clicked
       console.log('Save button clicked');
       // Perform save functionality
     } else if (buttonType === 'send') {
       // Send button was clicked
       console.log('Send button clicked');
       // Perform send functionality
     }*/
     if (selectedOptions.length === 0) {
       setErrorMessage('Please select an option');
       return;
     }
   
     if (selectedOptions.includes('supplier') && (!selectedValue || !categoryId)) {
       setErrorMessage('Please select a category');
       return;
     }
   
     if (selectedOptions.includes('agent') && !selectedValue) {
       setErrorMessage('Please select an agent');
       return;
     }
   
     if (selectedOptions.includes('x-company') && !selectedValue) {
       setErrorMessage('Please select an X-company');
       return;
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
    /* const updateItemCodeErrors = itemCodes.map((code) => {
       if (code.trim() === '') {
         return 'Please enter a valid item itemCodes.';
       }
       return '';
     });*/
     //setItemCodeErrors(updateItemCodeErrors);
 
     /*if (updateItemCodeErrors.some((error) => error !== '')) {
       return;
     }*/
     /*const updatePartNumberErrors = partNumbers.map((partNumber) => {
       if (partNumber.trim() === '') {
         return 'Please enter a valid item partNumbers.';
       }
       return '';
     });*/
    // setPartNumberErrors(updatePartNumberErrors);
 
    /* if (updatePartNumberErrors.some((error) => error !== '')) {
       return;
     }
     const updateUomsErrors = uoms.map((uom) => {
       if (uom.trim() === '') {
         return 'Please enter a valid item uom.';
       }
       return '';
     });*/
    // setUomErrors(updateUomsErrors);
 
   /*  if (updateUomsErrors.some((error) => error !== '')) {
       return;
     }*/
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
       estimatedDelivery:estimatedDelivery,
       requestedBy:requestedBy,
       approvedBy:approvedBy,
     }
     setErrorMessage('');
 
     let supplierNewId: string[] = [];
     if (selectedType === 'supplier') {
   //    supplierNewId = ['1','2'];
       supplierNewId = supplierIds;
    //  onSubmit(selectedType, supplierNewId);
    console.log(supplierIds)
 console.log(supplierIds)
       onSubmit(products, supplierNewId,additional,selectedType,categoryId,buttonType);
 
     } else if (selectedType === 'agent' || selectedType === 'x-company') {
       supplierNewId = [selectedValue];
      // onSubmit(selectedType, supplierNewId);
      onSubmit(products, supplierNewId,additional,selectedType,categoryId,buttonType);
 
      
 
     }
   };
  const handleOptionChange = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
      setSelectedType('');
      setSelectedValue(''); // Clear the selected value when the option is deselected
    } else {
      setSelectedOptions([...selectedOptions, option]);
      setSelectedType(option);
      if (option === 'x-company') {
        setSelectedValue('2'); // Assign the desired value to selectedValue when the option is selected
      }
    }
    setErrorMessage('');
  };
const handleAgentChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value as string);
  };

  const supNewData: Supplier[] = supData?.suppliers;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
  
    if (file) {
      try {
        const { data } = await uploadProfilePictureMutation({
          variables: {
            file: {
              createReadStream: () => file,
              filename: file.name,
              mimetype: file.type,
              encoding: '',
            },
          },
        });
  
        const { filename, mimetype, encoding } = data.uploadProfilePicture;
        console.log('Profile picture uploaded:', filename, mimetype, encoding);
  
        // You can update the preview image or trigger a refresh of the user's profile picture here
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  };
return(
  <ThemeProvider theme={theme}>
     <form onSubmit={handleSubmit} onReset={handleReset}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <SectionTitle>
          <PageHeader
            title="Saved  Requestion"
            subTitle="This is Your save  requisition yo can send it when ever you need"
            icon={<RequestPageTwoTone fontSize="large" />}
          />
          </SectionTitle>
         
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography>Select Your Source</Typography>
              </Grid>
              
              <Grid item xs={4} sm={4}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Checkbox
            checked={selectedOptions.includes('supplier')}
            onChange={() => handleOptionChange('supplier')}
            disabled={selectedOptions.length === 1 && !selectedOptions.includes('supplier')}
          />
          <Typography>Supplier</Typography>
        </Box>
      </Grid>
      <Grid item xs={4} sm={4}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Checkbox
            checked={selectedOptions.includes('agent')}
            onChange={() => handleOptionChange('agent')}
            disabled={selectedOptions.length === 1 && !selectedOptions.includes('agent')}
          />
          <Typography>Agent</Typography>
        </Box>
      </Grid>
      <Grid item xs={4} sm={4}>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <Checkbox
      checked={selectedOptions.includes('x-company')}
      onChange={() => handleOptionChange('x-company')}
      disabled={selectedOptions.length === 1 && !selectedOptions.includes('x-company')}
    />
    {selectedOptions.includes('x-company') ? <span></span> : null}
    <Typography>Etproforma</Typography>
  </Box>
</Grid>
              {selectedOptions.includes('supplier') && (
                <Grid item xs={12}>
      <FormControl fullWidth>
  <InputLabel>Category</InputLabel>
  <Select value={categoryId || selectedValue} onChange={handleChange} label="Category">
    {data &&
      data.getCategories.map((category: Category) => (
        <MenuItem key={category.id} value={Number(categoryId) || category.id}>
          {category.name}
        </MenuItem>
      ))}
  </Select>
</FormControl>
                </Grid>
              )}
          {selectedOptions.includes('agent') && (
             <Grid container spacing={2}>
                  <Grid item lg={4} md={8} xs={12}></Grid>
                 <Grid item lg={4} md={8} xs={12} >
                  <FormControl fullWidth>
                    <InputLabel>Agent</InputLabel>
                    <Select value={selectedValue} onChange={handleAgentChange}  label="Agent">
                      {supNewData && supNewData.map((supplier) => (
                        <MenuItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  </Grid>
                  <Grid item lg={4} md={8} xs={6}>
<FormControl fullWidth>
<InputLabel>Category</InputLabel>
<Select value={selectedValue} onChange={handleChange} label="Category">
{data &&
  data.getCategories.map((category: Category) => (
    <MenuItem key={category.id} value={category.id}>
      {category.name}
    </MenuItem>
  ))}
</Select>
</FormControl>
    </Grid>
                </Grid>
                
              )}
{selectedOptions.includes('x-company') && (
    <Grid item xs={12}>
<FormControl fullWidth>
<InputLabel>Category</InputLabel>
<Select value={selectedValue} onChange={handleChange} label="Category">
{data &&
  data.getCategories.map((category: Category) => (
    <MenuItem key={category.id} value={category.id}>
      {category.name}
    </MenuItem>
  ))}
</Select>
</FormControl>
    </Grid>
  )

}
              
            </Grid>
          </Paper>
        </Grid>
        {errorMessage && (
        <Grid item xs={12}>
          <Typography variant="body1" color="error">
            {errorMessage}
          </Typography>
        </Grid>
        )}
        {!isMobile ? (  
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
    startIcon={<Add />}
    onClick={handleAddTitle}
    style={{ whiteSpace: 'nowrap' }}
  >
    Add Item
  </Button>
</div>
</Paper>
        </Grid>
        ):''}
        {isMobile ? (  
        <Grid item xs={12}>
<Typography variant="h5" style={{ textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: '24px', marginBottom: '20px' }}>
  Fill your form
</Typography>
            
        <TableBody>
       
    {productTitles.map((title, index) => (
     
     <Grid item xs={12} key={index} sx={{  marginLeft:'1rem', padding: '8px', border: '1px solid #ddd' }}>


<Typography variant="h6">Item Number #{index + 1}</Typography>
          <FormControl style={{ flex: 1, marginBottom: '1rem'  }} >
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
               
                
                <Button  variant="text" component="label" htmlFor="upload-input"
                 style={{
                  textTransform: 'none',
                  fontSize: '14px',
                  color: '#00b0ad',
                  borderColor: '##00b0ad',
                }}
                >
            Upload picture
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-input"
              type="file"
              onChange={handleUpload}
            />
          </Button>
              </label>
            </div>
          </FormControl>
     <TextField
      label="Item Name"
      variant="outlined"
      fullWidth
      required
      value={title}
      onChange={(e) => handleTitleChange(index, e.target.value)}
      error={titleErrors[index] !== ''}
     style={{ marginBottom: '1rem' }}
    />
       <TextField
      label="Item Code"
      variant="outlined"
      fullWidth
      value={itemCodes[index]}
      onChange={(e) => handleItemCodeChange(index, e.target.value)}
     // error={itemCodeErrors[index] !== ''}
     style={{ marginBottom: '1rem' }}
    />
    <TextField
      label="Part Number"
      variant="outlined"
      fullWidth
      value={partNumbers[index]}
      onChange={(e) => handlePartNumberChange(index, e.target.value)}
    //  error={partNumberErrors[index] !== ''}
     style={{ marginBottom: '1rem' }}
    />
       <TextField
      label="UOM"
      variant="outlined"
      fullWidth
      value={uoms[index]}
      onChange={(e) => handleUomChange(index, e.target.value)}
//error={uomErrors[index] !== ''}
     style={{ marginBottom: '1rem' }}
    /> 
    <TextField
    type="number"
      label="Qty"
      required
      variant="outlined"
      fullWidth
      value={quantities[index]}
      onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
      error={quantityErrors[index] !== ''}
     style={{ marginBottom: '1rem' }}
    /> 
      
        <div>
        <Accordion
    key={index}
    expanded={expanded === `panel${index}`}
    onChange={handleAccordionChange(`panel${index}`)}
  >
        <AccordionSummary expandIcon={<Add />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography>Add More</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
         <TextField
      label="Mark"
      variant="outlined"
      fullWidth
      value={marks[index]}
      onChange={(e) => handleMarkChange(index, e.target.value)}
      error={quantityErrors[index] !== ''}
     style={{ marginBottom: '1rem' }}
    /> 
        
      <TextField
      label="Description"
      variant="outlined"
      fullWidth
      value={descriptions[index]}
      onChange={(e) => handleDescriptionChange(index, e.target.value)}
      //   error={quantityErrors[index] !== ''}
      style={{ marginBottom: '1rem' }}
      /> 
      <TextField
      label="Manufacture"
      variant="outlined"
      fullWidth
      value={manufacturers[index]}
      onChange={(e) => handleManufacturersChange(index, e.target.value)}
      //   error={quantityErrors[index] !== ''}
      style={{ marginBottom: '1rem' }}
      /> 
      <TextField
      label="Model"
      variant="outlined"
      fullWidth
      value={models[index]}
      onChange={(e) => handleModelChange(index, e.target.value)}
      //   error={quantityErrors[index] !== ''}
      style={{ marginBottom: '1rem' }}
      />
          </div>
        </AccordionDetails>
      </Accordion>


      {/* Rest of your code */}
    </div>
    
        
          <Button
            variant="contained"
            color="error"
            onClick={() => handleRemoveTitle(index)}
            disabled={productTitles.length === 1}
            startIcon={<DeleteOutlineTwoTone />}
          >
            
          </Button>
      </Grid>
    ))}
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
startIcon={<Add />}
onClick={handleAddTitle}
style={{ whiteSpace: 'nowrap' }}
>
Add Item
</Button>
</div>
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
          <Button  variant="text" component="label" htmlFor="upload-input"
                 style={{
                  textTransform: 'none',
                  fontSize: '14px',
                  color: '#00b0ad',
                  borderColor: '##00b0ad',
                }}
                >
            Upload 
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-input"
              type="file"
              onChange={handleUpload}
            />
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

<Grid>


        <Grid item xs={12} sm={12}>
  <Paper elevation={3} sx={{ padding: '20px' }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
      }}
    >
      <Button
        variant="outlined"
        color="primary"
        startIcon={<Send />}
        onClick={handleSubmit}
        style={{ whiteSpace: 'nowrap' }}
        ref={saveButtonRef}
      >
        Send
      </Button>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<Save />}
        onClick={() => handleSave('save')}
        style={{ whiteSpace: 'nowrap' }}
        ref={saveButtonRef}
      >
        Save
      </Button>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<RestoreFromTrash />}
        onClick={handleReset}
        style={{whiteSpace: 'nowrap'}}
      >
        Reset
      </Button>
    </div>
  </Paper>
</Grid>

      </Grid>
</Paper>
   </Grid>
  </TableBody>  
  </Grid>
  ):(

    <Grid item xs={12} sm={12}>
    <Paper elevation={3} sx={{ padding: '20px' }}>
        <div style={{
display: 'flex',
alignItems: 'center',
justifyContent: 'space-between',
marginBottom: '10px',
}}>
    <Table>
  <TableHead>
    <TableRow sx={{ backgroundColor: '#00b0ad' }}>
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
               
              <Button  variant="text" component="label" htmlFor="upload-input"
                 style={{
                  textTransform: 'none',
                  fontSize: '8px',
                  color: '#00b0ad',
                  borderColor: '##00b0ad',
                }}
                >
            Upload picture
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-input"
              type="file"
              onChange={handleUpload}
            />
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
        //  error={itemCodeErrors[index] !== ''}
          fullWidth
        />
        </TableCell>
        <TableCell sx={{ padding: '0px', height: '24px' }}>
        <Input
          placeholder="Part Number"
          value={partNumbers[index]}
          onChange={(e) => handlePartNumberChange(index, e.target.value)}
         // error={partNumberErrors[index] !== ''}
          fullWidth
        />
        </TableCell>
        <TableCell sx={{ padding: '0px', height: '24px' }}>
        <Input
  placeholder="UOM"
  value={uoms[index]}
  onChange={(e) => handleUomChange(index, e.target.value)}
  //error={uomErrors[index] !== ''}
  fullWidth
/>
        </TableCell>
        <TableCell sx={{ padding: '0px', height: '24px' }}>
  <Input
  type="number"
  placeholder="Qty"
  required
  value={quantities[index]}
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
        <AccordionSummary expandIcon={<Add />} aria-controls="panel1bh-content" id="panel1bh-header">
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
        //  error={itemCodeErrors[index] !== ''}
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
            startIcon={<DeleteOutlineTwoTone />}
          >
            
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
    </Table>
    </div>
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
          <Button  variant="text" component="label" htmlFor="upload-input"
                 style={{
                  textTransform: 'none',
                  fontSize: '14px',
                  color: '#00b0ad',
                  borderColor: '##00b0ad',
                }}
                >
            Upload 
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-input"
              type="file"
              onChange={handleUpload}
            />
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
  <Grid item xs={12} sm={6}>
    <TextField
      label="Requested By"
      variant="outlined"
      fullWidth
     value={requestedBy}
      onChange={(e) => handleRequestedByChange(e.target.value)}
     // error={requestedByError !== ''}
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      label="Approved By"
      variant="outlined"
      fullWidth
      value={approvedBy}
      onChange={(e) => handleApprovedByChange(e.target.value)}
      // error={approvedByError !== ''}
    />
  </Grid>
</Grid>
<Grid container spacing={2} alignItems="center" justifyContent="center" style={{ paddingTop: '20px' }}>
      <Grid item xs={6} sm={6}>
        <Button
          variant="outlined"
          color="primary" // Apply "#ccc" background color when loading is true
          startIcon={<RequestPageOutlined />}
          onClick={handleSubmit}
          ref={saveButtonRef}
          fullWidth
          disabled={loading} // Disable the button when loading is true
        >
           {loading ? (
            <div>
               <CircularProgress size={24} style={{ color: 'red' }} />
          Sending.....
            </div>
         
        ) : (
          'Send Request'
        )}
        </Button>
      </Grid>
      <Grid item xs={6} sm={6}>
        <Button
          variant="outlined"
          color="primary" // Apply "#ccc" background color when loading is true
          startIcon={<RequestPageOutlined />}
          onClick={() => handleSave('save')}
          ref={saveButtonRef}
          fullWidth
          disabled={loading} // Disable the button when loading is true
        >
           {loading ? (
            <div>
               <CircularProgress size={24} style={{ color: 'red' }} />
          Saving.....
            </div>
         
        ) : (
          'Save Request'
        )}
        </Button>
      </Grid>
      <Grid item xs={6} sm={6}>
        <Button
          variant="contained"
          style={{ backgroundColor: '#ccc', color: '#ffffff' }}
          fullWidth
          onClick={handleReset}
        >
          Reset
        </Button>
      </Grid>
</Grid>
</Paper>
   </Grid>
   </Paper>
   </Grid>
  ) 
}
        {isMobile && (
          <Grid item xs={12}>
            {/* Additional content for mobile layout */}
          </Grid>
        )}
      </Grid>
      </form>
        {loadingSuppliers && <p>Loading suppliers...</p>}
    </ThemeProvider>
)
};

export default SavedForm;