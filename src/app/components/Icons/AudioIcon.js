import React from 'react';
import AudiotrackOutlinedIcon from '@material-ui/icons/AudiotrackOutlined';

export default ({ size, color, onClick }) => (
  <AudiotrackOutlinedIcon onClick={onClick} style={{ fontSize: size, color }} />
);
