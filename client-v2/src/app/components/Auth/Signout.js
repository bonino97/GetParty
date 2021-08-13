import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { GoogleLogout } from 'react-google-login';

import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
// import Typography from '@material-ui/core/Typography';
import Context from '../../app/AppContext';

const Signout = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const onSignout = () => {
    dispatch({ type: 'SIGNOUT_USER' });
  };

  return (
    <GoogleLogout
      onLogoutSuccess={onSignout}
      buttonText='Signout'
      render={({ onClick }) => (
        <span className={classes.root} onClick={onClick}>
          {/* <Typography variant='body1' className={classes.buttonText}>
            Exit
          </Typography> */}
          <PowerSettingsNewIcon className={classes.buttonIcon} />
        </span>
      )}
    />
  );
};

const styles = {
  root: {
    cursor: 'pointer',
    display: 'flex',
  },
  buttonText: {
    color: '#ff0000',
    fontWeight: 'bold',
    marginTop: '2px'
  },
  buttonIcon: {
    marginLeft: '2px',
    color: '#ff0000',
  },
};

export default withStyles(styles)(Signout);
