import React, { useReducer, useContext } from 'react';
import { FuseAuthorization, FuseLayout, FuseTheme } from '@fuse';
import Provider from 'react-redux/es/components/Provider';
import { Router } from 'react-router-dom';
import jssExtend from 'jss-extend';
import history from '@history';
import { Auth } from './auth';
import store from './store';
import Context from './AppContext';
import routes from './fuse-configs/routesConfig';
import { create } from 'jss';
import {
  StylesProvider,
  jssPreset,
  createGenerateClassName,
} from '@material-ui/styles';
import Reducer from './Reducer';

const jss = create({
  ...jssPreset(),
  plugins: [...jssPreset().plugins, jssExtend()],
  insertionPoint: document.getElementById('jss-insertion-point'),
});

const generateClassName = createGenerateClassName();

const App = () => {
  const initialState = useContext(Context);
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <Context.Provider
      value={{
        routes,
        state,
        dispatch,
      }}
    >
      <StylesProvider jss={jss} generateClassName={generateClassName}>
        <Provider store={store}>
          <Auth>
            <Router history={history}>
              <FuseAuthorization>
                <FuseTheme>
                  <FuseLayout />
                </FuseTheme>
              </FuseAuthorization>
            </Router>
          </Auth>
        </Provider>
      </StylesProvider>
    </Context.Provider>
  );
};

export default App;
