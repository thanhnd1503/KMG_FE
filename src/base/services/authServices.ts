import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { API_URL } from '@base/configs';
import { LoginData } from '@base/types/auth';
import { axiosApi, axiosGet, axiosPost } from '@base/utils/axios/api';

// type LoginResponse = {};
const authServices = {
  login: async (params: LoginData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, params);
      return res?.data;
    } catch (error) {
      return false;
    }
  },
  logout: async (token: string) => {
    let config: AxiosRequestConfig<any> = {
      method: 'POST',
      url: '/auth/logout',
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    try {
      // const res = await axios.post(`${API_URL}/auth/logout`);
      // return res?.data;
      const response: AxiosResponse = await axiosApi(config);
      return response?.data;
    } catch (error) {
      return false;
    }
  },
  update: async (params: any) => {
    try {
      const res = await axiosPost(`/user/change_info`, params);
      return res;
    } catch (error) {
      return false;
    }
  },
  checkRefreshToken: async (headers: any) => {
    try {
      const res = await axios.get(`${API_URL}/auth/checkRefreshToken`, { headers: headers });
      return res?.data;
    } catch (error) {
      return false;
    }
  },
  refreshToken: async (params: any) => {
    try {
      const res = await axios.post(`${API_URL}/auth/refresh-token`, params);
      return res?.data;
    } catch (error) {
      return false;
    }
  },
  getAppConfig: async (params: any) => {
    try {
      const res = await axios.get(`${API_URL}/config`, params);
      return res?.data;
    } catch (error) {
      return false;
    }
  }
};

export default authServices;
