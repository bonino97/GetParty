import axios from 'axios';
import { MAPBOX_TOKEN } from 'app/constants/MapboxData';

export const getReverseGeocodingData = async (lat, long) => {
  try {
    const res = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${MAPBOX_TOKEN}`
    );

    if (res?.status <= 200 && res?.status >= 300) return false;

    const { data } = res;

    if (!data) return false;

    const { features } = data;

    if (!features) return false;

    let completeAddress = features?.filter((place) =>
      place?.place_type?.includes('address')
    )[0];

    let address;

    if (completeAddress) {
      const number = completeAddress?.address ? completeAddress?.address : '';
      const street = completeAddress?.text ? completeAddress?.text : '';
      address = number + ' ' + street;
    }

    if (!completeAddress) {
      address =
        features?.filter((place) => place?.place_type?.includes('poi'))[0]
          ?.properties?.address || '';
    }

    const city =
      features?.filter((place) => place?.place_type?.includes('place'))[0]
        ?.text || '';
    const state =
      features?.filter((place) => place?.place_type?.includes('region'))[0]
        ?.text || '';
    const zipCode =
      features?.filter((place) => place?.place_type?.includes('postcode'))[0]
        ?.text || '';
    const country =
      features?.filter((place) => place?.place_type?.includes('country'))[0]
        ?.text || '';

    const location = {
      address,
      city,
      state,
      zipCode,
      country,
    };
    return location;
  } catch (error) {
    console.error(error);
    return false;
  }
};
