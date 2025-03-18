import { ISearch } from '@base/types/common';
import { axiosGet, axiosPost } from '@base/utils/axios/api';
import { parseParamsToString } from '@base/utils/helper';

// type LoginResponse = {};

const kakaoServices = {
  getList: (params: any = {}) => {
    return axiosGet('kakao/list', params, {}, params.export ? 'arraybuffer' : 'json');
  },
  getItem: (id: number | string, params: any = {}) => {
    return axiosGet(`kakao/get/${id}`, params);
  },
  sendKakao: (params: any = {}) => {
    return axiosPost(`kakao/send_kakao`, params);
  },
  updateItem: (id: string, params: any = {}) => {
    return axiosPost(`kakao/update/${id}`, params);
  },
  deleteKakaoLog: (ids: string) => {
    return axiosPost(`kakao/delete`, {ids: ids});
  },
  cancelSending: (ids: any[]) => {
    return axiosPost(`kakao/cancel_sending`, { ids });
  }
};

export default kakaoServices;
