import React, { useState, useEffect, useContext } from 'react';

import ReactMapGL, {
  NavigationControl,
  Marker,
  GeolocateControl,
  Source,
  Layer,
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
import CreateParty from 'app/components/Pin/CreateParty';
import PinForm from 'app/components/Pin/PinForm';
import Context from 'app/AppContext';

import PinContent from 'app/components/Pin/PinContent';

import { MAPBOX_TOKEN, MAP_STYLE } from 'app/constants/MapboxData';

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 10,
};

const Map = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const { draft } = state;

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
        console.log(position);
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
    return '#FEBE3E';
  };

  const handleSelectedPin = (pin) => {
    dispatch({ type: 'SET_PIN', payload: pin });
  };

  const data = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [-122.48369693756104, 37.83381888486939],
        [-60.6551805, -32.9419821],
        // [-122.48348236083984, 37.83317489144141],
        // [-122.48339653015138, 37.83270036637107],
        // [-122.48356819152832, 37.832056363179625],
        // [-122.48404026031496, 37.83114119107971],
        // [-122.48404026031496, 37.83049717427869],
        // [-122.48348236083984, 37.829920943955045],
        // [-122.48356819152832, 37.82954808664175],
        // [-122.48507022857666, 37.82944639795659],
        // [-122.48610019683838, 37.82880236636284],
        // [-122.48695850372314, 37.82931081282506],
        // [-122.48700141906738, 37.83080223556934],
        // [-122.48751640319824, 37.83168351665737],
        // [-122.48803138732912, 37.832158048267786],
        // [-122.48888969421387, 37.83297152392784],
        // [-122.48987674713133, 37.83263257682617],
        // [-122.49043464660643, 37.832937629287755],
        // [-122.49125003814696, 37.832429207817725],
        // [-122.49163627624512, 37.832564787218985],
        // [-122.49223709106445, 37.83337825839438],
        // [-122.49378204345702, 37.83368330777276],
      ],
    },
  };

  const paint = {
    'line-color': '#FEBE3E',
    'line-width': 4,
  };

  const layout = {
    'line-join': 'round',
    'line-cap': 'round',
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
            height='100vh'
            style={{ minWidth: '100vw', minHeight: '100vh' }}
            mapStyle={MAP_STYLE}
            onViewportChange={(newViewport) => setViewport(newViewport)}
            onClick={handleMapClick}
            {...viewport}
          >
            <Source id='route' type='geojson' data={data} />
            <Layer
              id='route'
              type='line'
              source='route'
              layout={layout}
              paint={paint}
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

            {/* Pin for user current position */}
            {/* {userPosition && (
              <Marker
                latitude={userPosition.latitude}
                longitude={userPosition.longitude}
                offsetLeft={-19}
                offsetTop={-38}
              >
                {' '}
                <PersonIcon size={25} color='#0953ff'></PersonIcon>
              </Marker>
            )} */}

            {/* Draft Pin */}
            {state?.draft && (
              <Marker
                latitude={state.draft.latitude}
                longitude={state.draft.longitude}
                offsetLeft={-19}
                offsetTop={-38}
              >
                <PinIcon size={35} color='black'></PinIcon>
              </Marker>
            )}

            {state?.pins?.map((pin) => (
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

            {state?.currentPin ? <PinContent pin={state?.currentPin} /> : null}
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

          {draft && <PinForm />}

          {/* <Geocoder
            onSelected={(newViewport) => setViewport(newViewport)}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            position='top-left'
            viewport={viewport}
            value=''
          /> */}
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

export default withStyles(styles)(Map);
