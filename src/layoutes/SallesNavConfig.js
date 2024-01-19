import React from 'react';
import Iconify from "../components/Iconify";

const getIcon = (name) => <Iconify icon={name} width={22} height={22} color="#1c9fef" />;

export const SallesNavConfig = [
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
    title: 'New Requisition',
    path: 'newRequest',
    icon: getIcon('ri:product-hunt-fill'),
  },
  {
    title: 'Manage Requisition',
    path: 'manageRequisition',
    icon: getIcon('ri:product-hunt-fill'),
  },
  {
    title: 'RFQ',
    path: 'rfq',
    icon: getIcon('foundation:burst-sale'),
  },
 
  {
    title: 'order',
    path: 'order',
    icon: getIcon('foundation:burst-sale'),
  },
  {
    title: 'MyPurchseRequest',
    path: 'myRequest',
    icon: getIcon('foundation:burst-sale'),
  },
{
  title: 'Report',
  path: 'report',
  icon: getIcon('mdi:report-areaspline-variant'),
},
{
    title: 'Setting',
    path: 'setting',
    icon: getIcon('uiw:setting'),
},
];
  