import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Context from 'app/AppContext';

export default function FormDialog() {
  const { state } = useContext(Context);
  const { draft } = state;
  const [open, setOpen] = useState(false);

  return draft ? (
    <Dialog open={true} onClose={false} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        <TextField
          autoFocus
          margin='dense'
          id='name'
          label='Email Address'
          type='email'
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={false} color='primary'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  ) : null;
}
