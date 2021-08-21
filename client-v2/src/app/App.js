import React from 'react';
import { FuseLayout, FuseTheme } from '@fuse';
import Provider from 'react-redux/es/components/Provider';
import jssExtend from 'jss-extend';
import store from './store';
import { create } from 'jss';
import {
  StylesProvider,
  jssPreset,
  createGenerateClassName,
} from '@material-ui/styles';

const jss = create({
  ...jssPreset(),
  plugins: [...jssPreset().plugins, jssExtend()],
  insertionPoint: document.getElementById('jss-insertion-point'),
});

const generateClassName = createGenerateClassName();

const App = () => {
  return (
    <StylesProvider jss={jss} generateClassName={generateClassName}>
      <Provider store={store}>
        <FuseTheme>
          <FuseLayout />
        </FuseTheme>
      </Provider>
    </StylesProvider>
  );
};

export default App;
