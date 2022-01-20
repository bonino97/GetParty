import React from 'react';
import Typography from '@material-ui/core/Typography';

const NoParties = () => {
  return (
    <div className='flex flex-1 items-center justify-center'>
      <Typography color='textSecondary' className='text-24 my-24'>
        No parties found!
      </Typography>
    </div>
  );
};

export default NoParties;
