import React, { useContext } from 'react';
import Iconify from "../components/Iconify";
import { UserContext } from '../auth/UserContext';
import { useNavigate } from 'react-router-dom';

const getIcon = (name) => <Iconify icon={name} width={22} height={22} color="#00b0ad" />;

const SallesNavConfig = () => {
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
      title: 'Requests',
      icon: getIcon('ri:product-hunt-fill'),
      items: [
        {
          title: 'Incoming Requests',
          path: 'purchaseRequests',
          icon: getIcon('fluent-mdl2:review-request-solid'),
        },
        {
          title: 'Sent Proforma invoice',
          path: 'sentProformaInvoice',
          icon: getIcon('ri:product-hunt-fill'),
        },
        {
          title: 'RFQ Drafts ',
          path: 'rfqDraft',
          icon: getIcon('ri:product-hunt-fill'),
        },
      ],
    },
    {
      title: 'Order',
      icon: getIcon('ri:product-hunt-fill'),
      items: [
        {
          title: 'Incoming Order',
          path: 'incomingOrder',
          icon: getIcon('fluent-mdl2:review-request-solid'),
        },
        {
          title: 'comfirmedOrder',
          path: 'comfirmedOrder',
          icon: getIcon('ri:product-hunt-fill'),
        },
        {
          title: 'approvedOrder',
          path: 'approvedOrder',
          icon: getIcon('ri:product-hunt-fill'),
        },
        {
          title: 'rejectedOrder',
          path: 'rejectedOrder',
          icon: getIcon('ri:product-hunt-fill'),
        },
      ],
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
      title: 'Report',
      path: 'report',
      icon: getIcon('mdi:report-areaspline-variant'),
    },
    {
      title: 'Logout',
      icon: getIcon('bi:box-arrow-right'),
      onClick: handleLogoutClick,

    },
  ];
};

export default SallesNavConfig;