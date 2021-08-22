import React, { useState, useEffect, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';

// import AudioIcon from './Icons/AudioIcon';

import { useClient } from 'graphql/client';
import { GET_PINS_QUERY } from 'graphql/queries';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';

import PinIcon from 'app/components/Icons/PinIcon';
import PersonIcon from 'app/components/Icons/PersonIcon';
import CreateParty from 'app/components/Pin/CreateParty';
import Context from 'app/AppContext';

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
  const [userPosition, setUserPosition] = useState();

  useEffect(() => {
    getUserPosition();
  }, []);

  const [popup, setPopup] = useState(null);

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    console.log(getPins);
    dispatch({ type: 'GET_PINS', payload: getPins });
  };

  const getUserPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setViewport({ latitude, longitude, zoom: 13 });
        setUserPosition({ latitude, longitude });
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
    return 'red';
  };

  const handleSelectedPin = (pin) => {
    setPopup(pin);
    console.log(pin);
    dispatch({ type: 'SET_PIN', payload: pin });
  };

  const isAuthUser = () => state.currentUser._id === popup.author._id;

  return (
    <div className={classes.root}>
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
            <PinIcon
              size={35}
              color={getPinStatus(pin)}
              onClick={() => handleSelectedPin(pin)}
            ></PinIcon>
          </Marker>
        ))}

        {/* Popup dialog for created pins */}
        {popup && (
          <Popup
            anchor='top'
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            {popup.image ? (
              <img
                className={classes.popupImage}
                src={popup.image}
                alt='GetParty'
              />
            ) : null}
            <div className={classes.popupTab}>
              <Typography className={classes.blackText}>
                {popup.title}
              </Typography>
              {isAuthUser() && (
                <Button>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGL>
      <CreateParty />
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
