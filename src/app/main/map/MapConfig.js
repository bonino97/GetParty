import { lazy } from 'react';

export const MapConfig = {
  routes: [
    {
      path: '/map',
      component: lazy(() => import('./Map')),
    },
  ],
};
