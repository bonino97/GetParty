import React, { useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Context from 'app/AppContext';

import './Comments.css';

const Comments = ({ classes }) => {
  const { state } = useContext(Context);
  const { currentPin } = state;
  const { comments } = currentPin;
  console.log(comments);
  return (
    comments &&
    comments?.length > 0 && (
      <div>
        <div className='flex items-center'>
          <Typography>{comments?.length} comments</Typography>
          <Icon className='text-16 mx-4' color='action'>
            keyboard_arrow_down
          </Icon>
        </div>
        <List className='list-style'>
          {comments?.map((comment) => (
            <div key={comment?._id}>
              <ListItem className='px-0 -mx-8'>
                <Avatar
                  alt={comment?.author?.name}
                  src={comment?.author?.picture}
                  className='mx-8'
                />
                <ListItemText
                  className='px-4'
                  primary={
                    <div className='flex'>
                      <Typography
                        className='font-semibold'
                        color='initial'
                        paragraph={false}
                      >
                        {comment.author?.name}
                      </Typography>
                      <Typography className='ml-10' variant='caption'>
                        {new Date(Number(comment?.createdAt)).toDateString()}
                      </Typography>
                    </div>
                  }
                  secondary={comment?.text}
                />
              </ListItem>
              <div className='flex items-center mx-52 mb-8'>
                <Button>Reply</Button>
                <Icon className='text-14 mx-8 cursor-pointer'>flag</Icon>
              </div>
            </div>
          ))}
        </List>
      </div>
    )
  );
};

const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
});

export default Comments;
