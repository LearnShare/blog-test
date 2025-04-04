import React from 'react';

import {
  AuthLayout,
  DashboardLayout,
} from '@/components/layouts';
import {
  PageHome,
  PageSignIn,
  Page404,
} from '@/pages';

export interface RouteItem {
  name: string;
  layout?: React.ReactElement;
  path: string;
  element: React.ReactElement;
}

export interface RouteGroup {
  name: string;
  layout?: React.ReactElement;
  path?: string;
  children: RouteItem[];
}

export type RouteConfig = RouteItem | RouteGroup;

const routes: RouteConfig[] = [
  {
    name: 'sign-in',
    layout: AuthLayout,
    path: '/sign-in',
    element: PageSignIn,
  },
  {
    name: 'dashboard',
    layout: DashboardLayout,
    children: [
      {
        name: 'home',
        path: '/',
        element: PageHome,
      },
    ],
  },
  {
    name: '404',
    path: '/*',
    element: Page404,
  },
];

export default routes;
