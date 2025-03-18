import { ISearch } from '@base/types/common';
import { axiosGet, axiosPost } from '@base/utils/axios/api';
import { parseParamsToString } from '@base/utils/helper';
import { AxiosRequestConfig } from 'axios';

// type LoginResponse = {};

const productServices = {
  getProducts: (params: any = {}) => {
    return axiosGet(`car/list`, params, {}, params.export ? 'arraybuffer' : 'json');
  },
  getProduct: (id: number | string, params: any = {}) => {
    return axiosGet(`car/get/${id}`, params);
  },
  createProduct: (params: any = {}) => {
    return axiosPost(`car/create`, params);
  },
  updateProduct: (id: number | string, params: any = {}) => {
    return axiosPost(`car/update/${id}`, params);
  },
  getListMaintenanceById: (id: Number, params: ISearch) => {
    return axiosGet(`car/maintenance/list/${id}`, params);
  },
  createItemMaintenance: (params: any = {}) => {
    return axiosPost(`car/maintenance/create`, params);
  },
  updateItemMaintenance: (params: any = {}) => {
    return axiosPost(`car/maintenance/update`, params);
  },
  getListCostAnalysisById: (id: Number, params: ISearch) => {
    return axiosGet(`car/cost_analysis/list/${id}`, params);
  },
  createItemCostAnalysis: (params: any = {}) => {
    return axiosPost(`car/cost_analysis/create`, params);
  },
  updateItemCostAnalysis: (params: any = {}) => {
    return axiosPost(`car/cost_analysis/update`, params);
  },
  getGroupTree: (params: any = {}) => {
    return axiosGet(`car/group/tree`, params);
  },
  getGroupDepthList: (params: any = {}) => {
    return axiosGet(`car/group/list`, params);
  },
  getListAccidentById: (id: number | string, params: any = {}) => {
    return axiosGet(`car/accident/list/${id}`, params);
  },
  createAccidentById: (id: number | string, params: any = {}) => {
    return axiosPost(`car/accident/create/${id}`, params);
  },
  updateAccidentById: (id: number | string, params: any = {}) => {
    return axiosPost(`car/accident/update/${id}`, params);
  },
  createImgProductFile: (body: any, config: AxiosRequestConfig = {}) => {
    return axiosPost(`/car/file_upload`, body, { 'Content-Type': 'multipart/form-data' }, 'json', config);
  },
  createImgAccidentFile: (body: any, config: AxiosRequestConfig = {}) => {
    return axiosPost(`/car/accident/file_upload`, body, { 'Content-Type': 'multipart/form-data' }, 'json', config);
  },
  createImgMaintenanceFile: (body: any, config: AxiosRequestConfig = {}) => {
    return axiosPost(`/car/maintenance/file_upload`, body, { 'Content-Type': 'multipart/form-data' }, 'json', config);
  },
  deleteProduct: (ids: string) => {
    return axiosPost(`car/delete`, { ids: ids });
  },
  createImgCostAnalysisFile: (body: any, config: AxiosRequestConfig = {}) => {
    return axiosPost(`/car/cost_analysis/file_upload`, body, { 'Content-Type': 'multipart/form-data' }, 'json', config);
  }
  // getFile: ( fileID: string ,params: any = {}) => {
  //   return axiosGet(`/car/file_get/${fileID}`, {}, params, 'blob' );
  // },
};

export default productServices;
