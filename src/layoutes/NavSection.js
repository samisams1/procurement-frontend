import React, { useContext } from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { navConfig } from './NavConfig';
import Spinner from '../components/Spinner';
import { SallesNavConfig } from './SallesNavConfig';
import { UserContext } from '../auth/UserContext';
import { SupplierNavConfig } from './SupplierNavConfig';

export default function NavSection() {
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };
  const { currentUser } = useContext(UserContext);

  if (!currentUser) {
    return <Spinner />;
  }

  const { role } = currentUser;

  const lists = navConfig.filter((navItem) => navItem);

  const listsStore = SupplierNavConfig.filter((navItem) => navItem);

  const listSalles = SallesNavConfig.filter((navItem) => navItem);

  const listItems = lists.map((navItem) => (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} key={navItem.title}>
      <ListItemButton onClick={() => routeChange(navItem.path)}>
        <ListItemIcon>{navItem.icon}</ListItemIcon>
        <ListItemText>{navItem.title}</ListItemText>
      </ListItemButton>
    </List>
  ));

  const listItemsSeller = listSalles.map((navItem) => (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} key={navItem.title}>
      <ListItemButton onClick={() => routeChange(navItem.path)}>
        <ListItemIcon>{navItem.icon}</ListItemIcon>
        <ListItemText>{navItem.title}</ListItemText>
      </ListItemButton>
    </List>
  ));

  const listItemsStore = listsStore.map((navItem) => (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} key={navItem.title}>
      <ListItemButton onClick={() => routeChange(navItem.path)}>
      <ListItemIcon>{navItem.icon}</ListItemIcon>
        <ListItemText>{navItem.title}</ListItemText>
      </ListItemButton>
    </List>
  ));

  if (role === 'ADMIN') {
    return <ul>{listItems}</ul>;
  } else if (role === 'SUPPLIER') {
    return <ul>{listItemsStore}</ul>;
  } else if (role === 'CUSTOMER') {
    return <ul>{listItemsSeller}</ul>;
  } else {
    return null;
  }
}