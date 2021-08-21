import React from 'react';
import PlaceTwoTone from '@material-ui/icons/PlaceTwoTone';

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ size, color, onClick }) => (
  <PlaceTwoTone onClick={onClick} style={{ fontSize: size, color }} />
);
