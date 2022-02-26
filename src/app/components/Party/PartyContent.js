import React, { useState, useContext } from 'react';
import { Dialog, IconButton, Icon } from '@material-ui/core';

import PartyItem from 'app/components/Party/PartyItem';
import Context from 'app/AppContext';

const PartyContent = ({ pin, handleClosePin }) => {
  const [open, setOpen] = useState(true);
  const { dispatch } = useContext(Context);

  const handleClose = () => {
    dispatch({ type: 'SET_PIN', payload: null });
    handleClosePin();
    setOpen(false);
  };

  return (
    <Dialog open={open} aria-labelledby='form-dialog-title' maxWidth='sm' keepMounted onClose={handleClose}>
      {/* <IconButton
        className='fixed top-0 ltr:right-0 rtl:left-0 z-10'
        onClick={handleClose}
      >
        <Icon>close</Icon>
      </IconButton> */}
      <PartyItem {...pin} />
    </Dialog>
  );
};

export default PartyContent;
