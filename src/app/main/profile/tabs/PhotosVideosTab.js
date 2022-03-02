import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function PhotosVideosTab() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData([
      {
        id: '1',
        name: 'June 2018',
        info: '5 Photos',
        media: [
          {
            type: 'photo',
            title: 'A Walk Amongst Friends',
            preview: 'assets/images/profile/a-walk-amongst-friends-small.jpg',
          },
          {
            type: 'photo',
            title: 'Braies Lake',
            preview: 'assets/images/profile/braies-lake-small.jpg',
          },
          {
            type: 'photo',
            title: 'Fall Glow',
            preview: 'assets/images/profile/fall-glow-small.jpg',
          },
          {
            type: 'photo',
            title: 'First Snow',
            preview: 'assets/images/profile/first-snow-small.jpg',
          },
          {
            type: 'photo',
            title: 'Lago di Braies',
            preview: 'assets/images/profile/lago-di-braies-small.jpg',
          },
        ],
      },
      {
        id: '2',
        name: 'May 2018',
        info: '7 Photos, 3 Videos',
        media: [
          {
            type: 'photo',
            title: 'Lago di Sorapis',
            preview: 'assets/images/profile/lago-di-sorapis-small.jpg',
          },
          {
            type: 'photo',
            title: 'Morain Lake',
            preview: 'assets/images/profile/morain-lake-small.jpg',
          },
          {
            type: 'photo',
            title: 'Never Stop Changing',
            preview: 'assets/images/profile/never-stop-changing-small.jpg',
          },
          {
            type: 'photo',
            title: 'Reaching',
            preview: 'assets/images/profile/reaching-small.jpg',
          },
          {
            type: 'photo',
            title: 'Yosemite',
            preview: 'assets/images/profile/yosemite-small.jpg',
          },
          {
            type: 'photo',
            title: 'A Walk Amongst Friends',
            preview: 'assets/images/profile/a-walk-amongst-friends-small.jpg',
          },
          {
            type: 'photo',
            title: 'Braies Lake',
            preview: 'assets/images/profile/braies-lake-small.jpg',
          },
          {
            type: 'photo',
            title: 'Fall Glow',
            preview: 'assets/images/profile/fall-glow-small.jpg',
          },
          {
            type: 'photo',
            title: 'First Snow',
            preview: 'assets/images/profile/first-snow-small.jpg',
          },
          {
            type: 'photo',
            title: 'Lago di Braies',
            preview: 'assets/images/profile/lago-di-braies-small.jpg',
          },
        ],
      },
      {
        id: '3',
        name: 'April 2018',
        info: '7 Photos',
        media: [
          {
            type: 'photo',
            title: 'Lago di Sorapis',
            preview: 'assets/images/profile/lago-di-sorapis-small.jpg',
          },
          {
            type: 'photo',
            title: 'Morain Lake',
            preview: 'assets/images/profile/morain-lake-small.jpg',
          },
          {
            type: 'photo',
            title: 'Never Stop Changing',
            preview: 'assets/images/profile/never-stop-changing-small.jpg',
          },
          {
            type: 'photo',
            title: 'Reaching',
            preview: 'assets/images/profile/reaching-small.jpg',
          },
          {
            type: 'photo',
            title: 'Yosemite',
            preview: 'assets/images/profile/yosemite-small.jpg',
          },
          {
            type: 'photo',
            title: 'A Walk Amongst Friends',
            preview: 'assets/images/profile/a-walk-amongst-friends-small.jpg',
          },
          {
            type: 'photo',
            title: 'Braies Lake',
            preview: 'assets/images/profile/braies-lake-small.jpg',
          },
        ],
      },
    ]);
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
      <div className='md:flex max-w-2xl'>
        <div className='flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32'>
          {data.map((period) => (
            <div key={period.id} className='mb-48'>
              <ListSubheader component={motion.div} variants={item} className='flex items-center px-0 mb-24'>
                <Typography variant='h6' className='font-medium'>
                  {period.name}
                </Typography>
                <Typography className='mx-12 font-normal' variant='subtitle1' color='textSecondary'>
                  {period.info}
                </Typography>
              </ListSubheader>

              <ImageList className='overflow-hidden' gap={16} cols={0}>
                {period.media.map((media) => (
                  <ImageListItem
                    component={motion.div}
                    variants={item}
                    classes={{
                      root: 'w-full sm:w-1/2 md:w-1/4',
                      item: 'rounded-16 shadow',
                    }}
                    key={media.preview}
                  >
                    <img src={media.preview} alt={media.title} />
                    <ImageListItemBar
                      title={media.title}
                      actionIcon={
                        <IconButton>
                          <Icon className='text-white opacity-75'>info</Icon>
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default PhotosVideosTab;
