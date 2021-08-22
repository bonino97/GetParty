import React from 'react';
import PersonPinCircleSharpIcon from '@material-ui/icons/PersonPinCircleSharp';
import NavigationIcon from '@material-ui/icons/Navigation';

export default ({ size, color, onClick }) => (
  <NavigationIcon
    onClick={onClick}
    style={{ fontSize: size, color }}
  />
);
