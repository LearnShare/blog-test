import React from 'react';
import {
  Routes,
  Route,
} from 'react-router';

import config, {
  type RouteConfig,
} from './config';

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

export default function AppRoutes() {
  return (
    <Routes>
      { renderList(config) }
    </Routes>
  );
}
