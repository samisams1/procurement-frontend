import * as React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import LogoOnlyLayout from './layoutes/LogoOnlyLayout';
import ForgotPassword from './pages/account/ForgotPassword';
import Dashboard from './pages/dashboard';
import { RequestHistory } from './pages/Request/RequestHistory';
import ProtectedRoute from './auth/ProtectedRoute';
import { Category } from './pages/category/Category';
import Setting from './pages/setting/Setting';
//import { Profile } from './pages/profile/Profile';
import Login from './pages/login/Login';
import NotFoundPage from './pages/NotFoundPage';
import DashboardLayout from './layoutes/DashboardLayout';
import { User } from './pages/User';
import Purchase from './pages/purchase/NewRequisition';
import Invoice from './pages/invoice';
//import PurchaseRequestList from './pages/purchase/purchaseRequestList';
import PurchaseRequestDetail from './pages/purchase/purchaseRequestDetail';
import QuotationDetail from './pages/Quotation/QuotationDetail';
import { Profile } from './pages/profile/Profile';
import Register from './pages/account/Register';
import PurchaseRequest from './pages/purchase/purchaseRequest';
import Order from './pages/order';
import NotificationDetail from './pages/notification';
import ManageRequisition from './pages/purchase/manageRequisition';
import Rfq from './pages/Quotation/rfq';
import ManageRfq from './pages/Quotation/manageRfq';
import OrderDetail from './components/pageComponents/order/customer/orderDetail';
import Detail from './components/pageComponents/Requisition/detail';
import Payment from './pages/payment';
import PaymentConfirmation from './components/pageComponents/payment/PaymentConfirmation';
import Result from './components/pageComponents/search/result';
import VerifyUser from './pages/User/verify';
import Report from './pages/report/Report';
import AccountCreation from './pages/User/accountCreation';
import ResetPasswordForm from './pages/User/reset-password';
import SubOrderDetail from './components/pageComponents/order/OrderDetail';
import SideMenu from './components/pageComponents/purchase/SideMenu';
import PaymentReports from './components/pageComponents/purchase/report';
import Shipping from './pages/shipping';
import CreateShipping from './pages/shipping/create';
import Request from './pages/Request';
import MakePaymentComponent from './components/pageComponents/payment/makePaymentComponent';
import RoleSelection from './pages/User/roleSelection';
import CategoryPage from './pages/category';
import Supplier from './pages/supplier';
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
              { path: '/newRequest', element: <ProtectedRoute  element={<Purchase />} /> },
              { path: '/invoices', element: <ProtectedRoute  element={<Invoice />} /> },

              { path: '/purchaseRequests', element: <ProtectedRoute  element={<PurchaseRequest />} /> },
              { path:'/purchaseRequest/:id', element: <ProtectedRoute  element={<Detail />} /> },
              
           //   { path: '/verify', element: <ProtectedRoute  element={<VerifyUser />} /> },
 
              { path: '/requisitions', element: <ProtectedRoute  element={<ManageRequisition />} /> },
              { path:'/purchaseRequestDetail/:id', element: <ProtectedRoute  element={<PurchaseRequestDetail />} /> },
              { path:'/rfq', element: <ProtectedRoute  element={<Rfq />} /> },

              { path:'/manageRfq/:id', element: <ProtectedRoute  element={<ManageRfq />} /> },
              { path:'/quotationDetail/:id', element: <ProtectedRoute  element={<QuotationDetail />} /> },
              { path:'/notificationDetail/:id', element: <ProtectedRoute  element={<NotificationDetail />} /> },
               
              { path:'/orderDetail/:id', element: <ProtectedRoute  element={<OrderDetail />} /> },
              { path:'/subOrderDetail/:id', element: <ProtectedRoute  element={<SubOrderDetail />} /> },
               
              { path: '/invoice', element: <ProtectedRoute  element={<Invoice />} /> },
              { path: '/paymentConfirmation/:id', element: <ProtectedRoute  element={<PaymentConfirmation />} /> },
              { path: '/result', element: <ProtectedRoute  element={<Result />} /> },

              { path: '/payment/:id', element: <ProtectedRoute  element={<Payment />} /> },
              { path: '/sidemeu', element: <ProtectedRoute  element={<SideMenu />} /> },
              { path: '/paymentReports', element: <ProtectedRoute  element={<PaymentReports />} /> },
              { path: '/makePayment', element: <ProtectedRoute  element={<MakePaymentComponent />} /> },


              { path: '/shipping', element: <ProtectedRoute  element={<Shipping />} /> },
              { path: '/create-shipping', element: <ProtectedRoute  element={<CreateShipping />} /> },

              { path: '/category', element: <ProtectedRoute  element={<CategoryPage />} /> },

              { path: '/supplier', element: <ProtectedRoute  element={<Supplier />} /> },
              
            ],
          },
          {
            path: '/',
            element: <LogoOnlyLayout />,
            children: [
              { path: '/', element: <Navigate to="/dashboard" /> },
              { path: 'login', element: <Login/> },
              { path:  'register', element:<Register />},
              { path:  'roleselection', element:<RoleSelection />},
              { path:  '/forgot-password', element:<ForgotPassword />},
              { path:  '/verify', element:<VerifyUser />},
              { path:  '/acountCreated/:email', element:<AccountCreation />},
              { path:  '/reset-password', element:<ResetPasswordForm />},
            ],
          },
          { path: '*', element: <NotFoundPage /> },

    ]);
}

