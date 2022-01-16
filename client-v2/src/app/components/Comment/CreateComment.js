import React, { useState } from 'react';

import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

const CreateComment = ({ classes }) => {
  const [comment, setComment] = useState('');

  const onCommentSubmit = (e) => {
    e.preventDefault();
    if (comment === '') {
      return;
    }

    console.log('enter: ', comment);
  };

  const onInputChange = (e) => {
    console.log(e.target.value);
    setComment(e.target.value);
  };

  return (
    <form
      onSubmit={onCommentSubmit}
      className='absolute bottom-0 right-0 left-0 py-16 px-8'
    >
      {/* <Paper className='flex items-center relative rounded-24 shadow border border-white'>
        <TextField
          autoFocus={false}
          id='message-input'
          className='flex-1'
          InputProps={{
            disableUnderline: true,
            classes: {
              root: 'flex flex-grow flex-shrink-0 mx-16 ltr:mr-48 rtl:ml-48 my-8',
              input: '',
            },
            placeholder: 'Type your message',
          }}
          InputLabelProps={{
            shrink: false,
          }}
          onChange={onInputChange}
          value={comment}
        />
        <IconButton
          className='absolute ltr:right-0 rtl:left-0 top-0'
          type='submit'
        >
          <Icon className='text-24' color='action'>
            send
          </Icon>
        </IconButton>
      </Paper> */}

      <div className='flex flex-auto -mx-4'>
        <Avatar className='mx-4' src='assets/images/avatars/profile.jpg' />
        <div className='flex-1 mx-4'>
          <Paper className='w-full mb-16 shadow-0'>
            <Input
              className='p-8 w-full border-1 rounded-8'
              classes={{ root: 'text-13' }}
              placeholder='Add a comment..'
              multiline
              rows='6'
              margin='none'
              disableUnderline
              onChange={onInputChange}
              value={comment}
            />
          </Paper>
          <Button variant='contained' color='primary' size='small'>
            Send Comment
          </Button>
        </div>
      </div>
    </form>
  );
};

const styles = (theme) => ({
  form: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  clearButton: {
    padding: 0,
    color: 'red',
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark,
  },
});

export default withStyles(styles)(CreateComment);
