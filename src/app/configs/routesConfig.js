import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import ExampleConfig from 'app/main/example/ExampleConfig';
import { MapConfig } from 'app/main/map/MapConfig';
import { PartiesConfig } from 'app/main/parties/PartiesConfig';
import { LoginConfig } from 'app/main/auth/login/LoginConfig';
import { RegisterConfig } from 'app/main/auth/register/RegisterConfig';
import { ForgotPasswordConfig } from 'app/main/auth/forgot-password/ForgotPasswordConfig';
import { ResetPasswordConfig } from 'app/main/auth/reset-password/ResetPasswordConfig';

const routeConfigs = [
  ExampleConfig,
  MapConfig,
  LoginConfig,
  RegisterConfig,
  ForgotPasswordConfig,
  ResetPasswordConfig,
  PartiesConfig,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
  {
    path: '/',
    component: () => <Redirect to='/map' />,
  },
];

export default routes;
