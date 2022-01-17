import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import './Comments.css';

const Comments = ({ classes }) => {
  const comments = [
    {
      id: '1',
      user: {
        name: 'Alice Freeman',
        avatar: 'assets/images/avatars/alice.jpg',
      },
      time: 'June 10, 2015',
      message:
        'That’s a wonderful place. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat. That’s a wonderful place. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat.That’s a wonderful place. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat.That’s a wonderful place. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat.',
    },
  ];
  return (
    comments &&
    comments.length > 0 && (
      <div>
        <div className='flex items-center'>
          <Typography>{comments.length} comments</Typography>
          <Icon className='text-16 mx-4' color='action'>
            keyboard_arrow_down
          </Icon>
        </div>
        <List className='list-style'>
          {comments.map((comment) => (
            <div key={comment.id}>
              <ListItem className='px-0 -mx-8'>
                <Avatar
                  alt={comment.user.name}
                  src={comment.user.avatar}
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
                        {comment.user.name}
                      </Typography>
                      <Typography className='ml-36' variant='caption'>
                        {comment.time}
                      </Typography>
                    </div>
                  }
                  secondary={comment.message}
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
