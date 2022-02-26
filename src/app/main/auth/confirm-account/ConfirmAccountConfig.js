import ConfirmAccount from './ConfirmAccount';
import { authRoles } from 'app/auth';

export const ConfirmAccountConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: '/confirm-account/:token',
      component: ConfirmAccount,
    },
  ],
};
