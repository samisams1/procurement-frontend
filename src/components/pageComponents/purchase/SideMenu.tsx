import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CategoryIcon from '@mui/icons-material/Category';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';

const SideMenu: React.FC = () => {
  return (
    <List>
      <ListItem button component={Link} to="/dashboard">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button component={Link} to="/orders">
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItem>
      <List component="div" disablePadding>
        <ListItem button component={Link} to="/orders/all">
          <ListItemText inset primary="All Orders" />
        </ListItem>
        <ListItem button component={Link} to="/orders/create">
          <ListItemText inset primary="Create New Order" />
        </ListItem>
        <ListItem button component={Link} to="/orders/status">
          <ListItemText inset primary="Order Status" />
        </ListItem>
        <ListItem button component={Link} to="/orders/history">
          <ListItemText inset primary="Order History" />
        </ListItem>
      </List>
      <ListItem button component={Link} to="/purchase-requests">
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Purchase Requests" />
      </ListItem>
      <List component="div" disablePadding>
        <ListItem button component={Link} to="/purchase-requests/all">
          <ListItemText inset primary="All Requests" />
        </ListItem>
        <ListItem button component={Link} to="/purchase-requests/create">
          <ListItemText inset primary="Create New Request" />
        </ListItem>
        <ListItem button component={Link} to="/purchase-requests/status">
          <ListItemText inset primary="Request Status" />
        </ListItem>
        <ListItem button component={Link} to="/purchase-requests/history">
          <ListItemText inset primary="Request History" />
        </ListItem>
      </List>
      <ListItem button component={Link} to="/payments">
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Payments" />
      </ListItem>
      <List component="div" disablePadding>
        <ListItem button component={Link} to="/payments/invoices">
          <ListItemText inset primary="View Invoices" />
        </ListItem>
        <ListItem button component={Link} to="/payments/make">
          <ListItemText inset primary="Make Payments" />
        </ListItem>
        <ListItem button component={Link} to="/payments/history">
          <ListItemText inset primary="Payment History" />
        </ListItem>
        <ListItem button component={Link} to="/payments/reports">
          <ListItemText inset primary="Payment Reports" />
        </ListItem>
      </List>
      <ListItem button component={Link} to="/shipping">
        <ListItemIcon>
          <LocalShippingIcon />
        </ListItemIcon>
        <ListItemText primary="Shipping" />
      </ListItem>
      <List component="div" disablePadding>
        <ListItem button component={Link} to="/shipping/track">
          <ListItemText inset primary="Track Shipments" />
        </ListItem>
        <ListItem button component={Link} to="/shipping/schedules">
          <ListItemText inset primary="Delivery Schedules" />
        </ListItem>
        <ListItem button component={Link} to="/shipping/inventory">
          <ListItemText inset primary="Inventory Management" />
        </ListItem>
        <ListItem button component={Link} to="/shipping/returns">
          <ListItemText inset primary="Returns and Exchanges" />
        </ListItem>
      </List>
      <ListItem button component={Link} to="/categories">
        <ListItemIcon>
          <CategoryIcon />
        </ListItemIcon>
        <ListItemText primary="Categories" />
      </ListItem>
      <List component="div" disablePadding>
        <ListItem button component={Link} to="/categories/view">
          <ListItemText inset primary="View Categories" />
        </ListItem>
        <ListItem button component={Link} to="/categories/create">
          <ListItemText inset primary="Create New Category" />
        </ListItem>
        <ListItem button component={Link} to="/categories/edit">
          <ListItemText inset primary="Edit Categories" />
        </ListItem>
        <ListItem button component={Link} to="/categories/delete">
          <ListItemText inset primary="Delete Categories"       />
           </ListItem>
      </List>
      <ListItem button component={Link} to="/rfq">
        <ListItemIcon>
          <RequestQuoteIcon />
        </ListItemIcon>
        <ListItemText primary="RFQ (Request for Quotation)" />
      </ListItem>
      <List component="div" disablePadding>
        <ListItem button component={Link} to="/rfq/send">
          <ListItemText inset primary="Send RFQs" />
        </ListItem>
        <ListItem button component={Link} to="/rfq/view">
          <ListItemText inset primary="View Quotes" />
        </ListItem>
        <ListItem button component={Link} to="/rfq/compare">
          <ListItemText inset primary="Compare Quotes" />
        </ListItem>
        <ListItem button component={Link} to="/rfq/supplier">
          <ListItemText inset primary="Supplier Selection" />
        </ListItem>
      </List>
      <ListItem button component={Link} to="/user-management">
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="User Management" />
      </ListItem>
      <List component="div" disablePadding>
        <ListItem button component={Link} to="/user-management/view">
          <ListItemText inset primary="View Users" />
        </ListItem>
        <ListItem button component={Link} to="/user-management/create">
          <ListItemText inset primary="Create New User" />
        </ListItem>
        <ListItem button component={Link} to="/user-management/edit">
          <ListItemText inset primary="Edit User Details" />
        </ListItem>
        <ListItem button component={Link} to="/user-management/delete">
          <ListItemText inset primary="Delete Users" />
        </ListItem>
      </List>
      <ListItem button component={Link} to="/access-control">
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Access Control" />
      </ListItem>
      <List component="div" disablePadding>
        <ListItem button component={Link} to="/access-control/roles">
          <ListItemText inset primary="Roles and Permissions" />
        </ListItem>
        <ListItem button component={Link} to="/access-control/groups">
          <ListItemText inset primary="User Groups" />
        </ListItem>
      </List>
      <ListItem button component={Link} to="/reports">
        <ListItemIcon>
          <HistoryIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItem>
      <List component="div" disablePadding>
        <ListItem button component={Link} to="/reports/order-history">
          <ListItemText inset primary="Order History" />
        </ListItem>
        <ListItem button component={Link} to="/reports/request-history">
          <ListItemText inset primary="Request History" />
        </ListItem>
        <ListItem button component={Link} to="/reports/payment-history">
          <ListItemText inset primary="Payment History" />
        </ListItem>
        <ListItem button component={Link} to="/reports/user-management-history">
          <ListItemText inset primary="User Management History" />
        </ListItem>
      </List>
    </List>
  );
};

export default SideMenu;