import { ReactNode, useCallback, useEffect } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';

// project import
import { topMenuData } from '@base/_mocks/menu';
import useAuth from '@base/hooks/useAuth';
import { useTabs } from '@base/hooks/useTabs';

// types

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }: any) => {
  const { isLoggedIn, destinationUrl } = useAuth();
  const { activeTab } = useTabs();
  const navigate = useNavigate();
  const isHome = useMatch('/');

  const handleChangeRoute = useCallback(() => {
    if (destinationUrl && destinationUrl !== '/login') {
      navigate(destinationUrl, { replace: true });
    } else if (isHome) {
      if (activeTab) {
        navigate(`${activeTab?.url}`, { replace: true });
      } else {
        navigate(topMenuData[0].url, { replace: true });
      }
    }
  }, [isHome, destinationUrl, activeTab]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(`/login`, { replace: true });
    } else {
      handleChangeRoute();
    }
  }, [isLoggedIn, destinationUrl]);

  return isLoggedIn ? children : null;
};

export default AuthGuard;
