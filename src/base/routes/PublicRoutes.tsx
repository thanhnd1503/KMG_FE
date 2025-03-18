import { lazy } from 'react';

// project import
import Loadable from '@base/components/Loadable';
import CommonLayout from '@base/layouts/CommonLayout/index';
import GuestGuard from '@base/utils/route-guard/GuestGuard';
// render - login
const AuthLogin = Loadable(lazy(() => import('base/pages/auth/Login')));
const AuthRegister = Loadable(lazy(() => import('base/pages/auth/Register')));
// const DiagnosticVendor = Loadable(lazy(() => import('base/pages/vendor/DiagnosticVendor')));
// const Individual = Loadable(lazy(() => import('base/pages/customer/Individual')));
const ExceptionPage = Loadable(lazy(() => import('base/pages/Exception')));

// ==============================|| AUTH ROUTING ||============================== //

const PublicRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <GuestGuard>
          <CommonLayout />
        </GuestGuard>
      ),
      children: [
        {
          path: 'login',
          element: <AuthLogin />
        },
        {
          path: 'register',
          element: <AuthRegister />
        },
        // {
        //   path: 'diagnostic_vendor/:id',
        //   element: <DiagnosticVendor />
        // },
        // {
        //   path: 'customer_receive/individual/:id',
        //   element: <Individual />
        // },
        {
          path: '*',
          element: <ExceptionPage status="404" />
        }
      ]
    }
  ]
};

export default PublicRoutes;
