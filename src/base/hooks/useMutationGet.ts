import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { isArray } from 'lodash';

import { axiosGet, CustomAxiosConfigType } from '@base/utils/axios/api';

export function useMutationGet<T, E extends {} = {}, V extends {} = {}>(params: {
  queryKey: any[];
  endPoint: string;
  options?: UseMutationOptions<T, E, V>;
  getEndPoint?: (endPoint: string, payload: V) => string; //
  getPayload?: (endPoint: string, payload: V) => any; //
  header?: any;
  responseType?: string;
  customConfig?: any;
}) {
  const { queryKey, endPoint, options, getEndPoint, getPayload, header, responseType, customConfig } = params;
  const key = isArray(queryKey) ? queryKey[0] : queryKey;
  const response = useMutation<T, E, V>(
    [key],
    (payload: V) => {
      return axiosGet<T>(
        getEndPoint ? getEndPoint(endPoint, payload) : endPoint,
        getPayload ? getPayload(endPoint, payload) : payload,
        header,
        responseType,
        customConfig
      );
    },
    options
  );

  return response;
}

export default useMutationGet;
