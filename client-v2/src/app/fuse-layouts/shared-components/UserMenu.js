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
import { GoogleLogout } from 'react-google-login';

function UserMenu() {
  const { state, dispatch } = useContext(Context);
  const { currentUser } = state;

  const [userMenu, setUserMenu] = useState(null);

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  const onSignout = () => {
    console.log('kasdjkdsajkdkj');
    dispatch({ type: 'SIGNOUT_USER' });
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

            <GoogleLogout
              onLogoutSuccess={onSignout}
              buttonText='Signout'
              render={(onClick) => (
                <MenuItem
                  onClick={() => {
                    userMenuClose();
                    return onClick;
                  }}
                >
                  <ListItemIcon className='min-w-40'>
                    <Icon>exit_to_app</Icon>
                  </ListItemIcon>
                  <ListItemText className='pl-0' primary='Logout' />
                </MenuItem>
              )}
            />
          </React.Fragment>
        )}
      </Popover>
    </React.Fragment>
  );
}

export default UserMenu;
