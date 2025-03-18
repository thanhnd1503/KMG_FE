import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import { App } from 'antd';
import { RecoilRoot } from 'recoil';

import MyApp from '@base/components/App';

import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Suspense fallback={<></>}>
    <RecoilRoot>
      <BrowserRouter>
        <App>
          <MyApp />
        </App>
      </BrowserRouter>
    </RecoilRoot>
  </Suspense>
);

reportWebVitals();
