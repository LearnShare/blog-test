import React from 'react';

import {
  AuthLayout,
  DashboardLayout,
} from '@/components/layouts';
import {
  PageHome,
  PageSignIn,
  PageAccount,
  PagePost,
  PageTicketPost,

  Page404,
} from '@/pages';

export interface RouteItem {
  name: string;
  layout?: React.ReactNode;
  path?: string;
  element?: React.ReactNode;
  children?: RouteItem[];
}

const routes: RouteItem[] = [
  {
    name: 'sign-in',
    layout: <AuthLayout />,
    path: '/sign-in',
    element: <PageSignIn />,
  },
  {
    name: 'dashboard',
    layout: <DashboardLayout />,
    children: [
      {
        name: 'home',
        path: '/',
        element: <PageHome />,
      },
      {
        name: 'account',
        path: '/account',
        element: <PageAccount />,
      },
      {
        name: 'post',
        path: '/post',
        element: <PagePost />,
      },
      {
        name: 'ticket-post',
        path: '/ticket/post',
        element: <PageTicketPost />,
      },
    ],
  },
  {
    name: '404',
    path: '/*',
    element: <Page404 />,
  },
];

export default routes;
