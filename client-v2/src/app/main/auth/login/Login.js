import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import Login from 'app/components/Auth/Login';
import Context from 'app/AppContext';

const LoginRoute = () => {
  const { state } = useContext(Context);
  return <Login />;
  //   return !state.isAuth ? <Redirect to='/' /> : <Login />;
};

export default LoginRoute;
