import 'typeface-muli';
import './react-table-defaults';
import './react-chartjs-2-defaults';
import './styles/index.css';
import React, { useContext, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as serviceWorker from './serviceWorker';
import App from 'app/App';
import Splash from './pages/Splash';
import Context from 'app/AppContext';
import Reducer from 'app/Reducer';
import routes from 'app/configs/routesConfig';
import ProtectedRoute from './ProtectedRoute';

const Root = () => {
  const initialState = useContext(Context);
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <Router>
      <Context.Provider value={{ state, dispatch, routes }}>
        <Switch>
          <ProtectedRoute exact path='/' component={App} />
          <Route path='/login' component={Splash} />
        </Switch>
      </Context.Provider>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
