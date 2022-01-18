import React, { useContext, useRef, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Context from 'app/AppContext';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';

import './Comments.css';

const Comments = ({}) => {
  const { state } = useContext(Context);
  const { currentPin } = state;
  const { comments } = currentPin;
  const commentRef = useRef(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const scrollToBottom = () => {
    commentRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCommentsView = () => {
    if (comments && comments?.length > 0) {
      return (
        <>
          <div className='flex items-center'>
            <Typography>{comments?.length} comments</Typography>
            <Icon className='text-16 mx-4' color='action'>
              keyboard_arrow_down
            </Icon>
          </div>
          <List ref={commentRef} className='list-style'>
            {comments?.map((comment) => (
              <div key={comment?.createdAt}>
                <ListItem className='px-0 -mx-8'>
                  <Avatar
                    alt={comment?.author?.name}
                    src={comment?.author?.picture}
                    className='mx-8'
                  />
                  <ListItemText
                    className='px-4'
                    primary={
                      <div className='grid grid-flow-row auto-rows-max md:auto-rows-min mb-16'>
                        <div>
                          <Typography
                            className='font-semibold'
                            color='initial'
                            paragraph={false}
                          >
                            {comment.author?.name}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant='caption'>
                            {formatDistanceToNowStrict(
                              Number(comment?.createdAt)
                            )}{' '}
                            ago
                          </Typography>
                        </div>
                      </div>
                    }
                    secondary={comment?.text}
                  />
                </ListItem>
                <div className='flex items-center mx-52 mb-8'>
                  <Icon className='text-14 cursor-pointer'>flag</Icon>
                </div>
              </div>
            ))}
          </List>
        </>
      );
    }

    if ((comments && comments?.length === 0) || !comments) {
      return (
        <div className='row text-center justify-center'>
          <div className='col'>
            <Typography size='large' className='mb-8'>
              No comments, be the first!
            </Typography>
          </div>
        </div>
      );
    }
  };
  return handleCommentsView();
};

export default Comments;
