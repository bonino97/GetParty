import './react-chartjs-2-defaults';
import 'typeface-poppins';
import './i18n';
import './react-chartjs-2-defaults';
import './styles/app-base.css';
import './styles/app-components.css';
import './styles/app-utilities.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import React, { useContext, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from 'app/App';
import Splash from 'app/pages/Splash';
import Context from 'app/AppContext';
import Reducer from 'app/Reducer';
import routes from 'app/configs/routesConfig';

import history from '@history';

import ProtectedRoute from './ProtectedRoute';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/',
  options: {
    reconnect: true,
  },
});

const client = new ApolloClient({ link: wsLink, cache: new InMemoryCache() });

const Root = () => {
  const initialState = useContext(Context);
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <Router history={history}>
      <ApolloProvider client={client}>
        <Context.Provider value={{ state, dispatch, routes }}>
          <Switch>
            <Route path='/login' component={Splash} />
            <ProtectedRoute path='/' component={App} />
          </Switch>
        </Context.Provider>
      </ApolloProvider>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
reportWebVitals();

serviceWorker.unregister();
