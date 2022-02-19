import React, { useState, useEffect, useContext, memo } from 'react';

import ReactMapGL, {
  NavigationControl,
  Marker,
  GeolocateControl,
  AttributionControl,
} from 'react-map-gl';

import FuseLoading from '@fuse/core/FuseLoading';

import { Subscription } from 'react-apollo';

import { useClient } from 'graphql/client';

import { GET_PINS_QUERY } from 'graphql/queries';
import {
  PIN_ADDED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION,
} from 'graphql/subscriptions';

import { withStyles } from '@material-ui/core/styles';

import PinIcon from 'app/components/Icons/PinIcon';
import PlaceIcon from 'app/components/Icons/PlaceIcon';
import PartyForm from 'app/components/Party/PartyForm';
import Context from 'app/AppContext';

import PartyContent from 'app/components/Party/PartyContent';

import { MAPBOX_TOKEN, MAP_STYLE } from 'app/constants/MapboxData';

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 10,
};

const Map = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);

  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPins();
    getUserPosition();
    dispatch({ type: 'SET_PIN', payload: null });
  }, []);

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    dispatch({ type: 'GET_PINS', payload: getPins });
  };

  const getUserPosition = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        dispatch({
          type: 'CURRENT_LOCATION',
          payload: { longitude, latitude },
        });
        setViewport({ latitude, longitude, zoom: 13 });
        setLoading(false);
      });
    }
  };

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state?.draft) dispatch({ type: 'CREATE_DRAFT' });
    const [longitude, latitude] = lngLat;
    dispatch({
      type: 'UPDATE_DRAFT_LOCATION',
      payload: { longitude, latitude },
    });
  };

  const getPinStatus = (pin) => {
    return '#FEBE3E';
  };

  const handleSelectedPin = (pin) => {
    dispatch({ type: 'SET_PIN', payload: pin });
  };

  return (
    <div className={classes?.root}>
      {loading ? (
        <FuseLoading />
      ) : (
        <>
          <ReactMapGL
            mapboxApiAccessToken={MAPBOX_TOKEN}
            width='100vw'
            height={`calc(100vh -  ${
              window.innerWidth <= 768 ? '48px' : '64px'
            })`}
            style={{
              minWidth: '100vw',
              minHeight: `calc(100vh -  ${
                window.innerWidth <= 768 ? '48px' : '64px'
              })`,
            }}
            mapStyle={MAP_STYLE}
            onViewportChange={(newViewport) => setViewport(newViewport)}
            onClick={handleMapClick}
            attributionControl={false}
            {...viewport}
          >
            <AttributionControl
              compact={true}
              style={{ right: 0, bottom: 0 }}
            />

            <div className={classes.geolocateControl}>
              <GeolocateControl
                positionOptions={{ enableHighAccuracy: true }}
                trackUserLocation={true}
                auto
              />
            </div>
            {/* Navigation Control */}
            <div className={classes.navigationControl}>
              <NavigationControl
                onViewportChange={(newViewport) => setViewport(newViewport)}
              />
            </div>

            {/* Draft Pin */}
            {state?.draft && (
              <Marker
                latitude={state?.draft?.latitude}
                longitude={state?.draft?.longitude}
                offsetLeft={-19}
                offsetTop={-38}
              >
                <PinIcon size={35} color='black'></PinIcon>
              </Marker>
            )}

            {state?.pins?.map((pin) => (
              <Marker
                key={pin?._id}
                latitude={pin?.latitude}
                longitude={pin?.longitude}
                offsetLeft={-19}
                offsetTop={-38}
              >
                <PlaceIcon
                  size={35}
                  color={getPinStatus(pin)}
                  onClick={() => handleSelectedPin(pin)}
                ></PlaceIcon>
              </Marker>
            ))}

            {state?.currentPin && <PartyContent pin={state?.currentPin} />}
          </ReactMapGL>

          {/* Subscriptions for Adding / Updating / Deleting pins */}

          <Subscription
            subscription={PIN_ADDED_SUBSCRIPTION}
            onSubscriptionData={({ subscriptionData }) => {
              const { pinAdded } = subscriptionData?.data;
              dispatch({ type: 'CREATE_PIN', payload: pinAdded });
            }}
          />
          <Subscription
            subscription={PIN_UPDATED_SUBSCRIPTION}
            onSubscriptionData={({ subscriptionData }) => {
              const { pinUpdated } = subscriptionData?.data;
              dispatch({ type: 'CREATE_COMMENT', payload: pinUpdated });
            }}
          />
          <Subscription
            subscription={PIN_DELETED_SUBSCRIPTION}
            onSubscriptionData={({ subscriptionData }) => {
              const { pinDeleted } = subscriptionData?.data;
              dispatch({ type: 'DELETE_PIN', payload: pinDeleted });
            }}
          />

          {state?.draft && state?.currentUser && <PartyForm />}
          {/* {state?.draft && state?.currentUser && <RegisterForm />} */} 
        </>
      )}
    </div>
  );
};

const styles = {
  root: {
    display: 'flex',
  },
  rootMobile: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  geolocateControl: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em',
  },
  navigationControl: {
    position: 'absolute',
    top: 35,
    left: 0,
    margin: '1em',
  },
  deleteIcon: {
    color: 'red',
  },
  popupImage: {
    padding: '0.4em',
    height: 200,
    width: 200,
    objectFit: 'cover',
  },
  popupTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  blackText: {
    color: 'black',
  },
};

export default memo(withStyles(styles)(Map));
