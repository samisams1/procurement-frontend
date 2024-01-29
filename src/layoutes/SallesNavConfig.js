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
    title: 'Requisition',
    icon: getIcon('ri:product-hunt-fill'),
    items: [
      {
        title: 'New Requisition',
        path: 'newRequest',
        icon: getIcon('mdi:report-areaspline-variant'),
      },
      {
        title: 'Requisitions',
        path: 'requisitions',
        icon: getIcon('ri:product-hunt-fill'),
      },
    ],
  },
  {
    title: 'RFQ',
    path: 'rfq',
    icon: getIcon('foundation:burst-sale'),
  },
  {
    title: 'Order',
    path: 'order',
    icon: getIcon('foundation:burst-sale'),
  },
  {
    title: 'Payment',
    icon: getIcon('ri:product-hunt-fill'),
    items: [
      {
        title: 'Make Payment',
        path: 'makePayment',
        icon: getIcon('mdi:report-areaspline-variant'),
      },
      {
        title: 'Invoices',
        path: 'invoices',
        icon: getIcon('ri:product-hunt-fill'),
      },
    ],
  },
  {
    title: 'Shipping',
    path: 'shipping',
    icon: getIcon('mdi:report-areaspline-variant'),
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
