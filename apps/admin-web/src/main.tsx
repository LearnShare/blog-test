import {
  StrictMode,
} from 'react';
import {
  createRoot,
} from 'react-dom/client';
import {
  BrowserRouter,
} from 'react-router';

import AppRoutes from '@/router';

import '@/css/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>,
);
