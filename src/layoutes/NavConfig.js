import React from 'react';
import Iconify from "../components/Iconify";

const getIcon = (name) => <Iconify icon={name} width={22} height={22} color="#00b0ad" />;
export const NavConfig = [
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
      title: 'Order',
      path: 'order',
      icon: getIcon('icon-park-solid:transaction-order'),
    },
    {
      title: 'Requisitions',
      path: 'requisitions',
      icon: getIcon('fluent-mdl2:review-request-solid'),
    },
    {
      title: 'RFQ',
      path: 'rfq',
      icon: getIcon('foundation:burst-sale'),
    },
    {
      title: 'Notification',
      path: 'notificaations',
      icon: getIcon('uiw:notification'),
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
      title: 'User Managment',
      icon: getIcon('ri:product-hunt-fill'),
      items: [
        {
          title: 'Users',
          path: 'user',
          icon: getIcon('mdi:report-areaspline-variant'),
        },
        {
          title: 'Supplier',
          path: 'suppliers',
          icon: getIcon('mdi:report-areaspline-variant'),
        },
        {
          title: ' Manage  Status ',
          path: 'access',
          icon: getIcon('ri:product-hunt-fill'),
        },
      ],
    },
    {
      title: 'Category',
      path: 'category',
      icon: getIcon('icon-park-solid:transaction-order'),
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

  