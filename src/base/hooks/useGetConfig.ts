import { UseQueryOptions } from '@tanstack/react-query';

import useGet from '@base/hooks/useGet';

export const useGetConfig = (opts?: UseQueryOptions) => {
  return useGet<any>(
    ['get_app_config'],
    `config`,
    {},
    {
      keepPreviousData: true,
      staleTime: 0,
      cacheTime: 0,
      ...opts
    }
  );
};
