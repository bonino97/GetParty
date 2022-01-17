import React, { useState, useContext } from 'react';

import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

import Context from 'app/AppContext';

import { CREATE_COMMENT_MUTATION } from 'graphql/mutations';
import { useAuthClient } from 'graphql/authClient';

const CreateComment = ({ classes }) => {
  const client = useAuthClient();

  const { state, dispatch } = useContext(Context);
  const { currentUser, currentPin } = state;
  const [comment, setComment] = useState('');

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (comment === '') {
      return;
    }

    const createCommentProps = { pinId: currentPin?._id, text: comment };
    const { createComment } = await client.request(
      CREATE_COMMENT_MUTATION,
      createCommentProps
    );

    dispatch({ type: 'CREATE_COMMENT', payload: createComment });
    setComment('');
  };

  const onInputChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmitComment}
      className='bottom-0 right-0 left-0 py-16 px-8'
    >
      <div className='flex flex-auto -mx-4'>
        <Avatar className='mx-4' src={currentUser?.picture} />
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
          <Button
            variant='contained'
            color='primary'
            size='small'
            disabled={!comment.trim()}
            type='submit'
          >
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
