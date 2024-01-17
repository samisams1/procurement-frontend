import React from 'react';
import Iconify from "../components/Iconify";

const getIcon = (name) => <Iconify icon={name} width={22} height={22} color="#3c44b1" />;

export const SupplierNavConfig = [
  {
    title: 'Dashboard',
    path: '/',
    icon: getIcon('material-symbols:dashboard'),
  },
  {
    title: 'Profile',
    path: 'profile',
    icon: getIcon('iconamoon:profile-fill'),
  },
  {
    title: 'Requests',
    path: 'purchaseRequests',
    icon: getIcon('fluent-mdl2:review-request-solid'),
  },
  {
    title: 'Order',
    path: 'order',
    icon: getIcon('icon-park-solid:transaction-order'),
  },
  {
    title: 'Setting',
    path: 'setting',
    icon: getIcon('uiw:setting'),
  },
  {
    title: 'Report',
    path: 'report',
    icon: getIcon('mdi:report-areaspline-variant'),
  },
];
  