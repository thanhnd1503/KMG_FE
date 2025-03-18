import { ISearch } from '@base/types/common';
import { axiosGet, axiosPost } from '@base/utils/axios/api';
import { parseParamsToString } from '@base/utils/helper';
import { AxiosRequestConfig } from 'axios';

// type LoginResponse = {};

const customerServices = {
  getListCustomer: (params: any = {}) => {
    return axiosGet('customer/list', params, {}, params.export ? 'arraybuffer' : 'json');
  },
  getCustomer: (id: number | string, params: any = {}) => {
    return axiosGet(`customer/get/${id}`, params);
  },
  createCustomer: (params: any = {}) => {
    return axiosPost(`customer/create`, params);
  },
  deleteCustomer: (ids: string) => {
    return axiosPost(`customer/delete`, { ids: ids });
  },
  deletePayment: (ids: string) => {
    return axiosPost(`customer/delete_payment`, { ids: ids });
  },
  updateCustomer: (id: number | string, params: any = {}) => {
    return axiosPost(`customer/update/${id}`, params);
  },
  getPayment: (id: number | string, params: any = {}) => {
    return axiosGet(`customer/payment/${id}`, params);
  },
  getPaymentsByCustIds: (cust_ids: string) => {
    return axiosGet(`customer/payments`, { cust_ids });
  },
  uploadLicense: (body: any, config: AxiosRequestConfig = {}) => {
    return axiosPost(`customer/license_upload`, body, { 'Content-Type': 'multipart/form-data' }, 'json', config);
  }
};

export default customerServices;
