import React from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import { motion } from 'framer-motion';

import { Link } from 'react-router-dom';

import { intervalToDuration, formatDistance, intlFormat } from 'date-fns';

const NoStartedPartyItem = (pin) => {
  const item = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
    },
  };

  console.log(
    intervalToDuration({
      start: new Date(pin.startDate),
      end: new Date(pin.endDate),
    })
  );

  const getPriceOfTicket = () => {
    if (pin?.priceOfTicket === 0) {
      return (
        <div className='flex flex-row '>
          <Icon className='text-16 mt-1 mr-2' color='inherit'>
            money_off
          </Icon>
          <div>Free</div>
        </div>
      );
    }

    if (pin?.priceOfTicket > 0) {
      return (
        <div className='flex flex-row '>
          <Icon className='text-16 mt-1 mr-2' color='inherit'>
            attach_money
          </Icon>
          <div>{pin?.priceOfTicket}</div>
        </div>
      );
    }
    return 'Free';
  };

  return (
    <motion.div
      variants={item}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.1 } }}
    >
      <Card
        component={motion.div}
        variants={{
          hidden: { opacity: 0, y: 40 },
          show: { opacity: 1, y: 0 },
        }}
        key={pin?._id}
        className='mb-32 ml-10 overflow-hidden rounded-16 shadow'
      >
        <CardHeader
          avatar={<Avatar aria-label='Recipe' src={pin?.author?.picture} />}
          action={
            <IconButton aria-label='more'>
              <Icon>favorite_border</Icon>
            </IconButton>
          }
          title={
            <span className='flex'>
              <Typography
                className='font-normal'
                color='primary'
                paragraph={false}
              >
                {pin?.author?.name}
              </Typography>
            </span>
          }
          subheader={
            <div className='flex flex-row opacity-75'>
              <Icon className='text-16 mt-1 mr-4' color='inherit'>
                access_time
              </Icon>
              <div>
                {formatDistance(new Date(pin?.startDate), new Date(), {
                  addSuffix: true,
                })}
              </div>
            </div>
          }
        />

        <CardContent className='py-0'>
          {pin?.image && (
            <div className='border-1 rounded-8 overflow-hidden'>
              <img
                className='w-full border-b-1'
                src={pin?.image}
                alt='article'
              />
            </div>
          )}
          <div className='flex flex-col items-center p-16'>
            <Typography variant='subtitle1'>{pin?.title}</Typography>
            <Typography variant='caption'>
              {intlFormat(
                new Date(pin?.startDate),
                {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                },
                {
                  locale: 'en-US',
                }
              )}
            </Typography>
            <Typography className='mt-16'>{pin?.content}</Typography>
          </div>
          <div className='flex flex-col p-16'>
            <Typography variant='caption'>{getPriceOfTicket()}</Typography>
          </div>
        </CardContent>

        <CardActions
          disableSpacing
          className='flex space-x-0.5 h-auto w-auto p-12'
        >
          <Button className='item w-1/2 h-auto' aria-label='Share'>
            <Icon className='text-16' color='action'>
              share
            </Icon>
            <Typography className='mx-4'>Share</Typography>
            <Typography>(35)</Typography>
          </Button>
          <Button
            to={`/apps/academy/courses/1/angular`}
            component={Link}
            className='item w-1/2 h-auto'
            color='primary'
            variant='outlined'
          >
            More →
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default NoStartedPartyItem;
