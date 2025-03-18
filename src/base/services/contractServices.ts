import { ISearch } from '@base/types/common';
import { axiosGet, axiosPost } from '@base/utils/axios/api';
import { parseParamsToString } from '@base/utils/helper';
import { AxiosRequestConfig } from 'axios';

// type LoginResponse = {};

const contractServices = {
  getListContract: (params: any = {}) => {
    return axiosGet('contract/list', params, {}, params.export ? 'arraybuffer' : 'json');
  },
  getContract: (id?: number | string, params: any = {}) => {
    return axiosGet(`contract/get/${id}`, params);
  },
  createContract: (params: any = {}) => {
    return axiosPost(`contract/create`, params);
  },
  updateContract: (id: number | string, params: any = {}) => {
    return axiosPost(`contract/update/${id}`, params);
  },
  deleteContract: (ids: string) => {
    return axiosPost(`contract/delete`, { ids: ids });
  },
  getListPaymentOccurrence: (params: any = {}) => {
    return axiosGet('contract/payment_occ/gets', params, {}, params.export ? 'arraybuffer' : 'json');
  },
  getListCollectionById: (id?: number | string, params: any = {}) => {
    return axiosGet(`contract/payment_occ/gets/collections/${id}`, params);
  },
  getListWaitingOccByContractId: (params: any = {}) => {
    return axiosGet(`contract/payment_occ/gets/waiting`, params);
  },
  cancelMember: (params: any = {}) => {
    return axiosPost(`contract/cancel_member`, params);
  },
  getPaymentOccurrence: (id?: number | string, params: any = {}) => {
    return axiosGet(`contract/payment_occ/get/${id}`, params);
  },
  createPaymentOccurrence: (params: any = {}) => {
    return axiosPost(`contract/payment_occ/create`, params);
  },
  updatePaymentOccurrence: (id: number | string, params: any = {}) => {
    return axiosPost(`contract/payment_occ/update/${id}`, params);
  },
  deletePaymentOccurrences: (ids: string) => {
    return axiosPost(`contract/payment_occ/delete`, { ids: ids });
  },
  getListContractUser: (params: any = {}) => {
    return axiosGet(`contract/users`, params);
  },
  uploadAutoTransferAgreement: (body: any = {}, config: AxiosRequestConfig = {}) => {
    return axiosPost(`contract/file_upload/auto_transfer`, body, { 'Content-Type': 'multipart/form-data' }, 'json', config);
  },
  confirmAutoTransferAgreement: (body: any = {}, config: AxiosRequestConfig = {}) => {
    return axiosPost(`contract/confirm/auto_transfer`, body, { 'Content-Type': 'multipart/form-data' }, 'json', config);
  },
  uploadContractAgreement: (body: any = {}, config: AxiosRequestConfig = {}) => {
    return axiosPost(`contract/file_upload/rental`, body, { 'Content-Type': 'multipart/form-data' }, 'json', config);
  },
  confirmContractAgreement: (body: any = {}, config: AxiosRequestConfig = {}) => {
    return axiosPost(`contract/confirm/rental`, body, { 'Content-Type': 'multipart/form-data' }, 'json', config);
  },
  requestWithdrawal: (ids: string) => {
    return axiosPost(`contract/request/withdrawal`, { ids: ids });
  },
  cancelWithdrawal: (ids: string) => {
    return axiosPost(`contract/cancel/withdrawal`, { ids: ids });
  },
  sendAgreementKakao: (body: any) => {
    return axiosPost(`contract/sendAgreementKakao`, body);
  },
  uploadAdditionalAttachments: (body: any = {}, config: AxiosRequestConfig = {}) => {
    return axiosPost(`contract/file_upload/additional`, body, { 'Content-Type': 'multipart/form-data' }, 'json', config);
  }
};

export default contractServices;
