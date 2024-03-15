/*import React from 'react';
import Iconify from "../components/Iconify";

const getIcon = (name) => <Iconify icon={name} width={22} height={22} color="#00b0ad" />;
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
      title: 'Notification',
      path: 'notificaations',
      icon: getIcon('uiw:notification'),
    },
    {
      title: 'Payment',
      icon: getIcon('ri:product-hunt-fill'),
      items: [
        {
          title: 'Payment',
          path: 'payment',
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
      title: 'Setting',
      path: 'setting',
      icon: getIcon('uiw:setting'),
    },
    {
      title: 'Supplier Profile',
      path: 'supplier',
      icon: getIcon('mdi:report-areaspline-variant'),
    },
    {
      title: 'Report',
      path: 'report',
      icon: getIcon('mdi:report-areaspline-variant'),
    },
  ];
*/
import React, { useContext } from 'react';
import Iconify from "../components/Iconify";
import { UserContext } from '../auth/UserContext';
import { useNavigate } from 'react-router-dom';

const getIcon = (name) => <Iconify icon={name} width={22} height={22} color="#00b0ad" />;

const SupplierNavConfig = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setCurrentUser(null); // Assuming there is a setCurrentUser function in the UserContext
    navigate('/home');
  };

  const handleLogoutClick = () => {
    handleLogout();
  };
  return [
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
          title: 'Sent Requisitions',
          path: 'requisitions',
          icon: getIcon('ri:product-hunt-fill'),
        },
        {
          title: 'Saved Drafts',
          path: 'drafts',
          icon: getIcon('mdi:report-areaspline-variant'),
        }
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
      title: 'Report',
      path: 'report',
      icon: getIcon('mdi:report-areaspline-variant'),
    },
    {
      title: 'Setting',
      path: 'setting',
      icon: getIcon('uiw:setting'),
    },
    {
      title: 'Logout',
      icon: getIcon('bi:box-arrow-right'),
      onClick: handleLogoutClick,

    },
  ];
};

export default SupplierNavConfig;