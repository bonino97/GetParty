import React from 'react';
import PersonPinCircleSharpIcon from '@material-ui/icons/PersonPinCircleSharp';

export default ({ size, color, onClick }) => (
  <PersonPinCircleSharpIcon
    onClick={onClick}
    style={{ fontSize: size, color }}
  />
);
