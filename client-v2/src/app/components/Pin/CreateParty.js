import React, { useContext, useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Icon,
  Typography,
  Toolbar,
  AppBar,
} from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import Context from 'app/AppContext';
import { useClient } from 'graphql/client';
import { CREATE_PIN_MUTATION } from 'graphql/mutations';

function CreateParty({ classes }) {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const { draft } = state;

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setSubmitting(true);

      const url = await handleImageUpload();
      const { latitude, longitude } = state.draft;

      const createPinInput = {
        title,
        image: url,
        content,
        latitude,
        longitude,
      };
      const { createPin } = await client.request(
        CREATE_PIN_MUTATION,
        createPinInput
      );

      dispatch({ type: 'CREATE_PIN', payload: createPin });
      handleDeleteDraft();
    } catch (error) {
      setSubmitting(false);
      console.error('Error creating party: ', error);
    }
  };

  const handleDeleteDraft = () => {
    setSubmitting(false);
    setTitle('');
    setImage('');
    setContent('');
    dispatch({ type: 'DELETE_DRAFT' });
  };

  const handleImageUpload = async () => {
    try {
      const uploadPreset = 'getpartyapp';
      const cloudName = 'dpu5kohkp';

      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', uploadPreset);
      data.append('cloud_name', cloudName);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        data
      );

      return res.data.url;
    } catch (error) {
      console.error('Error uploading image: ', error);
      return;
    }
  };

  return draft ? (
    <Dialog open={true} aria-labelledby='form-dialog-title'>
      <AppBar position='static'>
        <Toolbar className='flex w-full'>
          <Typography variant='subtitle1' color='inherit'>
            Party Location
          </Typography>
          <Icon>audiotrack</Icon>
        </Toolbar>
      </AppBar>

      <form className={classes.form}>
        <DialogContent classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}>
          <TextField
            className='mt-8 mb-16'
            name='title'
            label='Title'
            placeholder='Whats the name of the party?'
            type='text'
            onChange={(e) => setTitle(e.target.value)}
            variant='outlined'
            fullWidth
          />
          <TextField
            className='mt-8 mb-16'
            name='content'
            label='Description'
            placeholder='Description of party.'
            type='text'
            multiline
            rows={5}
            variant='outlined'
            fullWidth
            onChange={(e) => setContent(e.target.value)}
          />
          <div>
            <input
              accept='image/*'
              id='image'
              type='file'
              className={classes.input}
              onChange={(e) => setImage(e.target.files[0])}
            />
            <label
              htmlFor='image'
              className={clsx(
                classes.productImageUpload,
                'flex items-center justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5'
              )}
            >
              <Icon
                fontSize='large'
                color='action'
                style={{ color: image && '#FEBE3E' }}
              >
                cloud_upload
              </Icon>
            </label>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='secondary'
            className={classes.button}
            onClick={handleDeleteDraft}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant='outlined'
            size='medium'
            disabled={!title.trim() || !content.trim() || submitting}
            type='submit'
          >
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
  productImageFeaturedStar: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: orange[400],
    opacity: 0,
  },
  productImageUpload: {
    transitionProperty: 'box-shadow',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },
  productImageItem: {
    transitionProperty: 'box-shadow',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    '&:hover': {
      '& $productImageFeaturedStar': {
        opacity: 0.8,
      },
    },
    '&.featured': {
      pointerEvents: 'none',
      boxShadow: theme.shadows[3],
      '& $productImageFeaturedStar': {
        opacity: 1,
      },
      '&:hover $productImageFeaturedStar': {
        opacity: 1,
      },
    },
  },
});

export default withStyles(styles)(CreateParty);
