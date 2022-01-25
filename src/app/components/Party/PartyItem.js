import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';
import NavigationIcon from '@material-ui/icons/Navigation';
import MessageIcon from '@material-ui/icons/Message';
import ShareIcon from '@material-ui/icons/Share';

import { Link } from 'react-router-dom';

import { formatDistance, intlFormat } from 'date-fns';

import { DELETE_PIN_MUTATION } from 'graphql/mutations';
import { useAuthClient } from 'graphql/authClient';

import Context from 'app/AppContext';
import { showMessage } from 'app/store/fuse/messageSlice';
import { toggleQuickPanel } from 'app/layouts/shared-components/quickPanel/store/stateSlice';
import { isAuthUser } from 'app/services/authService/isAuthUser';
import { openGoogleMaps } from 'app/services/googleService/openGoogleMaps';

const PartyItem = (pin) => {
  const authClient = useAuthClient();
  const reduxDispatch = useDispatch();
  const { state, dispatch } = useContext(Context);

  const getPriceOfTicket = () => {
    if (pin?.priceOfTicket === 0) {
      return (
        <div className='flex flex-row '>
          <Icon className='text-16 mt-1 mr-2' color='inherit'>
            money_off
          </Icon>
          <div>Free</div>
        </div>
      );
    }

    if (pin?.priceOfTicket > 0) {
      return (
        <div className='flex flex-row '>
          <div>Starts at </div>
          <Icon className='text-14 mt-2' color='inherit'>
            attach_money
          </Icon>
          <div>{pin?.priceOfTicket}</div>
        </div>
      );
    }
    return 'Free';
  };

  const getAddress = () => {
    const address = `
    ${pin?.location?.address ? pin?.location?.address + ', ' : ''}
    ${pin?.location?.city ? pin?.location?.city + ', ' : ''}
    ${pin?.location?.state ? pin?.location?.state + ', ' : ''}
    ${pin?.location?.country ? pin?.location?.country : ''}`;

    return (
      <div className='flex flex-row '>
        <Icon className='text-14 mt-2 mr-2 font-bold' color='inherit'>
          near_me
        </Icon>
        <div>{address}</div>
      </div>
    );
  };

  const handleDeletePin = async () => {
    const { deletePin } = await authClient.request(DELETE_PIN_MUTATION, {
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
  };

  const handleOpenGoogleMap = () => {
    openGoogleMaps(pin, state?.currentLocation);
  };

  const handleComments = () => {
    dispatch({ type: 'SET_PIN', payload: pin });
    reduxDispatch(toggleQuickPanel());
  };

  return (
    <Card
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0 },
      }}
      key={pin?._id}
      className='rounded-16 shadow overflow-y-auto'
    >
      <CardHeader
        avatar={<Avatar aria-label='Recipe' src={pin?.author?.picture} />}
        action={
          <IconButton aria-label='more'>
            <Icon>favorite_border</Icon>
          </IconButton>
        }
        title={
          <span className='flex'>
            <Typography className='font-bold' color='inherit' paragraph={false}>
              {pin?.author?.name}
            </Typography>
          </span>
        }
        subheader={
          <div className='flex flex-row opacity-50 text-12'>
            <Icon className='text-16 mt-1 mr-4' color='inherit'>
              access_time
            </Icon>
            <div>
              {pin?.startDate &&
                formatDistance(new Date(pin?.startDate), new Date(), {
                  addSuffix: true,
                })}
            </div>
          </div>
        }
      />

      <CardContent className='py-0'>
        {pin?.image && (
          <div className='w-full'>
            <img
              className='rounded-lg w-auto h-auto'
              src={pin?.image}
              alt='get party images'
            />
          </div>
        )}
        <div className='flex flex-col items-center p-16'>
          <Typography color='inherit' className='font-bold' variant='subtitle1'>
            {pin?.title}
          </Typography>
          <Typography className='mt-16 text-center'>{pin?.content}</Typography>
        </div>
        <div className='flex flex-col p-4'>
          <Typography variant='caption'>{getPriceOfTicket()}</Typography>
        </div>
        <div className='flex flex-col p-4'>
          <Typography variant='caption'>{getAddress()}</Typography>
        </div>
        <div className='flex flex-col pt-4 pb-4'>
          <Typography variant='caption'>
            <Chip
              icon={<Icon className='text-16'>access_time</Icon>}
              label={
                pin?.startDate &&
                intlFormat(
                  new Date(pin?.startDate),
                  {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  },
                  {
                    locale: 'en-US',
                  }
                )
              }
              classes={{
                root: 'h-24',
                label: 'text-11',
              }}
              variant='outlined'
            />
          </Typography>
        </div>
      </CardContent>

      <CardActions disableSpacing className='flex flex-row justify-center'>
        <Button
          to={`/parties/${pin?.slug}`}
          component={Link}
          className='justify-center w-full '
          color='primary'
          variant='outlined'
        >
          View all
        </Button>
      </CardActions>
      <CardActions disableSpacing className='pt-0'>
        {isAuthUser(pin, state?.currentUser) && (
          <IconButton onClick={() => handleDeletePin()} aria-label='delete pin'>
            <DeleteIcon />
          </IconButton>
        )}
        <IconButton aria-label='share'>
          <ShareIcon />
        </IconButton>
        <IconButton
          aria-label='open map to see position'
          onClick={() => handleOpenGoogleMap()}
        >
          <NavigationIcon />
        </IconButton>
        <IconButton
          aria-label='view comments of party'
          onClick={() => handleComments()}
        >
          <MessageIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PartyItem;
