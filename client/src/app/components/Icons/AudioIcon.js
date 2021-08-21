import React from 'react';
import AudiotrackOutlinedIcon from '@material-ui/icons/AudiotrackOutlined';

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ size, color, onClick }) => (
  <AudiotrackOutlinedIcon onClick={onClick} style={{ fontSize: size, color }} />
);
