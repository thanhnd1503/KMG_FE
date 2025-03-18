import useGet from '@base/hooks/useGet';
import usePost from '@base/hooks/usePost';
import { Headers } from '@base/utils/axios/api';
import { keyStringify } from '@base/utils/helper/schema';
import { queryKeys } from '@demo/configs/queryKeys';

export const useDemoList = (params: any, opts?: any) => {
  return useGet<any>([queryKeys.getDemoList, keyStringify(params)], `purchase/list`, params, {
    keepPreviousData: true,
    ...opts
  });
};
