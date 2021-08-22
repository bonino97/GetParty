import React, { useContext, useState } from 'react';
import {
  Avatar,
  Button,
  Icon,
  ListItemIcon,
  ListItemText,
  Popover,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import Context from 'app/AppContext';
import { useGoogleLogout } from 'react-google-login';
import { setInitialSettings } from 'app/store/actions/fuse';

function UserMenu(props) {
  const { state } = useContext(Context);
  const { currentUser } = state;

  const { signOut } = useGoogleLogout({});

  const [userMenu, setUserMenu] = useState(null);

  const { dispatch } = useContext(Context);

  const onSignout = () => {
    signOut();
    dispatch({ type: 'SIGNOUT_USER' });
    dispatch(setInitialSettings());
  };

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  return (
    <React.Fragment>
      <Button className='h-64' onClick={userMenuClick}>
        {currentUser ? (
          <React.Fragment>
            <Avatar
              className=''
              alt='user photo'
              src={
                currentUser.picture
                  ? currentUser.picture
                  : 'assets/images/avatars/profile.jpg'
              }
            />{' '}
            <div className='hidden md:flex flex-col ml-12 items-start'>
              <Typography
                component='span'
                className='normal-case font-600 flex'
              >
                Juan Cruz
              </Typography>
              <Typography className='text-11 capitalize' color='textSecondary'>
                Admin
              </Typography>
            </div>
          </React.Fragment>
        ) : null}

        <Icon className='text-16 ml-12 hidden sm:flex' variant='action'>
          keyboard_arrow_down
        </Icon>
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        {!currentUser ? (
          <React.Fragment>
            <MenuItem component={Link} to='/login'>
              <ListItemIcon className='min-w-40'>
                <Icon>lock</Icon>
              </ListItemIcon>
              <ListItemText className='pl-0' primary='Login' />
            </MenuItem>
            <MenuItem component={Link} to='/register'>
              <ListItemIcon className='min-w-40'>
                <Icon>person_add</Icon>
              </ListItemIcon>
              <ListItemText className='pl-0' primary='Register' />
            </MenuItem>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <MenuItem
              component={Link}
              to='/pages/profile'
              onClick={userMenuClose}
            >
              <ListItemIcon className='min-w-40'>
                <Icon>account_circle</Icon>
              </ListItemIcon>
              <ListItemText className='pl-0' primary='My Profile' />
            </MenuItem>
            <MenuItem component={Link} to='/apps/mail' onClick={userMenuClose}>
              <ListItemIcon className='min-w-40'>
                <Icon>mail</Icon>
              </ListItemIcon>
              <ListItemText className='pl-0' primary='Inbox' />
            </MenuItem>
            <MenuItem
              onClick={() => {
                userMenuClose();
                onSignout();
              }}
            >
              <ListItemIcon className='min-w-40'>
                <Icon>exit_to_app</Icon>
              </ListItemIcon>
              <ListItemText className='pl-0' primary='Logout' />
            </MenuItem>
          </React.Fragment>
        )}
      </Popover>
    </React.Fragment>
  );
}

export default UserMenu;