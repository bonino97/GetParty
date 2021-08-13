import React, { useState, useEffect, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl';

import PinIcon from 'app/components/Icons/PinIcon';
import PersonIcon from 'app/components/Icons/PersonIcon';
// import AudioIcon from './Icons/AudioIcon';

import CreateParty from 'app/components/Pin/CreateParty';

import Context from 'app/AppContext';

// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13,
};

const Map = ({ classes }) => {
  const { state, dispatch } = useContext(Context);
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState();

  useEffect(() => {
    getUserPosition();
  }, []);

  const getUserPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
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
};

export default withStyles(styles)(Map);
