export const openGoogleMaps = (pin, currentLocation) => {
  const url = `https://www.google.com/maps/dir/${currentLocation?.latitude},${currentLocation?.longitude}/${pin?.latitude},${pin?.longitude}`;
  window.open(url, '_blank');
};
