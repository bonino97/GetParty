import {
  createGenerateClassName,
  jssPreset,
  StylesProvider,
} from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { create } from 'jss';
import jssExtend from 'jss-plugin-extend';
import rtl from 'jss-rtl';
import Provider from 'react-redux/es/components/Provider';
import DateFnsUtils from '@date-io/date-fns';
import Context from './AppContext';
import store from './store';

const jss = create({
  ...jssPreset(),
  plugins: [...jssPreset().plugins, jssExtend(), rtl()],
  insertionPoint: document.getElementById('jss-insertion-point'),
});

const generateClassName = createGenerateClassName({ disableGlobal: true });

const withAppProviders = (Component) => (props) => {
  const WrapperComponent = () => (
    <StylesProvider jss={jss} generateClassName={generateClassName}>
      <Provider store={store}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Component {...props} />
        </MuiPickersUtilsProvider>
      </Provider>
    </StylesProvider>
  );

  return WrapperComponent;
};

export default withAppProviders;
