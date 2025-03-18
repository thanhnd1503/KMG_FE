import { ISearch } from '@base/types/common';
import { axiosGet, axiosPost } from '@base/utils/axios/api';
import { parseParamsToString } from '@base/utils/helper';

// type LoginResponse = {};

const managerAccountServices = {
  getList: (params: any = {}) => {
    return axiosGet('manager_account/list', params, {}, params.export ? 'arraybuffer' : 'json');
  },
  getItem: (id: number | string, params: any = {}) => {
    return axiosGet(`manager_account/get/${id}`, params);
  },
  createItem: (params: any = {}) => {
    return axiosPost(`manager_account/create`, params);
  },
  updateItem: (id: string, params: any = {}) => {
    return axiosPost(`manager_account/update/${id}`, params);
  },
  deleteAccount: (ids: string) => {
    return axiosPost(`manager_account/delete`, { ids: ids });
  },
  checkUsernameExisted: (username: string) => {
    return axiosPost(`manager_account/check_username_existed`, { username: username });
  }
};

export default managerAccountServices;
