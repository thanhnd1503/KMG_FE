import React, { createContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';

import { setCookie, getCookie, removeCookie } from '@base/hooks/useCookies';
import useUserActions from '@base/hooks/useUserActions';
import { authAtom } from '@base/store/atoms/auth';
import { AuthContextType, DecodeToken, UserInfo } from '@base/types/auth';

// ==============================|| Vora Auth CONTEXT & PROVIDER ||============================== //

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactElement }) => {
  const [auth, setAuth] = useRecoilState(authAtom);
  const userActions = useUserActions();
  const userCookie = getCookie('user');

  const location = useLocation();
  useEffect(() => {
    const checkIsLoggedIn = () => {
      if (userCookie?.accessToken) {
        userActions.loginSuccess(userCookie);

        // setAuth((prev) => ({
        //   ...prev,
        //   isLoggedIn: true,
        //   user: userCookie as UserInfo
        // }));
      } else {
        setAuth({
          isLoggedIn: false,
          user: null,
          destinationUrl: location.pathname !== '/' ? location.pathname : null
        });
      }
    };
    checkIsLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        ...userActions
      }}
    >
      {userActions.loadingApp ? <div>...</div> : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
