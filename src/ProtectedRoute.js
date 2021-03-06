import React, { useContext } from 'react';
import Context from './app/AppContext';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { state } = useContext(Context);
  return (
    <Route
      render={(props) =>
        state.isAuth ? <Component {...props} /> : <Redirect to='login' />
      }
      {...rest}
    />
  );
};

export default ProtectedRoute;
