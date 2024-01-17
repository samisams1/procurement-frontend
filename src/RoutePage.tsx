import * as React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import LogoOnlyLayout from './layoutes/LogoOnlyLayout';
import ForgotPassword from './pages/account/ForgotPassword';
import Request from "./pages/Request";
import Dashboard from './pages/dashboard';
import { Report } from './pages/report/Report';
import { RequestHistory } from './pages/Request/RequestHistory';
import ProtectedRoute from './auth/ProtectedRoute';
import { Category } from './pages/category/Category';
import Setting from './pages/setting/Setting';
//import { Profile } from './pages/profile/Profile';
import Login from './pages/login/Login';
import NotFoundPage from './pages/NotFoundPage';
import DashboardLayout from './layoutes/DashboardLayout';
import { User } from './pages/User';
import Purchase from './pages/purchase';
import PurchaseOrder from './pages/purchase/purchaseOrder';
import Invoice from './pages/invoice';
//import PurchaseRequestList from './pages/purchase/purchaseRequestList';
import PurchaseRequestDetail from './pages/purchase/purchaseRequestDetail';
import QuotationList from './pages/Quotation/QuotationList';
import QuotationDetail from './pages/Quotation/QuotationDetail';
import { Profile } from './pages/profile/Profile';
import Register from './pages/account/Register';
import PurchaseRequest from './pages/purchase/purchaseRequest';
import Order from './pages/order';
import NotificationDetail from './pages/notification';
import MyPurchaseRequest from './pages/purchase/myPurchaseRequest';
import ManageRequisition from './pages/purchase/manageRequisition';
import Rfq from './pages/Quotation/rfq';
import ManageRfq from './pages/Quotation/manageRfq';
import OrderDetail from './components/pageComponents/order/customer/orderDetail';
export default function RoutePage() {

    return useRoutes([
        {
            path: '/',
            element: <DashboardLayout />,
            children: [
              { path: '/', element: <ProtectedRoute  element={<Dashboard />} /> },
              { path: '/order', element: <ProtectedRoute  element={<Order />} /> },
              { path: '/request', element: <ProtectedRoute element={<Request />} /> },
              { path: '/category', element: <ProtectedRoute element={<Category />} /> },
              { path: '/user', element: <ProtectedRoute  element={<User />} /> },
              { path: '/requestHistory', element: <ProtectedRoute element={<RequestHistory />} /> },
              { path: '/profile', element: <ProtectedRoute  element={<Profile />} /> },
              { path: '/report', element: <ProtectedRoute element={<Report />} /> },
              { path: '/setting', element: <ProtectedRoute  element={<Setting />} /> },
              { path: '/purchase', element: <ProtectedRoute  element={<Purchase />} /> },
              { path: '/purchaseOrder', element: <ProtectedRoute  element={<PurchaseOrder />} /> },
              { path: '/invoice', element: <ProtectedRoute  element={<Invoice />} /> },
              { path: '/purchaseRequests', element: <ProtectedRoute  element={<PurchaseRequest />} /> },
              { path: '/myRequest', element: <ProtectedRoute  element={<MyPurchaseRequest />} /> },
              { path: '/manageRequisition', element: <ProtectedRoute  element={<ManageRequisition />} /> },
              { path:'/purchaseRequestDetail/:id', element: <ProtectedRoute  element={<PurchaseRequestDetail />} /> },
              { path:'/rfq', element: <ProtectedRoute  element={<Rfq />} /> },

              { path:'/manageRfq/:id', element: <ProtectedRoute  element={<ManageRfq />} /> },
              { path:'/quotationDetail/:id', element: <ProtectedRoute  element={<QuotationDetail />} /> },
              { path:'/notificationDetail/:id', element: <ProtectedRoute  element={<NotificationDetail />} /> },
               
              { path:'/orderDetail/:id', element: <ProtectedRoute  element={<OrderDetail />} /> },
            ],
          },
          {
            path: '/',
            element: <LogoOnlyLayout />,
            children: [
              { path: '/', element: <Navigate to="/dashboard" /> },
              { path: 'login', element: <Login/> },
              { path:  'register', element:<Register />},
              { path:  '/forgot-password', element:<ForgotPassword />},
            ],
          },
          { path: '*', element: <NotFoundPage /> },

    ]);
}

