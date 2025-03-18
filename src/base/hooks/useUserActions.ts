import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';

import authServices from '@base/services/authServices';
import { authAtom } from '@base/store/atoms/auth';
import { AuthProps, LoginData, UserInfo } from '@base/types/auth';

import { getCookie, setCookie, removeCookie, COOKIE_EXPIRE_TIME } from './useCookies';
import useToast from './useToast';

const useUserActions = () => {
  const navigate = useNavigate();
  const [loadingApp, setLoadingApp] = useState(false);
  const [authData, setAuthAtom] = useRecoilState(authAtom);
  const showToast = useToast();
  const [cookies] = useState(getCookie('user'));
  const cookiesRef = useRef(cookies);

  useEffect(() => {
    cookiesRef.current = cookies;
  }, [cookies]);

  const login = (params: LoginData) => {
    return authServices.login(params as LoginData);
  };

  const logout = async (token: string) => {
    const res: any = await authServices.logout(token);
    removeCookie('user');
    setAuthAtom({
      isLoggedIn: false,
      user: null
    });
    if (res?.success) {
    }
  };

  const loginSuccess = async (data: any = null) => {
    try {
      if (data) {
        setCookie(
          'user',
          {
            ...cookiesRef.current,
            user: data?.user,
            accessToken: data?.token ?? data?.accessToken,
            refreshToken: data?.refreshToken
          },
          {
            expires: new Date(Date.now() + COOKIE_EXPIRE_TIME * 86400 * 1000)
          }
        );
        setAuthAtom((prev) => ({
          ...prev,
          isLoggedIn: true,
          user: { ...data?.user, accessToken: data?.token ?? data?.accessToken, refreshToken: data?.refreshToken }
        }));
        setLoadingApp(false);
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  const setNewAccessToken = async (val: string) => {
    setCookie(
      'user',
      {
        ...cookiesRef.current,
        accessToken: val
      },
      {
        expires: new Date(Date.now() + COOKIE_EXPIRE_TIME * 86400 * 1000)
      }
    );
    setAuthAtom((prev) => {
      return {
        ...prev,
        isLoggedIn: true,
        user: { ...prev.user, accessToken: val }
      };
    });
  };

  const checkRefreshToken = async (refreshToken: string) => {
    try {
      if (refreshToken) {
        const res: any = await authServices.refreshToken({ refreshToken });
        if (res) {
          setNewAccessToken(res?.data?.token);
        }
        return res;
      }
    } catch (error) {
      return false;
    }
  };

  const updateProfile = async (data: UserInfo) => {
    const res = await authServices.update({ ...data, id: authData.user?.id });
    if (res?.success) {
      showToast({ content: 'Success updating user information', type: 'success' });
      setAuthAtom((prev) => ({
        ...prev,
        user: { ...prev?.user, ...data }
      }));
      setCookie('user', { ...authData?.user, ...data }, { path: '/', expires: new Date(Date.now() + COOKIE_EXPIRE_TIME * 86400 * 1000) });
    }
  };
  const register = () => {};
  const resetPassword = (email: string) => new Promise<void>((resolve, reject) => {});
  return {
    login,
    logout,
    register,
    resetPassword,
    updateProfile,
    loadingApp,
    loginSuccess,
    checkRefreshToken,
    setNewAccessToken
  };
};

export default useUserActions;
