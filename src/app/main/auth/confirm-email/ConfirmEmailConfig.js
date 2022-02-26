import ConfirmEmail from './ConfirmEmail';
import { authRoles } from 'app/auth';

export const ConfirmEmailConfig = {
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
      path: '/confirm-email/:email',
      component: ConfirmEmail,
    },
  ],
};
