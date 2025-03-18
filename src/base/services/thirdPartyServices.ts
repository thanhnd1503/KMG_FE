import { axiosGet, axiosPost } from '@base/utils/axios/api';
import { parseParamsToString } from '@base/utils/helper';

// type LoginResponse = {};
const ThirdPartyServices = {
  searchAutoBeginsCar: (params: any) => {
    console.log(params)
    return axiosPost('third_party_api/autobegins/search', params);
  }
};

export default ThirdPartyServices;
