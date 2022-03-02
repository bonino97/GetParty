import React, { useEffect, useState, useContext, memo } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import _ from '@lodash';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { formatDistance, intlFormat } from 'date-fns';
import ReactMapGL, { Marker } from 'react-map-gl';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import { CardActions, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';
import NavigationIcon from '@material-ui/icons/Navigation';
import ShareIcon from '@material-ui/icons/Share';
import MessageIcon from '@material-ui/icons/Message';

import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';

import FusePageCarded from '@fuse/core/FusePageCarded';

import PlaceIcon from 'app/components/Icons/PlaceIcon';
import { MAPBOX_TOKEN, MAP_STYLE } from 'app/constants/MapboxData';
import FuseLoading from '@fuse/core/FuseLoading';

import Context from 'app/AppContext';
import { showMessage } from 'app/store/fuse/messageSlice';
import { toggleQuickPanel } from 'app/layouts/shared-components/quickPanel/store/stateSlice';
import { isAuthUser } from 'app/services/authService/isAuthUser';
import { openGoogleMaps } from 'app/services/googleService/openGoogleMaps';
import { openGoogleCalendar } from 'app/services/googleService/openGoogleCalendar';

import { useAuthClient } from 'graphql/authClient';
import { useClient } from 'graphql/client';
import { DELETE_PIN_MUTATION } from 'graphql/mutations';
import { GET_PIN_BY_SLUG_QUERY } from 'graphql/queries';

const orderStatuses = [
  {
    id: 1,
    name: 'Awaiting check payment',
    color: 'bg-blue text-white',
  },
  {
    id: 2,
    name: 'Payment accepted',
    color: 'bg-green text-white',
  },
  {
    id: 3,
    name: 'Preparing the order',
    color: 'bg-orange text-black',
  },
  {
    id: 4,
    name: 'Shipped',
    color: 'bg-purple text-white',
  },
  {
    id: 5,
    name: 'Delivered',
    color: 'bg-green-700 text-white',
  },
  {
    id: 6,
    name: 'Canceled',
    color: 'bg-pink text-white',
  },
  {
    id: 7,
    name: 'Refunded',
    color: 'bg-red text-white',
  },
  {
    id: 8,
    name: 'Payment error',
    color: 'bg-red-700 text-white',
  },
  {
    id: 9,
    name: 'On pre-order (paid)',
    color: 'bg-purple-300 text-white',
  },
  {
    id: 10,
    name: 'Awaiting bank wire payment',
    color: 'bg-blue text-white',
  },
  {
    id: 11,
    name: 'Awaiting PayPal payment',
    color: 'bg-blue-700 text-white',
  },
  {
    id: 12,
    name: 'Remote payment accepted',
    color: 'bg-green-800 text-white',
  },
  {
    id: 13,
    name: 'On pre-order (not paid)',
    color: 'bg-purple-700 text-white',
  },
  {
    id: 14,
    name: 'Awaiting Cash-on-delivery payment',
    color: 'bg-blue-800 text-white',
  },
];

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 15,
};

const Party = () => {
  const { slug } = useParams();
  const history = useHistory();
  const [pin, setPin] = useState(null);
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const reduxDispatch = useDispatch();
  const authClient = useAuthClient();
  const client = useClient();
  const { state, dispatch } = useContext(Context);

  const getPartyBySlug = async () => {
    const { getPinBySlug } = await client.request(GET_PIN_BY_SLUG_QUERY, { slug });
    return getPinBySlug;
  };

  const getMapViewport = async () => {
    setViewport({
      latitude: pin?.latitude,
      longitude: pin?.longitude,
      zoom: 20,
    });
  };

  useEffect(async () => {
    const filteredPin = await getPartyBySlug();
    setPin(filteredPin);

    const loadingViewport = await getMapViewport();
    setViewport(loadingViewport);

    return () => {
      setPin(null);
      setViewport(INITIAL_VIEWPORT);
    };
  }, []);

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
      dispatch({ type: 'DELETE_PIN', payload: pin });
      history.push('/parties');
    }
  };

  const handleOpenGoogleMap = () => {
    openGoogleMaps(pin, state?.currentLocation);
  };

  const handleComments = () => {
    dispatch({ type: 'SET_PIN', payload: pin });
    reduxDispatch(toggleQuickPanel());
  };

  const handleOpenGoogleCalendar = () => {
    openGoogleCalendar(pin, getAddress());
  };

  return pin ? (
    <FusePageCarded
      classes={{
        content: 'flex',
        header: 'w-full flex flex-col min-h-96 h-96 sm:h-136 sm:min-h-136',
      }}
      header={
        <div className={'relative overflow-hidden items-center justify-center h-100 sm:h-168'}>
          <div className='mx-auto w-full p-24 sm:p-32'>
            <motion.div
              className='flex flex-row'
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
            >
              <Typography className='flex items-center sm:mb-12' component={Link} role='button' to='/parties' color='inherit'>
                <Icon className='text-20'>arrow_back</Icon>
                <span className='mx-4 font-medium'>Back</span>
              </Typography>
            </motion.div>
            <motion.div
              className='flex flex-row justify-center'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0 } }}
            >
              <CardActions disableSpacing className='pt-0'>
                {isAuthUser(pin, state?.currentUser) && (
                  <IconButton onClick={() => handleDeletePin()} aria-label='delete pin'>
                    <DeleteIcon />
                  </IconButton>
                )}
                <IconButton aria-label='share'>
                  <ShareIcon />
                </IconButton>
                <IconButton aria-label='open map to see position' onClick={() => handleOpenGoogleMap()}>
                  <NavigationIcon />
                </IconButton>
                <IconButton aria-label='view comments of party' onClick={() => handleComments(pin)}>
                  <MessageIcon />
                </IconButton>
              </CardActions>
            </motion.div>
          </div>
        </div>
      }
      content={
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
          className='p-16 sm:p-24 w-full'
        >
          <div className='pb-16 flex flex-wrap items-center justify-center sm:justify-start'>
            <div className='flex flex-row p-3 mb-16 sm:m-0 w-full sm:w-auto'>
              <Avatar src={pin?.author?.picture} />
              <div className='flex flex-col ml-auto sm:ml-8'>
                <Typography className='truncate mx-8 mb-4'>{pin?.author?.name}</Typography>
                <Button variant='contained' color='primary' size='small' className='p-2'>
                  Follow
                </Button>
              </div>
            </div>

            <div className='flex flex-col p-3 items-center sm:ml-auto'>
              <Typography variant='caption' className='mb-2'>
                <Chip
                  icon={<Icon className='text-16'>access_time</Icon>}
                  label={
                    pin?.startDate &&
                    intlFormat(
                      new Date(pin?.startDate),
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
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
              <Button variant='text' color='primary' size='small' className='w-full p-2' onClick={() => handleOpenGoogleCalendar()}>
                Add to calendar
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0 } }}
            className='flex items-center flex-wrap mb-20'
          >
            {pin?.image && (
              <div className='w-full flex flex-col items-center pb-16'>
                <img className='rounded-lg' src={pin?.image} alt='get party images' />
              </div>
            )}
            <div className='w-full'>
              <Typography color='primary' className='text-3xl font-bold tracking-tight mb-3 text-center mt-10'>
                {pin?.title}
              </Typography>
              <Typography className='text-center mb-8'>{pin?.content}</Typography>
            </div>
            <div className='w-full md:w-1/2'>
              <div className='flex flex-col p-4'>
                <Typography variant='caption'>{getAddress()}</Typography>
              </div>
              <div className='flex flex-col p-4'>
                <Typography variant='caption'>{getPriceOfTicket()}</Typography>
              </div>
              <div className='flex flex-col p-4'>
                <Typography variant='caption'>
                  <div className='flex flex-row '>
                    <Icon className='text-14 mt-2 mr-4 font-bold' color='inherit'>
                      sticky_note_2
                    </Icon>
                    <div>
                      Available Tickets:
                      <span className='font-bold ml-2 text-yellow-700'>{pin?.availableTickets}</span>
                    </div>
                  </div>
                </Typography>
              </div>
              <div className='flex flex-col p-4'>
                <Typography variant='caption'>
                  <div className='flex flex-row '>
                    {pin?.tags &&
                      pin?.tags?.map((pin) => (
                        <span className='p-1'>
                          <Chip label={'#' + pin} component='a' href='#basic-chip' variant='outlined' clickable />
                        </span>
                      ))}
                  </div>
                </Typography>
              </div>
              {/* <div className='flex flex-col p-4'>
                  <Typography variant='caption'>{getAddress()}</Typography>
                </div>
                <div className='flex flex-col p-4'>
                  <Typography variant='caption'>{getAddress()}</Typography>
                </div>
                <div className='flex flex-col p-4'>
                  <Typography variant='caption'>{getAddress()}</Typography>
                </div>
                <div className='flex flex-col p-4'>
                  <Typography variant='caption'>{getAddress()}</Typography>
                </div> */}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0 } }}
            className='flex items-center flex-wrap mb-20'
          >
            {/* <div className='w-full min-h-200 max-h-320 h-200 md:h-280 sm:h-320 rounded-16 overflow-hidden mx-8 pr-10'>
                <ReactMapGL
                  mapboxApiAccessToken={MAPBOX_TOKEN}
                  width='auto'
                  height='100%'
                  mapStyle={MAP_STYLE}
                  viewport={viewport}
                  title='Get Party Map'
                >
                  <Marker
                    key={pin?._id}
                    latitude={pin?.latitude}
                    longitude={pin?.longitude}
                  >
                    <PlaceIcon size={35} color={'#FEBE3E'}></PlaceIcon>
                  </Marker>
                </ReactMapGL>
              </div> */}
          </motion.div>

          {/* <div className='pb-48'>
              <div className='mb-24'>
                <div className='table-responsive mb-48'>
                  <table className='simple'>
                    <thead>
                      <tr>
                        <th>
                          <Typography className='font-semibold'>
                            Name
                          </Typography>
                        </th>
                        <th>
                          <Typography className='font-semibold'>
                            Email
                          </Typography>
                        </th>
                        <th>
                          <Typography className='font-semibold'>
                            Phone
                          </Typography>
                        </th>
                        <th>
                          <Typography className='font-semibold'>
                            Company
                          </Typography>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className='flex items-center'>
                            <Avatar src={pin?.author?.picture} />
                            <Typography className='truncate mx-8'>
                              Juan Cruz Lombardo Bonino
                            </Typography>
                          </div>
                        </td>
                        <td>
                          <Typography className='truncate'>
                            juanbonino97@gmail.com
                          </Typography>
                        </td>
                        <td>
                          <Typography className='truncate'>
                            +543468518855
                          </Typography>
                        </td>
                        <td>Get Party Company. A pelatelli</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <Accordion
                  className='border-0 shadow-0 overflow-hidden'
                  expanded={map === 'shipping'}
                  onChange={() =>
                    setMap(map !== 'shipping' ? 'shipping' : false)
                  }
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    classes={{ root: 'border border-solid rounded-16 mb-16' }}
                  >
                    <Typography className='font-semibold'>
                      Shipping Address
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className='flex flex-col md:flex-row -mx-8'>
                    <Typography className='w-full md:max-w-256 mb-16 md:mb-0 mx-8 text-16'>
                      San Luis 724
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion
                  className='shadow-0 border-0 overflow-hidden'
                  expanded={map === 'invoice'}
                  onChange={() => setMap(map !== 'invoice' ? 'invoice' : false)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    classes={{ root: 'border border-solid rounded-16 mb-16' }}
                  >
                    <Typography className='font-semibold'>
                      Invoice Address
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className='flex flex-col md:flex-row -mx-8'>
                    <Typography className='w-full md:max-w-256 mb-16 md:mb-0 mx-8 text-16'>
                      San Luis 724
                    </Typography>
                    <div className='w-auto h-auto rounded-16 overflow-hidden mx-8 items-center justify-end'>
                      <img
                        src={pin?.image}
                        alt='party image'
                        className='rounded-8'
                      />
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>

            <div className='pb-48'>
              <div className='pb-16 flex items-center'>
                <Icon color='action'>access_time</Icon>
                <Typography
                  className='h2 mx-12 font-medium'
                  color='textSecondary'
                >
                  Order Status
                </Typography>
              </div>

              <div className='table-responsive'>
                <table className='simple'>
                  <thead>
                    <tr>
                      <th>
                        <Typography className='font-semibold'>
                          Status
                        </Typography>
                      </th>
                      <th>
                        <Typography className='font-semibold'>
                          Updated On
                        </Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key={1}>
                      <td>
                        <OrdersStatus name='Awaiting check payment' />
                      </td>
                      <td>20/10/1991</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className='pb-48'>
              <div className='pb-16 flex items-center'>
                <Icon color='action'>attach_money</Icon>
                <Typography
                  className='h2 mx-12 font-medium'
                  color='textSecondary'
                >
                  Payment
                </Typography>
              </div>

              <div className='table-responsive'>
                <table className='simple'>
                  <thead>
                    <tr>
                      <th>
                        <Typography className='font-semibold'>
                          TransactionID
                        </Typography>
                      </th>
                      <th>
                        <Typography className='font-semibold'>
                          Payment Method
                        </Typography>
                      </th>
                      <th>
                        <Typography className='font-semibold'>
                          Amount
                        </Typography>
                      </th>
                      <th>
                        <Typography className='font-semibold'>Date</Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className='truncate'>
                          12398127848712478128747812
                        </span>
                      </td>
                      <td>
                        <span className='truncate'>Debit card</span>
                      </td>
                      <td>
                        <span className='truncate'>$1500.50</span>
                      </td>
                      <td>
                        <span className='truncate'>20/10/2045 10:45pm</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className='pb-48'>
              <div className='pb-16 flex items-center'>
                <Icon color='action'>local_shipping</Icon>
                <Typography
                  className='h2 mx-12 font-medium'
                  color='textSecondary'
                >
                  Shipping
                </Typography>
              </div>

              <div className='table-responsive'>
                <table className='simple'>
                  <thead>
                    <tr>
                      <th>
                        <Typography className='font-semibold'>
                          Tracking Code
                        </Typography>
                      </th>
                      <th>
                        <Typography className='font-semibold'>
                          Carrier
                        </Typography>
                      </th>
                      <th>
                        <Typography className='font-semibold'>
                          Weight
                        </Typography>
                      </th>
                      <th>
                        <Typography className='font-semibold'>Fee</Typography>
                      </th>
                      <th>
                        <Typography className='font-semibold'>Date</Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key={1}>
                      <td>
                        <span className='truncate'>Tracking</span>
                      </td>
                      <td>
                        <span className='truncate'>Carrier</span>
                      </td>
                      <td>
                        <span className='truncate'>Weight</span>
                      </td>
                      <td>
                        <span className='truncate'>Fee</span>
                      </td>
                      <td>
                        <span className='truncate'>Date/Date/Date</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
        </motion.div>
      }
      innerScroll
    />
  ) : (
    <FuseLoading />
  );
};

export default memo(Party);
