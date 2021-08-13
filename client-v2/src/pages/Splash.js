import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import Login from 'app/components/Auth/Login';
import Context from '../app/AppContext';

const Splash = () => {
  const { state } = useContext(Context);

  return state.isAuth ? <Redirect to='/' /> : <Login />;
};

export default Splash;
