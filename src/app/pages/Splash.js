import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import App from 'app/App';
import Context from 'app/AppContext';

const Splash = () => {
  const { state } = useContext(Context);

  // return state.isAuth ? <Redirect to='/' /> : <App />;
  return <App />;
};

export default Splash;
