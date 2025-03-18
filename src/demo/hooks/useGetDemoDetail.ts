import { UseQueryOptions } from '@tanstack/react-query';

import useGet from '@base/hooks/useGet';
import { keyStringify } from '@base/utils/helper/schema';
import { queryKeys } from '@demo/configs/queryKeys';

export const useGetDemoDetail = (params: any, submenu?: string, opts?: UseQueryOptions<any>) => {
  let nParams = { ...params };
  const id = params?.id;
  delete nParams?.id;
  return useGet<any>([[queryKeys.getDemoDetail, submenu ?? '', id].join('_'), keyStringify(params)], `purchase/view/${id}`, nParams, opts);
};
