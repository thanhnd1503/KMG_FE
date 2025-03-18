import { QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

const MAX_RETRIES = 3;
const HTTP_STATUS_TO_NOT_RETRY: number[] = [400, 401, 403, 404];

function generateQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // onError: queryErrorHandler,
        staleTime: 600000, // 10 minutes
        cacheTime: 900000, // default cacheTime is 5 minutes; doesn't make sense for staleTime to exceed cacheTime
        // refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        suspense: false,
        useErrorBoundary: false, // false - handle to not display a blank page when there is an error
        retry: (failureCount, error) => {
          // Shouldn't retry with status: 400, 401, 403, 404
          if (failureCount > MAX_RETRIES) {
            return false;
          }
          if (isAxiosError(error) && HTTP_STATUS_TO_NOT_RETRY.includes(error.response?.status ?? 0)) {
            console.log(`Aborting retry due to ${error.response?.status} status`);
            return false;
          }
          return true;
        }
      },
      mutations: {
        useErrorBoundary: true
      }
    }
  });
}

export const queryClient = generateQueryClient();
