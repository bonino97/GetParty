import { useEffect, useState } from 'react';

import axios from 'axios';
import { motion } from 'framer-motion';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

function TimelineTab() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData({
      activities: [
        {
          id: '1',
          user: {
            name: 'Alice Freeman',
            avatar: 'assets/images/avatars/alice.jpg',
          },
          message: 'started following you.',
          time: '13 mins. ago',
        },
        {
          id: '2',
          user: {
            name: 'Andrew Green',
            avatar: 'assets/images/avatars/andrew.jpg',
          },
          message: 'sent you a message.',
          time: 'June 10,2015',
        },
        {
          id: '3',
          user: {
            name: 'Garry Newman',
            avatar: 'assets/images/avatars/garry.jpg',
          },
          message: 'shared a public post with your group.',
          time: 'June 9,2015',
        },
        {
          id: '4',
          user: {
            name: 'Carl Henderson',
            avatar: 'assets/images/avatars/carl.jpg',
          },
          message: 'wants to play Fallout Shelter with you.',
          time: 'June 8,2015',
        },
        {
          id: '5',
          user: {
            name: 'Jane Dean',
            avatar: 'assets/images/avatars/jane.jpg',
          },
          message: 'started following you.',
          time: 'June 7,2015',
        },
        {
          id: '6',
          user: {
            name: 'Juan Carpenter',
            avatar: 'assets/images/avatars/james.jpg',
          },
          message: 'sent you a message.',
          time: 'June 6,2015',
        },
        {
          id: '7',
          user: {
            name: 'Judith Burton',
            avatar: 'assets/images/avatars/joyce.jpg',
          },
          message: 'shared a photo with you.',
          time: 'June 5,2015',
        },
        {
          id: '8',
          user: {
            name: 'Vincent Munoz',
            avatar: 'assets/images/avatars/vincent.jpg',
          },
          message: 'shared a photo with you.',
          time: 'June 4,2015',
        },
      ],
      posts: [
        {
          id: '1',
          user: {
            name: 'Garry Newman',
            avatar: 'assets/images/avatars/garry.jpg',
          },
          message: 'Remember the place we were talking about the other night? Found it!',
          time: '32 minutes ago',
          type: 'post',
          like: 5,
          share: 21,
          media: {
            type: 'image',
            preview: 'assets/images/profile/morain-lake.jpg',
          },
          comments: [
            {
              id: '1',
              user: {
                name: 'Alice Freeman',
                avatar: 'assets/images/avatars/alice.jpg',
              },
              time: 'June 10, 2015',
              message:
                'That’s a wonderful place. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat.',
            },
          ],
        },
        {
          id: '2',
          user: {
            name: 'Andrew Green',
            avatar: 'assets/images/avatars/andrew.jpg',
          },
          message: 'Hey, man! Check this, it’s pretty awesome!',
          time: 'June 12, 2015',
          type: 'article',
          like: 98,
          share: 6,
          article: {
            title: 'Never stop changing!',
            subtitle: 'John Westrock',
            excerpt:
              "John Westrock's new photo album called 'Never stop changing' is published! It features more than 200 photos that will take you right in.",
            media: {
              type: 'image',
              preview: 'assets/images/profile/never-stop-changing.jpg',
            },
          },
          comments: [
            {
              id: '1',
              user: {
                name: 'Alice Freeman',
                avatar: 'assets/images/avatars/alice.jpg',
              },
              time: 'June 10, 2015',
              message:
                'That’s a wonderful place. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat.',
            },
          ],
        },
        {
          id: '3',
          user: {
            name: 'Carl Henderson',
            avatar: 'assets/images/avatars/carl.jpg',
          },
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat. Aenean lorem ex, ultrices sit amet ligula sed...',
          time: 'June 10, 2015',
          type: 'something',
          like: 4,
          share: 1,
        },
      ],
    });
  }, []);

  if (!data) {
    return null;
  }

  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={container} initial='hidden' animate='show'>
      <div className='md:flex'>
        <div className='flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32'>
          <Card component={motion.div} variants={item} className='w-full overflow-hidden rounded-16 shadow mb-32'>
            <Input
              className='p-16 w-full'
              classes={{ root: 'text-14' }}
              placeholder='Write something..'
              multiline
              rows='6'
              margin='none'
              disableUnderline
            />
            <AppBar className='card-footer flex flex-row border-t-1' position='static' color='default' elevation={0}>
              <div className='flex-1 items-center'>
                <IconButton aria-label='Add photo'>
                  <Icon>photo</Icon>
                </IconButton>
                <IconButton aria-label='Mention somebody'>
                  <Icon>person</Icon>
                </IconButton>
                <IconButton aria-label='Add location'>
                  <Icon>location_on</Icon>
                </IconButton>
              </div>

              <div className='p-8'>
                <Button variant='contained' color='primary' size='small' aria-label='post'>
                  Post
                </Button>
              </div>
            </AppBar>
          </Card>

          {data.posts.map((post) => (
            <Card component={motion.div} variants={item} key={post.id} className='mb-32 overflow-hidden rounded-16 shadow'>
              <CardHeader
                avatar={<Avatar aria-label='Recipe' src={post.user.avatar} />}
                action={
                  <IconButton aria-label='more'>
                    <Icon>more_vert</Icon>
                  </IconButton>
                }
                title={
                  <span className='flex'>
                    <Typography className='font-normal' color='primary' paragraph={false}>
                      {post.user.name}
                    </Typography>
                    <span className='mx-4'>
                      {post.type === 'post' && 'posted on your timeline'}
                      {post.type === 'something' && 'shared something with you'}
                      {post.type === 'video' && 'shared a video with you'}
                      {post.type === 'article' && 'shared an article with you'}
                    </span>
                  </span>
                }
                subheader={post.time}
              />

              <CardContent className='py-0'>
                {post.message && (
                  <Typography component='p' className='mb-16'>
                    {post.message}
                  </Typography>
                )}

                {/* {post.media && <img src={post.media.preview} alt='post' className='rounded-8' />} */}

                {post.article && (
                  <div className='border-1 rounded-8 overflow-hidden'>
                    {/* <img className='w-full border-b-1' src={post.article.media.preview} alt='article' /> */}
                    <div className='p-16'>
                      <Typography variant='subtitle1'>{post.article.title}</Typography>
                      <Typography variant='caption'>{post.article.subtitle}</Typography>
                      <Typography className='mt-16'>{post.article.excerpt}</Typography>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardActions disableSpacing className='px-12'>
                <Button size='small' aria-label='Add to favorites'>
                  <Icon className='text-16' color='action'>
                    favorite
                  </Icon>
                  <Typography className='mx-4'>Like</Typography>
                  <Typography>({post.like})</Typography>
                </Button>
                <Button aria-label='Share'>
                  <Icon className='text-16' color='action'>
                    share
                  </Icon>
                  <Typography className='mx-4'>Share</Typography>
                  <Typography>({post.share})</Typography>
                </Button>
              </CardActions>

              <AppBar className='card-footer flex flex-column p-16' position='static' color='default' elevation={0}>
                {post.comments && post.comments.length > 0 && (
                  <div className=''>
                    <div className='flex items-center'>
                      <Typography>{post.comments.length} comments</Typography>
                      <Icon className='text-16 mx-4' color='action'>
                        keyboard_arrow_down
                      </Icon>
                    </div>

                    <List>
                      {post.comments.map((comment) => (
                        <div key={comment.id}>
                          <ListItem className='px-0 -mx-8'>
                            <Avatar alt={comment.user.name} src={comment.user.avatar} className='mx-8' />
                            <ListItemText
                              className='px-4'
                              primary={
                                <div className='flex'>
                                  <Typography className='font-normal' color='initial' paragraph={false}>
                                    {comment.user.name}
                                  </Typography>
                                  <Typography className='mx-4' variant='caption'>
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
                )}

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
                      />
                    </Paper>
                    <Button variant='contained' color='primary' size='small'>
                      Post Comment
                    </Button>
                  </div>
                </div>
              </AppBar>
            </Card>
          ))}
        </div>

        <div className='flex flex-col md:w-320'>
          <Card component={motion.div} variants={item} className='w-full rounded-16 shadow mb-32'>
            <AppBar position='static' elevation={0}>
              <Toolbar className='px-8'>
                <Typography variant='subtitle1' color='inherit' className='flex-1 px-12 font-medium'>
                  Latest Activity
                </Typography>
                <Button color='inherit' size='small' className='font-medium'>
                  See All
                </Button>
              </Toolbar>
            </AppBar>
            <CardContent className='p-0'>
              <List>
                {data.activities.map((activity) => (
                  <ListItem key={activity.id} className='px-12'>
                    <Avatar className='mx-4' alt={activity.user.name} src={activity.user.avatar} />
                    <ListItemText
                      className='flex-1 mx-4'
                      primary={
                        <div className='flex'>
                          <Typography className='font-normal whitespace-nowrap' color='primary' paragraph={false}>
                            {activity.user.name}
                          </Typography>

                          <Typography className='px-4 truncate' paragraph={false}>
                            {activity.message}
                          </Typography>
                        </div>
                      }
                      secondary={activity.time}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default TimelineTab;
