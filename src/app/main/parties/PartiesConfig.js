import { lazy } from 'react';
import { Redirect } from 'react-router-dom';

export const PartiesConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: '/parties/:slug',
      component: lazy(() => import('./party/Party')),
    },
    {
      path: '/parties',
      component: lazy(() => import('./parties/Parties')),
    },
  ],
};
