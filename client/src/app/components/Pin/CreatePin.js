import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddAPhotoIcon from '@material-ui/icons/AddAPhotoTwoTone';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/SaveTwoTone';
import Context from 'app/AppContext';

const CreatePin = ({ classes }) => {
  const { dispatch } = useContext(Context);
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

  return (
    <form className={classes.form}>
      <Typography
        className={classes.sidebarTitle}
        component='h2'
        variant='h4'
        color='secondary'
      >
        {/* <LandscapeIcon className={classes.iconLarge} /> */}
        Party Location
      </Typography>
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
      <div>
        <Button
          className={classes.discardButton}
          variant='contained'
          color='primary'
          onClick={handleDeleteDraft}
        >
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>
        <Button
          type='submit'
          className={classes.button}
          variant='contained'
          color='secondary'
          disabled={!title.trim() || !content.trim()}
          onClick={handleSubmit}
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  );
};

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

export default withStyles(styles)(CreatePin);
