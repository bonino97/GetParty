import React, { useState, useContext } from 'react';
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
import VisibilityIcon from '@material-ui/icons/Visibility';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MessageIcon from '@material-ui/icons/Message';

import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';

import { DELETE_PIN_MUTATION } from 'graphql/mutations';

import Context from 'app/AppContext';

import { useClient } from 'graphql/client';

import { useDispatch } from 'react-redux';

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

export default function PinContent({ pin }) {
  const client = useClient();
  const reduxDispatch = useDispatch();
  const { state, dispatch } = useContext(Context);
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const classes = useStyles();
  const pinDate = formatDistanceToNowStrict(Number(pin?.createdAt)) + ' ago';

  const isAuthUser = () => state.currentUser._id === pin.author._id;

  const handleDeletePin = async () => {
    const { deletePin } = await client.request(DELETE_PIN_MUTATION, {
      pinId: pin._id,
    });
    dispatch({ type: 'DELETE_PIN', payload: deletePin });
    setOpen(false);
  };

  const handlePinDialog = () => {
    dispatch({ type: 'SET_PIN', payload: null });
    setOpen(false);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Dialog open={open} aria-labelledby='form-dialog-title'>
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
        {pin.image && (
          <CardMedia
            className={classes?.media}
            image={pin?.image}
            title='Get Party Information'
          />
        )}

        <CardContent>
          <Typography variant='body2' color='textSecondary' component='p'>
            {pin.content}
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
            onClick={() => reduxDispatch(toggleQuickPanel())}
          >
            <VisibilityIcon />
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
}
