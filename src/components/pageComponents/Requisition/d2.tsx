import React, { useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Grid,createTheme, Paper,ThemeProvider,Typography, styled, Button } from '@mui/material';
import { gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../auth/UserContext';
import Spinner from '../../Spinner';
import PageHeader from '../../PageHeader';
import MUIDataTable, {MUIDataTableOptions, Responsive } from 'mui-datatables';
import { SectionTitle } from '../../Section';
import { Print, RequestPageOutlined } from '@mui/icons-material';
import PageFooter from '../../PageFooter';
import Popup from '../../Popup';
import './requistion.css';
const paperStyle = {
  padding: '1rem',
  borderRadius: '8px',
  transition: 'border-color 0.3s ease',
  border: '2px solid #ffffff',

};

const paperHoverStyle = {
  borderColor: '#00b0ad',
};

const typographyStyle = {
  marginBottom: '0.5rem',
  fontWeight: 'bold',
};
const Image = styled('img')({
  marginLeft: 'auto',
  width: '2000px', // Adjust the width as needed
  height: '2000px',
});

const GET_PURCHASE_REQUEST_BY_ID = gql`
  query PurchaseRequestById($id: Int!) {
    purchaseRequestById(id: $id) {
      id
      userId
      status
      remark
      addressDetail
      estimatedDelivery
      referenceNumber
      requestedBy
      approvedBy
      createdAt
      products {
        id
        Description
        code
        model
        partNumber
        mark
        quantity
        title
        manufacturer
        uom
        imageurl
      }
      user {
        firstName
        lastName
        address
      }
      category {
        name
      }
    }
  }
`;

interface Product {
  id: string;
  Description: string;
  code: string;
  manufacturer: string;
  model: string;
  partNumber: string;
  quantity: number;
  title: string;
  uom: string;
  mark:string;
  imageurl:string;
}
interface User {
  firstName:string;
  lastName:string;
  address:string;
}
interface Category {
  name:string
}
interface PurchaseRequest {
  id: string;
  userId: string;
  status: string;
  remark: string;
  addressDetail: string;
  estimatedDelivery: string;
  approvedBy:string;
  requestedBy:string;
  referenceNumber: string;
  createdAt: string;
  products: Product[];
  user: User;
  category: Category;
}

interface OrderDetailData {
  purchaseRequestById: PurchaseRequest[];
}

interface OrderDetailVariables {
  id: number;
}

const MobileGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

function Detail() {
  const { id } = useParams<{ id?: string }>();
  const [isHovered, setIsHovered] = React.useState(false);
  const [openPopup, setOpenPopup] = useState(false);

  const { loading, error, data } = useQuery<OrderDetailData, OrderDetailVariables>(GET_PURCHASE_REQUEST_BY_ID, {
    variables: { id: Number(id) },
  });
  const { currentUser } = useContext(UserContext);
  const openModal = () => {
    setOpenPopup(true);
  };

  if (!currentUser || loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const orderDetail = data?.purchaseRequestById[0]; // Assuming there's only one order detail for a given order ID
  const handlePrint = () => {
    window.print();
  };
  const columns = [
    {
      name: 'id',
      label: '#',
    },
    {
      name: "imageurl",
      label: "Image",
      
      options: {
        customBodyRender: (value:string) => {
          return (
            <Image
              src={require(`../../../assets/car.jpg`)}  
              alt="Product"
              style={{ width: "50px", height: "auto" }}
              onClick={openModal}
            />
          );
        },
      },
    },
    
    {
      name: 'title',
      label: 'Title',
    },
    {
      name: 'uom',
      label: 'uom',
      options: {
        display: false,
      }
    },
    {
      name: 'partNumber',
      label: 'partNumber',
      options: {
        display: false,
      }
    },
    {
      name: 'model',
      label: 'model',
      options: {
        display: false,
      }
    },
    {
      name: 'manufacturer',
      label: 'manufacture',
      options: {
        display: false,
      }
    },
    {
      name: 'mark',
      label: 'mark',
      options: {
        display: false,
      }
    },
    {
      name: 'code',
      label: 'code',
      options: {
        display: false,
      }
    },
    {
      name: 'Description',
      label: 'Description',
      options: {
        display: false,
      }
    },
    {
      name: 'quantity',
      label: 'Quantity',
      options: {
        display: true,
      }
    }
  ];

  const tableData = orderDetail?.products.map((product, index) => ({
    id: index + 1,
    imageurl: <Image   src={require(`../../../assets/car.jpg`)}   alt="Header Image" />,
    title: product.title,
    quantity: product.quantity,
    code: product.code,
    manufacturer: product.manufacturer,
    partNumber: product.partNumber,
    Description: product.Description,
    model: product.model,
    uom: product.uom,
    mark: product.mark,
  }));

  // Table Options
  const options: MUIDataTableOptions = {
    filter: true,
    download: true,
    print: true,
    search: true,
    selectableRows: 'none', // or 'single' for single row selection
    responsive: 'standard',
    viewColumns: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50],
    customToolbar: () => <CustomToolbar />,
    customFooter: () => <CustomFooter />,
  };
  const theme = createTheme({
    components: {
      MUIDataTableHeadCell: {
        styleOverrides: {
          root: {
            backgroundColor: '#00b0ad',
            color: 'white',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
      },
    },
  });
  const createdDate = orderDetail?.createdAt ? new Date(orderDetail.createdAt) : null;
  const formattedDate = createdDate?.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getPaperStyle = () => {
    if (isHovered) {
      return { ...paperStyle, ...paperHoverStyle };
    }
    return paperStyle;
  };
// Custom Toolbar Component
const CustomToolbar = () => {
  return (
    <div className="printable-table" style={{ width: '100%' }}>
    <ThemeProvider theme={theme}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SectionTitle variant="outlined" square>
            <PageHeader
              title="Purchase Request"
              imageSrc="pro.png"
              subTitle="Purchase Request"
              icon={<Print />}
            />
          </SectionTitle>
        </Grid>
      </Grid>
    </ThemeProvider>
  </div>
  );
};

const CustomFooter = () => {
  return (
    <tfoot>
    <tr>
      <td colSpan={3}>
        <Typography
          variant="body1"
          style={{
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px', // Add padding here
          }}
        >
          <span>Requested By: {orderDetail?.requestedBy}</span>
          <span>Approved By: {orderDetail?.approvedBy}</span>
        </Typography>
      </td>
    </tr>
  </tfoot>

  );
};

  return (
    <Grid container spacing={2}>
    <Grid item xs={12}>
     
     
      <MobileGrid container spacing={2}>
        {/* Order By */}
        <Grid item xs={12} sm={4}>
        <Paper
      style={getPaperStyle()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Typography variant="h6" style={typographyStyle}>
        Requested By
      </Typography>
      <Typography variant="body1">
        Customer Name: {orderDetail?.user.firstName  + " " +   orderDetail?.user.lastName   }
      </Typography>
      <Typography variant="body1">
        Reference Number: {orderDetail?.referenceNumber}
      </Typography>
      <Typography variant="body1">
        Created Date: {formattedDate}
      </Typography>
      <Typography variant="body1">
        Customer Name: {orderDetail?.user?.address}
      </Typography>
    </Paper>
        </Grid>
        {/* Order To */}
        <Grid item xs={12} sm={4}>
        <Paper
      style={getPaperStyle()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
            <Typography variant="h6">Requested To</Typography>
            <Typography variant="body1">Category : {orderDetail?.category.name}</Typography>
          </Paper>
        </Grid>

        {/* More */}
        <Grid item xs={12} sm={4}>
        <Paper
      style={getPaperStyle()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
            <Typography variant="h6">More</Typography>
            <Typography variant="body1">Status: <span style={{color:"red"}}>{orderDetail?.status}</span></Typography>
            <Typography variant="body1">Estimated Delivery Date: <span style={{color:"red"}}>{orderDetail?.estimatedDelivery}</span></Typography>
            <Typography variant="body1">Remark: <span style={{color:"green"}}>{orderDetail?.remark}</span></Typography>
          </Paper>
        </Grid>
      </MobileGrid>
      <ThemeProvider theme={theme}>
    
 <div className="printable-table">
      <MUIDataTable
      title=""
        data={tableData || []}
        columns={columns}
        options={options}
      />
    </div>
   
      <Popup openPopup={openPopup} setOpenPopup={setOpenPopup}>
      <Image
              src={require(`../../../assets/car.jpg`)}  
              alt="Product"
              style={{ width: "500px", height: "auto" }}
            />
      </Popup>
        </ThemeProvider>
     
    <PageFooter/>
    </Grid>
    </Grid>
  );
}

export default Detail;
// CSS media query
const styles = `
  @media print {
    button {
      display: none !important;
    }
  }
`;

// Add the CSS styles to the bottom of your code
const styleElement = document.createElement('style');
styleElement.type = 'text/css';
styleElement.appendChild(document.createTextNode(styles));
document.head.appendChild(styleElement);