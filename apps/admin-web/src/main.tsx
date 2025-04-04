import {
  StrictMode,
} from 'react';
import {
  createRoot,
} from 'react-dom/client';
import {
  BrowserRouter,
} from 'react-router';

import App from './app';
import AppRoutes from '@/router';

import '@/css/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes>
        <App />
      </AppRoutes>
    </BrowserRouter>
  </StrictMode>,
);
