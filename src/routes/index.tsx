import type { FC } from 'react';
import type { RouteObject } from 'react-router';

import { lazy } from 'react';
import { Navigate } from 'react-router';
import { useRoutes } from 'react-router-dom';

// import Dashboard from '@/pages/dashboard';
import LayoutPage from '@/pages/layout';
import LoginPage from '@/pages/login';

import WrapperRouteComponent from './config';
// not Found
const NotFound = lazy(() => import('@/pages/404'));

// Product Management

const ListOfEmployee = lazy(() => import('@/pages/TeamManagement/ListOfEmployee/ListOfEmployee'));

const CustomerGroup = lazy(() => import('@/pages/CustomerManagement/CustomerGroup/CustomerGroup'));
const ListCustomers = lazy(() => import('@/pages/CustomerManagement/ListCustomers/ListCustomers'));
const ListRequests = lazy(() => import('@/pages/CustomerManagement/ListRequests/ListRequests'));

const InterestRate = lazy(() => import('@/pages/Contract/active/InterestRate'));
const BlockContract = lazy(() => import('@/pages/Contract/block/BlockContract'));

// Quản lý kinh doanh

const CommissionStatistics = lazy(
  () => import('@/pages/CommissionManagement/CommissionStatistics/CommissionStatistics'),
);
const MembershipCommission = lazy(() => import('@/pages/CommissionManagement/TemporaryCommission/TemporaryCommission'));
const TemporaryCommission = lazy(
  () => import('@/pages/CommissionManagement/MembershipCommission/MembershipCommission'),
);

const routeList: RouteObject[] = [
  {
    path: '/login',
    element: <WrapperRouteComponent element={<LoginPage />} titleId="title.login" />,
  },
  {
    path: '/',
    element: <WrapperRouteComponent element={<LayoutPage />} auth={true} titleId="" />,
    children: [
      {
        path: '',
        element: <Navigate to="/team-managament/list-of-employee" />,
      },
      // {
      //   path: 'dashboard',
      //   element: <WrapperRouteComponent element={<Dashboard />} titleId="title.dashboard" />,
      // },
      // Quản lý đội nhóm
      {
        path: '/team-managament/list-of-employee',
        element: <WrapperRouteComponent element={<ListOfEmployee />} titleId="Danh sách nhân viên" />,
      },
      // Thống kê hoa hồng
      {
        path: '/commission-management/commission-statistics',
        element: <WrapperRouteComponent element={<CommissionStatistics />} titleId="Tổng hoa hồng" />,
      },
      {
        path: '/commission-management/temporary-commission',
        element: <WrapperRouteComponent element={<MembershipCommission />} titleId="Hoa hồng tạm tính" />,
      },
      {
        path: '/commission-management/membership-commission',
        element: <WrapperRouteComponent element={<TemporaryCommission />} titleId="Hoa hồng thành viên" />,
      },
      {
        path: 'customer-management/list-customer',
        element: <WrapperRouteComponent element={<ListCustomers />} titleId="Danh sách khách hàng" />,
      },
      {
        path: 'customer-management/list-request',
        element: <WrapperRouteComponent element={<ListRequests />} titleId="Danh sách yêu cầu" />,
      },
      //
      {
        path: '/contract/active',
        element: <WrapperRouteComponent element={<InterestRate />} titleId="Hợp đồng còn hiệu lực" />,
      },
      {
        path: '/contract/block',
        element: <WrapperRouteComponent element={<BlockContract />} titleId="Hợp đồng đã thanh lý" />,
      },
      {
        path: '*',
        element: <WrapperRouteComponent element={<NotFound />} titleId="title.notFount" />,
      },
    ],
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);

  return element;
};

export default RenderRouter;
