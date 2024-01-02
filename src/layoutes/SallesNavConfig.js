import React from 'react';
import Iconify from "../components/Iconify";

const getIcon = (name) => <Iconify icon={name} width={22} height={22} color="#3c44b1" />;

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
    title: 'Purchase',
    path: 'purchase',
    icon: getIcon('ri:product-hunt-fill'),
  },
  {
    title: 'Quotation',
    path: 'quotationList',
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
  