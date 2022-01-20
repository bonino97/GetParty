import React from 'react';
import PersonPinCircleSharpIcon from '@material-ui/icons/PersonPinCircleSharp';
import NavigationIcon from '@material-ui/icons/Navigation';
import FiberManualRecordTwoToneIcon from '@material-ui/icons/FiberManualRecordTwoTone';

export default ({ size, color, onClick }) => (
  <FiberManualRecordTwoToneIcon
    onClick={onClick}
    style={{ fontSize: size, color }}
  />
);
