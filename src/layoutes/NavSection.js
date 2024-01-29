import React, { useContext, useState } from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SallesNavConfig } from './SallesNavConfig';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Spinner from '../components/Spinner';
import { UserContext } from '../auth/UserContext';
import { SupplierNavConfig } from './SupplierNavConfig';
import { NavConfig } from './NavConfig';

export default function NavSection() {
  const [openItems, setOpenItems] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  if (!currentUser) {
    return <Spinner />;
  }

  const { role } = currentUser;

  const handleItemClick = (path) => {
    console.log('Clicked path:', path);
    navigate(path);
  };

  const toggleOpenItems = (index) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter((item) => item !== index));
    } else {
      setOpenItems([...openItems, index]);
    }
  };

  const renderNestedItems = (items, parentIndex) => {
    return (
      <Collapse in={openItems.includes(parentIndex)}>
        <List sx={{ paddingLeft: '24px', paddingTop: '0', paddingBottom: '0' }}>
          {items.map((item) => (
            <ListItemButton
              key={item.title}
              onClick={() => handleItemClick(item.path)}
              sx={{
                paddingLeft: '24px',
                paddingTop: '2px',
                paddingBottom: '2px',
                '&:hover': {
                  backgroundColor: '#E3F2FD',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.title}</ListItemText>
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    );
  };

  const listItemsCustomer = SallesNavConfig.map((mainItem, index) => (
    <List
      sx={{
        width: '240px',
        bgcolor: 'background.paper',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        '& .MuiListItemButton-root': {
          '&:hover': {
            backgroundColor: '#E3F2FD',
          },
        },
      }}
      key={mainItem.title}
    >
      {mainItem.items ? (
        
        <ListItemButton
          onClick={() => toggleOpenItems(index)}
          sx={{
            paddingLeft: '12px',
            paddingTop: '8px',
            paddingBottom: '8px',
            '&:hover': {
              backgroundColor: '#E3F2FD',
            },
          }}
        >
          <ListItemIcon>{mainItem.icon}</ListItemIcon>
          <ListItemText>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {mainItem.title}
            </Typography>
          </ListItemText>
          {openItems.includes(index) ? (
            <ExpandMoreIcon fontSize="small" sx={{ marginLeft: 'auto' }} />
          ) : (
            <ChevronRightIcon fontSize="small" sx={{ marginLeft: 'auto' }} />
          )}
        </ListItemButton>
      ) : (
        <ListItemButton
          onClick={() => handleItemClick(mainItem.path)}
          sx={{
            paddingLeft: '12px',
            paddingTop: '8px',
            paddingBottom: '8px',
            '&:hover': {
              backgroundColor: '#E3F2FD',
            },
          }}
        >
          <ListItemIcon>{mainItem.icon}</ListItemIcon>
          <ListItemText>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {mainItem.title}
            </Typography>
          </ListItemText>
        </ListItemButton>
      )}
      {mainItem.items && renderNestedItems(mainItem.items, index)}
    </List>
  ));
  const listItemsSupplier = SupplierNavConfig.map((mainItem, index) => (
    <List
      sx={{
        width: '240px',
        bgcolor: 'background.paper',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        '& .MuiListItemButton-root': {
          '&:hover': {
            backgroundColor: '#E3F2FD',
          },
        },
      }}
      key={mainItem.title}
    >
      {mainItem.items ? (
        
        <ListItemButton
          onClick={() => toggleOpenItems(index)}
          sx={{
            paddingLeft: '12px',
            paddingTop: '8px',
            paddingBottom: '8px',
            '&:hover': {
              backgroundColor: '#E3F2FD',
            },
          }}
        >
          <ListItemIcon>{mainItem.icon}</ListItemIcon>
          <ListItemText>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {mainItem.title}
            </Typography>
          </ListItemText>
          {openItems.includes(index) ? (
            <ExpandMoreIcon fontSize="small" sx={{ marginLeft: 'auto' }} />
          ) : (
            <ChevronRightIcon fontSize="small" sx={{ marginLeft: 'auto' }} />
          )}
        </ListItemButton>
      ) : (
        <ListItemButton
          onClick={() => handleItemClick(mainItem.path)}
          sx={{
            paddingLeft: '12px',
            paddingTop: '8px',
            paddingBottom: '8px',
            '&:hover': {
              backgroundColor: '#E3F2FD',
            },
          }}
        >
          <ListItemIcon>{mainItem.icon}</ListItemIcon>
          <ListItemText>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {mainItem.title}
            </Typography>
          </ListItemText>
        </ListItemButton>
      )}
      {mainItem.items && renderNestedItems(mainItem.items, index)}
    </List>
  ));
  const listItemsAdmin = NavConfig.map((mainItem, index) => (
    <List
      sx={{
        width: '240px',
        bgcolor: 'background.paper',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        '& .MuiListItemButton-root': {
          '&:hover': {
            backgroundColor: '#E3F2FD',
          },
        },
      }}
      key={mainItem.title}
    >
      {mainItem.items ? (
        
        <ListItemButton
          onClick={() => toggleOpenItems(index)}
          sx={{
            paddingLeft: '12px',
            paddingTop: '8px',
            paddingBottom: '8px',
            '&:hover': {
              backgroundColor: '#E3F2FD',
            },
          }}
        >
          <ListItemIcon>{mainItem.icon}</ListItemIcon>
          <ListItemText>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {mainItem.title}
            </Typography>
          </ListItemText>
          {openItems.includes(index) ? (
            <ExpandMoreIcon fontSize="small" sx={{ marginLeft: 'auto' }} />
          ) : (
            <ChevronRightIcon fontSize="small" sx={{ marginLeft: 'auto' }} />
          )}
        </ListItemButton>
      ) : (
        <ListItemButton
          onClick={() => handleItemClick(mainItem.path)}
          sx={{
            paddingLeft: '12px',
            paddingTop: '8px',
            paddingBottom: '8px',
            '&:hover': {
              backgroundColor: '#E3F2FD',
            },
          }}
        >
          <ListItemIcon>{mainItem.icon}</ListItemIcon>
          <ListItemText>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {mainItem.title}
            </Typography>
          </ListItemText>
        </ListItemButton>
      )}
      {mainItem.items && renderNestedItems(mainItem.items, index)}
    </List>
  ));
  //return <div>{listItemsCustomer}</div>;

    if (role === 'CUSTOMER') {
    return <ul>{listItemsCustomer}</ul>;
  }else if (role === 'SUPPLIER') {
    return <ul>{listItemsSupplier}</ul>;
  }else if (role === 'ADMIN') {
    return <ul>{listItemsAdmin}</ul>;
  }
  
  else {
    return null;
  }
}