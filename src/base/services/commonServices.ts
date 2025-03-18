import { axiosGet, axiosPost } from '@base/utils/axios/api';

const commonServices = {
  getBankList: async () => {
    return axiosGet('setting/bank/list');
  },
  getFile: (fileID: string, params: any = {}) => {
    return axiosGet(`/upload/file_get/${fileID}`, {}, params, 'blob');
  },
  getTemp: (tempID: string, params: any = {}) => {
    return axiosGet(`/temp/${tempID}`, params);
  },
  createTemp: (params: any = {}) => {
    return axiosPost(`/temp`, params);
  }
};

export default commonServices;
