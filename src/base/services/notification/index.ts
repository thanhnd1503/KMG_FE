import { ISearch } from '@base/types/common';
import { axiosGet, axiosPost } from '@base/utils/axios/api';
import { parseParamsToString } from '@base/utils/helper';

// type LoginResponse = {};

const notificationServices = {
  getList: (params: any = {}) => {
    return axiosGet('setting/notification/list', params, {}, params.export ? 'arraybuffer' : 'json');
  },
  getItem: (id: number | string, params: any = {}) => {
    return axiosGet(`setting/notification/get/${id}`, params);
  },
  createItem: (params: any = {}) => {
    return axiosPost(`setting/notification/create`, params);
  },
  updateItem: (id: string, params: any = {}) => {
    return axiosPost(`setting/notification/update/${id}`, params);
  },
  deleteNotification: (ids: string) => {
    return axiosPost(`setting/notification/delete`, { ids: ids });
  },
  getTemplateTitles: (params: any = {}) => {
    return axiosGet('setting/notification/titles', params);
  },
  getContentTemplateById: (params: any = {}) => {
    return axiosGet(`setting/notification/content`, params);
  }
};

export default notificationServices;
