import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Context from '../context';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AudiotrackOutlinedIcon from '@material-ui/icons/AudiotrackOutlined';
import Typography from '@material-ui/core/Typography';
import Signout from '../components/Auth/Signout';

const Header = ({ classes }) => {
  const { state } = useContext(Context);
  const { currentUser } = state;
  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar className={classes.whiteBg}>
          <div className={classes.grow}>
            <AudiotrackOutlinedIcon
              className={classes.icon}
            ></AudiotrackOutlinedIcon>
            <Typography
              component='h1'
              variant='h6'
              color='inherit'
              noWrap
              className={classes.headerText}
            >
              GetParty
            </Typography>
          </div>
          {/* Current User Info */}
          {currentUser && (
            <div className={classes.grow}>
              <img
                className={classes.picture}
                src={currentUser.picture}
                alt={`Get Party: ${currentUser.name}`}
              />
              {/* <Typography
                variant='h6'
                color='inherit'
                noWrap
                className={classes.headerText}
              >
                {currentUser.name}
              </Typography> */}
            </div>
          )}
          <Signout />
        </Toolbar>
      </AppBar>
    </div>
  );
};

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    color: '#9f01ff',
    fontSize: 30,
  },
  mobile: {
    display: 'none',
  },
  picture: {
    height: '35px',
    borderRadius: '90%',
    marginRight: theme.spacing(2),
  },
  headerText: {
    color: '#9f01ff',
    fontSize: '1.15rem',
    fontWeight: 'bold',
  },
  whiteBg: {
    backgroundColor: '#1C1C1C',
  },
});

export default withStyles(styles)(Header);
