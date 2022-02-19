import { useContext, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Context from 'app/AppContext';
import { useGoogleLogout } from 'react-google-login';

function UserMenu(props) {
  const { state, dispatch } = useContext(Context);
  const { currentUser } = state;
  const { signOut } = useGoogleLogout({});

  const [userMenu, setUserMenu] = useState(null);

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  const onSignout = () => {
    signOut();
    dispatch({ type: 'SIGNOUT_USER' });
  };

  return (
    <>
      <Button
        className='min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6'
        onClick={userMenuClick}
      >
        {currentUser && (
          <>
            <Avatar
              className=''
              alt='user photo'
              src={
                currentUser?.picture
                  ? currentUser?.picture
                  : 'assets/images/avatars/profile.jpg'
              }
            />
          </>
        )}

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
          <>
            <>
              <MenuItem component={Link} to='/login' role='button'>
                <ListItemIcon className='min-w-40'>
                  <Icon>lock</Icon>
                </ListItemIcon>
                <ListItemText primary='Login' />
              </MenuItem>
              <MenuItem component={Link} to='/register' role='button'>
                <ListItemIcon className='min-w-40'>
                  <Icon>person_add</Icon>
                </ListItemIcon>
                <ListItemText primary='Register' />
              </MenuItem>
            </>
          </>
        ) : (
          <>
            <MenuItem
              component={Link}
              to='/pages/profile'
              onClick={userMenuClose}
              role='button'
            >
              <ListItemIcon className='min-w-40'>
                <Icon>account_circle</Icon>
              </ListItemIcon>
              <ListItemText primary='My Profile' />
            </MenuItem>
            <MenuItem
              component={Link}
              to='/apps/mail'
              onClick={userMenuClose}
              role='button'
            >
              <ListItemIcon className='min-w-40'>
                <Icon>mail</Icon>
              </ListItemIcon>
              <ListItemText primary='Inbox' />
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
          </>
        )}
      </Popover>
    </>
  );
}

export default UserMenu;
