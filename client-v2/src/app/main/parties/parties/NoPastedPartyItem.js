import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';

import { Link } from 'react-router-dom';

import { intervalToDuration, formatDistance } from 'date-fns';

const NoPastedPartyItem = (pin) => {
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

  return (
    <motion.div
      variants={item}
      className='w-full pb-24 sm:w-1/2 lg:w-1/3 sm:p-16'
    >
      <Card className='flex flex-col h-256 shadow'>
        <div
          className='flex flex-shrink-0 items-center justify-between px-24 h-64'
          style={{
            background: 'linear-gradient(to right, #FD991B 0%, #FEBE3E 100%)',
            color: 'black',
          }}
        >
          <Typography className='font-medium truncate' color='inherit'>
            {pin?.title}
          </Typography>
          <div className='flex items-center justify-center opacity-75'>
            <Icon className='text-20 mx-8' color='inherit'>
              access_time
            </Icon>
            <div className='text-14 font-medium whitespace-nowrap'>
              {formatDistance(new Date(pin?.startDate), new Date(), {
                addSuffix: true,
              })}
            </div>
          </div>
        </div>
        <CardContent className='flex flex-col flex-auto items-center justify-center'>
          <Typography className='text-center text-16 font-medium'>
            {pin?.title}
          </Typography>
          <Typography
            className='text-center text-13 mt-8 font-normal'
            color='textSecondary'
          >
            Ultima Actualizacion del Curso
          </Typography>
        </CardContent>
        <CardActions disableSpacing className='flex space-x-0.5 h-auto w-auto'>
          <Button
            size='small'
            className='item w-1/4 h-auto'
            aria-label='Add to favorites'
          >
            <Icon className='text-16' color='action'>
              favorite
            </Icon>
            <Typography className='mx-4'></Typography>
            <Typography>(100)</Typography>
          </Button>
          <Button className='item w-1/4 h-auto' aria-label='Share'>
            <Icon className='text-16' color='action'>
              share
            </Icon>
            <Typography className='mx-4'></Typography>
            <Typography>(10)</Typography>
          </Button>
          <Button
            to={`/apps/academy/courses/1/angular`}
            component={Link}
            className='item w-1/4 h-auto'
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

export default NoPastedPartyItem;
