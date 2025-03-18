import { lazy } from 'react';
import { Navigate } from 'react-router';

import Loadable from '@base/components/Loadable';

import { MENU_DEMO_URL } from '../constants/menu';

const MainContainer = Loadable(lazy(() => import('../containers/MainContainer')));
const ListPage = Loadable(lazy(() => import('../pages/ListPage')));
const ViewPage = Loadable(lazy(() => import('../pages/ViewPage')));
const DevPage = Loadable(lazy(() => import('../pages/DevComponent')));

const Routes = {
  path: MENU_DEMO_URL,
  element: <MainContainer />,
  children: [
    {
      index: true,
      element: <Navigate to={`/${MENU_DEMO_URL}/success/list`} />
    },
    {
      path: ':subMenu/list',
      element: <ListPage />
    },
    {
      path: ':subMenu/view/:id',
      element: <ViewPage />
    },
    {
      path: 'dev',
      element: <DevPage />
    },
    {
      path: ':subMenu/*',
      element: <Navigate to={`/${MENU_DEMO_URL}`} />
    }
  ]
};
export default Routes;
