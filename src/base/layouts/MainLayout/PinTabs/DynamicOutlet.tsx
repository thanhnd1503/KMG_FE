import { memo, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import Loader from '@base/components/Loader';

const moduleRoutes: any[] = [];
const requireAppRoutes = require.context('/src', true, /Route.tsx$/);

requireAppRoutes.keys().forEach((path: any) => {
  if (process.env.REACT_APP_ENV === 'prod' && typeof path === 'string' && path?.includes('demo')) return;
  const route = requireAppRoutes(path).default;
  moduleRoutes.push(route);
});

interface DynamicOutletProps {
  dynamicPath: string;
  tabKey: string;
}

const DynamicOutlet: React.FC<DynamicOutletProps> = memo((props) => {
  const { dynamicPath } = props;
  const element = useRoutes(moduleRoutes, {
    pathname: dynamicPath
  });

  return <Suspense fallback={<Loader />}>{element}</Suspense>;
});

export default DynamicOutlet;
