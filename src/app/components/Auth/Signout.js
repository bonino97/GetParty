import React, { useContext } from 'react';
import { GoogleLogout } from 'react-google-login';
import Context from 'app/AppContext';

const Signout = () => {
  const { dispatch } = useContext(Context);
  const onSignout = () => {
    dispatch({ type: 'SIGNOUT_USER' });
  };

  return <GoogleLogout onLogoutSuccess={onSignout} buttonText='Signout' render={({ onClick }) => <span onClick={onClick}></span>} />;
};

export default Signout;
