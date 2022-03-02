import { lazy } from 'react';

export const ProfilePageConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/profile',
      component: lazy(() => import('./ProfilePage')),
    },
  ],
};
