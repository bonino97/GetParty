import React from 'react';
import { Redirect } from 'react-router-dom';
import { FuseUtils } from '@fuse';
import { ExampleConfig } from 'app/main/example/ExampleConfig';
import { MapConfig } from 'app/main/map/MapConfig';

const routeConfigs = [ExampleConfig, MapConfig];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
  {
    path: '/',
    component: () => <Redirect to='/map' />,
  },
];

export default routes;
