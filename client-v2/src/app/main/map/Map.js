import React, { useState, useEffect, useContext } from 'react';

import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';

import FuseLoading from '@fuse/core/FuseLoading';

import { useClient } from 'graphql/client';

import { GET_PINS_QUERY } from 'graphql/queries';

import { withStyles } from '@material-ui/core/styles';

import PinIcon from 'app/components/Icons/PinIcon';
import PlaceIcon from 'app/components/Icons/PlaceIcon';
import PersonIcon from 'app/components/Icons/PersonIcon';
import CreateParty from 'app/components/Pin/CreateParty';
import Context from 'app/AppContext';

import PinContent from 'app/components/Pin/PinContent';

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 10,
};

const Map = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    getPins();
  }, []);

  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [loading, setLoading] = useState(false);
  const [userPosition, setUserPosition] = useState();

  useEffect(() => {
    getUserPosition();
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
        setViewport({ latitude, longitude, zoom: 13 });
        setUserPosition({ latitude, longitude });
        setLoading(false);
      });
    }
  };

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draft) dispatch({ type: 'CREATE_DRAFT' });
    const [longitude, latitude] = lngLat;
    dispatch({
      type: 'UPDATE_DRAFT_LOCATION',
      payload: { longitude, latitude },
    });
  };

  const getPinStatus = (pin) => {
    return '#580254';
  };

  const handleSelectedPin = (pin) => {
    dispatch({ type: 'SET_PIN', payload: pin });
  };

  return (
    <div className={classes.root}>
      {loading ? (
        <FuseLoading />
      ) : (
        <>
          <ReactMapGL
            mapboxApiAccessToken='pk.eyJ1IjoiYm9uaWtpYTk3IiwiYSI6ImNrczlsdzd1dDB4aW4ybnJtcjJkeW9teHIifQ.fsXRvcqpttjN1XzKopniAg'
            width='100vw'
            height='calc(100vh - 64px)'
            mapStyle='mapbox://styles/mapbox/streets-v9'
            onViewportChange={(newViewport) => setViewport(newViewport)}
            onClick={handleMapClick}
            {...viewport}
          >
            {/* Navigation Control */}
            <div className={classes.navigationControl}>
              <NavigationControl
                onViewportChange={(newViewport) => setViewport(newViewport)}
              />
            </div>

            {/* Pin for user current position */}
            {userPosition && (
              <Marker
                latitude={userPosition.latitude}
                longitude={userPosition.longitude}
                offsetLeft={-19}
                offsetTop={-38}
              >
                {' '}
                <PersonIcon size={25} color='#0953ff'></PersonIcon>
              </Marker>
            )}
            {/* Draft Pin */}
            {state.draft && (
              <Marker
                latitude={state.draft.latitude}
                longitude={state.draft.longitude}
                offsetLeft={-19}
                offsetTop={-38}
              >
                {' '}
                <PinIcon size={35} color='black'></PinIcon>
              </Marker>
            )}

            {state.pins.map((pin) => (
              <Marker
                key={pin._id}
                latitude={pin.latitude}
                longitude={pin.longitude}
                offsetLeft={-19}
                offsetTop={-38}
              >
                {' '}
                <PlaceIcon
                  size={35}
                  color={getPinStatus(pin)}
                  onClick={() => handleSelectedPin(pin)}
                ></PlaceIcon>
              </Marker>
            ))}

            {state.currentPin ? <PinContent pin={state.currentPin} /> : null}
          </ReactMapGL>
          <CreateParty />
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
  navigationControl: {
    position: 'absolute',
    top: 0,
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

export default withStyles(styles)(Map);
