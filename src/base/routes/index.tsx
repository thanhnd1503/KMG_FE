import { useRoutes } from 'react-router-dom';

// project import
import AuthorizedRoutes from './AuthorizedRoutes';
import PublicRoutes from './PublicRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([AuthorizedRoutes, PublicRoutes]);
}
