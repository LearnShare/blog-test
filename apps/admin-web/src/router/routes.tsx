import React, {
  useEffect,
} from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router';

import config, {
  type RouteConfig,
} from './config';
import Store from '@/lib/store';

function renderList(list: RouteConfig[]) {
  return list.map((item: RouteConfig) => {
    // group with children
    if (item.children) {
      return (
        <Route
            path={ item.path }
            element={ item.layout ? <item.layout /> : '' }>
          { renderList(item.children) }
        </Route>
      );
    }

    const route = (
      <Route
          index={ item.path === '/' }
          path={ item.path !== '/' ? item.path : null }
          element={ <item.element /> } />
    );

    if (item.layout) { // item with layout
      return (
        <Route
            element={ <item.layout /> }>
          { route }
        </Route>
      );
    }

    // item without layout
    return route;
  })
}

const publicPaths = [
  '/sign-in',
];

function isPublic(path: string) {
  for (const p of publicPaths) {
    if (path.startsWith(p)) {
      return;
    }
  }

  return false;
}

export default function AppRoutes() {
  const token = Store.getToken();

  const location = useLocation();
  const navigate = useNavigate();

  const {
    pathname,
    search,
  } = location;

  // auth guard
  useEffect(() => {
    if (!token
        && !isPublic(pathname)
        && !pathname.startsWith('/sign-in')) {
      const redirect = encodeURI(`${pathname}${search}`);

      navigate(`/sign-in?redirect=${redirect}`);
    }
  }, [
    token,
    pathname,
    navigate,
    search,
  ]);

  return (
    <Routes>
      { renderList(config) }
    </Routes>
  );
}
