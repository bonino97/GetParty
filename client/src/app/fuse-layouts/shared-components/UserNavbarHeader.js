import React, { useContext } from 'react';

import { AppBar, Avatar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import Context from 'app/AppContext';

const useStyles = makeStyles((theme) => ({
  root: {
    '&.user': {
      '& .username, & .email': {
        transition: theme.transitions.create('opacity', {
          duration: theme.transitions.duration.shortest,
          easing: theme.transitions.easing.easeInOut,
        }),
      },
    },
  },
  avatar: {
    width: 72,
    height: 72,
    position: 'absolute',
    top: 92,
    padding: 8,
    background: theme.palette.background.default,
    boxSizing: 'content-box',
    left: '50%',
    transform: 'translateX(-50%)',
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
    '& > img': {
      borderRadius: '50%',
    },
  },
}));

function UserNavbarHeader(props) {
  const classes = useStyles();
  const { state } = useContext(Context);
  const { currentUser } = state;
  return currentUser ? (
    <AppBar
      position='static'
      color='primary'
      elevation={0}
      classes={{ root: classes.root }}
      className='user relative flex flex-col items-center justify-center pt-24 pb-64 mb-32 z-0'
    >
      <Typography
        className='username text-16 whitespace-no-wrap'
        color='inherit'
      >
        {currentUser.name ? currentUser.name : ''}
      </Typography>
      <Typography
        className='email text-13 mt-8 opacity-50 whitespace-no-wrap'
        color='inherit'
      >
        {currentUser.email ? currentUser.email : ''}
      </Typography>
      <Avatar
        className={clsx(classes.avatar, 'avatar')}
        alt='user photo'
        src={
          currentUser.picture
            ? currentUser.picture
            : 'assets/images/avatars/profile.jpg'
        }
      />
    </AppBar>
  ) : null;
}

export default UserNavbarHeader;
