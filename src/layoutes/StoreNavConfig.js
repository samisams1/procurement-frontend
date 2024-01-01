const getIcon = (name) => ({
  icon: name,
});

export const StoreNavConfig = [
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
    path: 'purchaseRequestList',
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
];