import React, { useContext, useReducer } from 'react';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import FuseAuthorization from '@fuse/core/FuseAuthorization';

import { SnackbarProvider } from 'notistack';
import withAppProviders from './withAppProviders';

import history from '@history';
import { Router } from 'react-router-dom';
import { Auth } from './auth';
import Reducer from 'app/Reducer';
import Context from 'app/AppContext';
import routes from 'app/configs/routesConfig';

const App = () => {
  const initialState = useContext(Context);
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch, routes }}>
      <Auth>
        <Router history={history}>
          <FuseAuthorization>
            <FuseTheme>
              <SnackbarProvider
                maxSnack={5}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                classes={{
                  containerRoot:
                    'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99',
                }}
              >
                <FuseLayout />
              </SnackbarProvider>
            </FuseTheme>
          </FuseAuthorization>
        </Router>
      </Auth>
    </Context.Provider>
  );
};
export default withAppProviders(App)();
