import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function AboutTab() {
  const [data, setData] = useState(null);
  const test = (x) => x + 1;

  useEffect(() => {
    setData({
      general: {
        gender: 'Male',
        birthday: 'February 30th, 1974',
        locations: ['London, UK', 'New York, USA'],
        about:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget pharetra felis, sed ullamcorper dui. Sed et elementum neque. Vestibulum pellente viverra ultrices. Etiam justo augue, vehicula ac gravida a, interdum sit amet nisl. Integer vitae nisi id nibh dictum mollis in vitae tortor.',
      },
      work: {
        occupation: 'Developer',
        skills: 'C#, PHP, Javascript, Angular, JS, HTML, CSS',
        jobs: [
          {
            company: 'Self-Employed',
            date: '2010 - Now',
          },
          {
            company: 'Google',
            date: '2008 - 2010',
          },
        ],
      },
      contact: {
        address:
          'Ut pharetra luctus est quis sodales. Duis nisi tortor, bibendum eget tincidunt, aliquam ac elit. Mauris nec euismod odio.',
        tel: ['+6 555 6600', '+9 555 5255'],
        websites: ['withinpixels.com'],
        emails: ['mail@withinpixels.com', 'mail@creapond.com'],
      },
      groups: [
        {
          id: '1',
          name: 'Android',
          category: 'Technology',
          members: '1.856.546',
        },
        {
          id: '2',
          name: 'Google',
          category: 'Web',
          members: '1.226.121',
        },
        {
          id: '3',
          name: 'Fallout',
          category: 'Games',
          members: '526.142',
        },
      ],
      friends: [
        {
          id: '1',
          name: 'Garry Newman',
          avatar: 'assets/images/avatars/garry.jpg',
        },
        {
          id: '2',
          name: 'Carl Henderson',
          avatar: 'assets/images/avatars/carl.jpg',
        },
        {
          id: '3',
          name: 'Jane Dean',
          avatar: 'assets/images/avatars/jane.jpg',
        },
        {
          id: '4',
          name: 'Garry Arnold',
          avatar: 'assets/images/avatars/garry.jpg',
        },
        {
          id: '5',
          name: 'Vincent Munoz',
          avatar: 'assets/images/avatars/vincent.jpg',
        },
        {
          id: '6',
          name: 'Alice Freeman',
          avatar: 'assets/images/avatars/alice.jpg',
        },
        {
          id: '7',
          name: 'Andrew Green',
          avatar: 'assets/images/avatars/andrew.jpg',
        },
      ],
    });
  }, []);

  if (!data) {
    return null;
  }

  const { general, work, contact, groups, friends } = data;

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
          <Card component={motion.div} variants={item} className='w-full mb-32 rounded-16 shadow'>
            <AppBar position='static' elevation={0}>
              <Toolbar className='px-8'>
                <Typography variant='subtitle1' color='inherit' className='flex-1 px-12 font-medium'>
                  General Information
                </Typography>
              </Toolbar>
            </AppBar>

            <CardContent>
              <div className='mb-24'>
                <Typography className='font-semibold mb-4 text-15'>Gender</Typography>
                <Typography>{general.gender}</Typography>
              </div>

              <div className='mb-24'>
                <Typography className='font-semibold mb-4 text-15'>Birthday</Typography>
                <Typography>{general.birthday}</Typography>
              </div>

              <div className='mb-24'>
                <Typography className='font-semibold mb-4 text-15'>Locations</Typography>

                {general.locations.map((location) => (
                  <div className='flex items-center' key={location}>
                    <Typography>{location}</Typography>
                    <Icon className='text-16 mx-4' color='action'>
                      location_on
                    </Icon>
                  </div>
                ))}
              </div>

              <div className='mb-24'>
                <Typography className='font-semibold mb-4 text-15'>About Me</Typography>
                <Typography>{general.about}</Typography>
              </div>
            </CardContent>
          </Card>

          <Card component={motion.div} variants={item} className='w-full mb-32 rounded-16 shadow'>
            <AppBar position='static' elevation={0}>
              <Toolbar className='px-8'>
                <Typography variant='subtitle1' color='inherit' className='flex-1 px-12 font-medium'>
                  Work
                </Typography>
              </Toolbar>
            </AppBar>

            <CardContent>
              <div className='mb-24'>
                <Typography className='font-semibold mb-4 text-15'>Occupation</Typography>
                <Typography>{work.occupation}</Typography>
              </div>

              <div className='mb-24'>
                <Typography className='font-semibold mb-4 text-15'>Skills</Typography>
                <Typography>{work.skills}</Typography>
              </div>

              <div className='mb-24'>
                <Typography className='font-semibold mb-4 text-15'>Jobs</Typography>
                <table className=''>
                  <tbody>
                    {work.jobs.map((job) => (
                      <tr key={job.company}>
                        <td>
                          <Typography>{job.company}</Typography>
                        </td>
                        <td className='px-16'>
                          <Typography color='textSecondary'>{job.date}</Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card component={motion.div} variants={item} className='w-full mb-32 rounded-16 shadow'>
            <AppBar position='static' elevation={0}>
              <Toolbar className='px-8'>
                <Typography variant='subtitle1' color='inherit' className='flex-1 px-12 font-medium'>
                  Contact
                </Typography>
              </Toolbar>
            </AppBar>

            <CardContent>
              <div className='mb-24'>
                <Typography className='font-semibold mb-4 text-15'>Address</Typography>
                <Typography>{contact.address}</Typography>
              </div>

              <div className='mb-24'>
                <Typography className='font-semibold mb-4 text-15'>Tel.</Typography>

                {contact.tel.map((tel) => (
                  <div className='flex items-center' key={tel}>
                    <Typography>{tel}</Typography>
                  </div>
                ))}
              </div>

              <div className='mb-24'>
                <Typography className='font-semibold mb-4 text-15'>Website</Typography>

                {contact.websites.map((website) => (
                  <div className='flex items-center' key={website}>
                    <Typography>{website}</Typography>
                  </div>
                ))}
              </div>

              <div className='mb-24'>
                <Typography className='font-semibold mb-4 text-15'>Emails</Typography>

                {contact.emails.map((email) => (
                  <div className='flex items-center' key={email}>
                    <Typography>{email}</Typography>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='flex flex-col md:w-320'>
          <Card component={motion.div} variants={item} className='w-full mb-32 rounded-16 shadow'>
            <AppBar position='static' elevation={0}>
              <Toolbar className='px-8'>
                <Typography variant='subtitle1' color='inherit' className='flex-1 px-12 font-medium'>
                  Friends
                </Typography>
                <Button color='inherit' size='small'>
                  See 454 more
                </Button>
              </Toolbar>
            </AppBar>
            <CardContent className='flex flex-wrap p-16'>
              {friends.map((friend) => (
                <img key={friend.id} className='w-64 m-4 rounded-16 block' src={friend.avatar} alt={friend.name} />
              ))}
            </CardContent>
          </Card>

          <Card component={motion.div} variants={item} className='w-full mb-32 rounded-16 shadow'>
            <AppBar position='static' elevation={0}>
              <Toolbar className='px-8'>
                <Typography variant='subtitle1' color='inherit' className='flex-1 px-12 font-medium'>
                  Joined Groups
                </Typography>
                <Button color='inherit' size='small'>
                  See 6 more
                </Button>
              </Toolbar>
            </AppBar>
            <CardContent className='p-0'>
              <List className='p-0'>
                {groups.map((group) => (
                  <ListItem key={group.id} className='px-8'>
                    <Avatar className='mx-8' alt={group.name}>
                      {group.name[0]}
                    </Avatar>
                    <ListItemText
                      primary={
                        <div className='flex'>
                          <Typography className='font-medium' color='secondary' paragraph={false}>
                            {group.name}
                          </Typography>

                          <Typography className='mx-4 font-normal' paragraph={false}>
                            {group.category}
                          </Typography>
                        </div>
                      }
                      secondary={group.members}
                    />
                    <ListItemSecondaryAction>
                      <IconButton>
                        <Icon>more_vert</Icon>
                      </IconButton>
                    </ListItemSecondaryAction>
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

export default AboutTab;
