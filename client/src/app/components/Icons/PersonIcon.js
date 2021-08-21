import React from 'react';
import PersonPinCircleSharpIcon from '@material-ui/icons/PersonPinCircleSharp';

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ size, color, onClick }) => (
  <PersonPinCircleSharpIcon onClick={onClick} style={{ fontSize: size, color }} />
);
