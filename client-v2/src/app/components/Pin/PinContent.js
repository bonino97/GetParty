import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ShareIcon from '@material-ui/icons/Share';
import CloseIcon from '@material-ui/icons/Close';
import { Dialog } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';
import NavigationIcon from '@material-ui/icons/Navigation';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MessageIcon from '@material-ui/icons/Message';

import { formatDistanceToNowStrict } from 'date-fns';

import { DELETE_PIN_MUTATION } from 'graphql/mutations';
import { useClient } from 'graphql/client';

import Context from 'app/AppContext';
import { showMessage } from 'app/store/fuse/messageSlice';
import { toggleQuickPanel } from 'app/layouts/shared-components/quickPanel/store/stateSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    overflowY: 'scroll',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const PinContent = ({ pin }) => {
  console.log(pin);
  const client = useClient();
  const reduxDispatch = useDispatch();
  const { state, dispatch } = useContext(Context);
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const classes = useStyles();
  const pinDate = formatDistanceToNowStrict(Number(pin?.createdAt)) + ' ago';

  const isAuthUser = () => state?.currentUser?._id === pin?.author?._id;

  const handleDeletePin = async () => {
    const { deletePin } = await client.request(DELETE_PIN_MUTATION, {
      pinId: pin?._id,
    });

    if (deletePin) {
      reduxDispatch(
        showMessage({
          message: 'Party removed successfully.',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom', //top bottom
            horizontal: 'right', //left center right
          },
          variant: 'warning', //success error info warning null
        })
      );
    }

    setOpen(false);
  };

  const handlePinDialog = () => {
    dispatch({ type: 'SET_PIN', payload: null });
    setOpen(false);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleOpenGoogleMap = () => {
    const url = `https://www.google.com/maps/dir/${state?.currentLocation?.latitude},${state?.currentLocation?.longitude}/${pin?.latitude},${pin?.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <Dialog open={open} aria-labelledby='form-dialog-title' maxWidth='md'>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar
              aria-label='recipe'
              className={classes.avatar}
              src={pin?.author?.picture}
            ></Avatar>
          }
          action={
            <IconButton
              aria-label='closeicon'
              onClick={() => handlePinDialog()}
            >
              <CloseIcon />
            </IconButton>
          }
          title={pin?.title}
          subheader={pinDate}
        />
        {pin?.image && (
          <CardMedia
            className={classes?.media}
            image={pin?.image}
            title='Get Party Information'
          />
        )}

        <CardContent>
          <Typography variant='body2' color='textSecondary' component='p'>
            {pin?.content}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          {isAuthUser() && (
            <IconButton
              onClick={() => handleDeletePin()}
              aria-label='delete pin'
            >
              <DeleteIcon />
            </IconButton>
          )}
          <IconButton aria-label='share'>
            <ShareIcon />
          </IconButton>
          <IconButton
            aria-label='view party'
            onClick={() => handleOpenGoogleMap()}
          >
            <NavigationIcon />
          </IconButton>
          <IconButton
            aria-label='view party'
            onClick={() => reduxDispatch(toggleQuickPanel())}
          >
            <MessageIcon />
          </IconButton>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label='show more'
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Dialog>
  );
};

export default PinContent;
