import React, { useContext, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddAPhotoIcon from '@material-ui/icons/AddAPhotoTwoTone';

import Context from 'app/AppContext';

function CreateParty({ classes }) {
  const { state, dispatch } = useContext(Context);
  const { draft } = state;

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ title, image, content });
  };

  const handleDeleteDraft = () => {
    setTitle('');
    setImage('');
    setContent('');
    dispatch({ type: 'DELETE_DRAFT' });
  };

  return draft ? (
    <Dialog open={true} aria-labelledby='form-dialog-title'>
      <form className={classes.form}>
        <DialogTitle id='form-dialog-title'>Party Location</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              name='title'
              label='Title'
              placeholder='Insert party title'
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              accept='image/*'
              id='image'
              type='file'
              className={classes.input}
              onChange={(e) => setImage(e.target.files[0])}
            />
            <label htmlFor='image'>
              <Button
                component='span'
                size='small'
                className={classes.button}
                style={{ color: image && '#9f01ff' }}
              >
                <AddAPhotoIcon />
              </Button>
            </label>
          </div>
          <div className={classes.contentField}>
            <TextField
              name='content'
              label='Content'
              multiline
              rows='6'
              margin='normal'
              fullWidth
              variant='outlined'
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDraft} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color='primary'>
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  ) : null;
}

const styles = (theme) => ({
  form: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: theme.spacing(1),
  },
  contentField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '95%',
  },
  input: {
    display: 'none',
  },
  sidebarTitle: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '2rem',
    color: '#9f01ff',
    borderBottom: '2px solid #9f01ff',
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing(1),
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(1),
    marginLeft: 0,
  },
  discardButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(1),
    marginLeft: 0,
    backgroundColor: '#9f01ff',
  },
});

export default withStyles(styles)(CreateParty);
