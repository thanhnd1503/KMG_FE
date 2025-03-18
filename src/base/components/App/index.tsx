import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import GlobalStyles from '@base/components/GlobalStyles/GlobalStyles';
import { queryClient } from '@base/configs/queryClient';
import { AuthProvider } from '@base/contexts/AuthContext';
import Routes from '@base/routes';
import { useAxiosInterceptors } from '@base/utils/axios/api';

import './typography.style.css';

const App = () => {
  useAxiosInterceptors();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GlobalStyles>
          <Routes />
          <ReactQueryDevtools initialIsOpen={false} />
        </GlobalStyles>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
