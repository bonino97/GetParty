import React, { useContext, useMemo, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';

import { Link } from 'react-router-dom';

import reducer from 'app/main/parties/store';

import { useClient } from 'graphql/client';
import { GET_PINS_QUERY } from 'graphql/queries';

import Context from 'app/AppContext';
import { PIN_DELETED_SUBSCRIPTION } from 'graphql/subscriptions';

const useStyles = makeStyles((theme) => ({
  header: {
    background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
  headerIcon: {
    position: 'absolute',
    top: -64,
    left: 0,
    opacity: 0.04,
    fontSize: 512,
    width: 512,
    height: 512,
    pointerEvents: 'none',
  },
}));

function Parties(props) {
  const { state, dispatch } = useContext(Context);
  const { pins } = state;

  const classes = useStyles(props);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const client = useClient();

  useEffect(() => {
    getPins();
  }, []);

  function handleSelectedCategory(event) {
    setSelectedCategory(event.target.value);
  }

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    dispatch({ type: 'GET_PINS', payload: getPins });
  };

  return (
    <>
      <div className='flex flex-col flex-auto flex-shrink-0 w-full'>
        {/* Header */}
        <div
          className={clsx(
            classes.header,
            'relative overflow-hidden flex flex-shrink-0 items-center justify-center h-200 sm:h-288'
          )}
        >
          <div className='flex flex-col max-w-2xl mx-auto w-full p-24 sm:p-32'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0 } }}
            >
              <Typography
                color='inherit'
                className='text-24 sm:text-44 font-bold tracking-tight'
              >
                Welcome to Get Party ~
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
            >
              <Typography
                color='inherit'
                className='text-12 sm:text-14 mt-8 sm:mt-16 opacity-75 leading-tight sm:leading-loose'
              >
                Our courses will step you through the process of building a
                small application, or adding a new feature to an existing
                application. Our courses will step you through the process of
                building a small application, or adding a new feature to an
                existing application.
              </Typography>
            </motion.div>
          </div>

          <Icon className={classes.headerIcon}> audiotrack </Icon>
        </div>
        <div className='flex flex-col flex-1 max-w-2xl w-full mx-auto px-8 sm:px-16 py-24'>
          {/* Filters */}
          <div className='flex flex-col flex-shrink-0 sm:flex-row items-center justify-between py-24'>
            <TextField
              label='Search for a course'
              placeholder='Enter a keyword...'
              className='flex w-full sm:w-320 mb-16 sm:mb-0 mx-16'
              value={searchText}
              inputProps={{
                'aria-label': 'Search',
              }}
              onChange={handleSearchText}
              variant='outlined'
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl
              className='flex w-full sm:w-320 mx-16'
              variant='outlined'
            >
              <InputLabel htmlFor='category-label-placeholder'>
                Category
              </InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleSelectedCategory}
                input={
                  <OutlinedInput
                    labelWidth={9}
                    name='category'
                    id='category-label-placeholder'
                  />
                }
              >
                <MenuItem value='all'>
                  <em> All </em>
                </MenuItem>
                <MenuItem value='category2'>Category 2</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* Parties */}
          {useMemo(() => {
            const container = {
              show: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            };

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
            return pins && pins.length > 0 ? (
              <motion.div
                className='flex flex-wrap py-24'
                variants={container}
                initial='hidden'
                animate='show'
              >
                {pins.map((pin) => {
                  console.log(pin);
                  return (
                    <motion.div
                      variants={item}
                      className='w-full pb-24 sm:w-1/2 lg:w-1/3 sm:p-16'
                      key={pin?._id}
                    >
                      <Card className='flex flex-col h-256 shadow'>
                        <div
                          className='flex flex-shrink-0 items-center justify-between px-24 h-64'
                          style={{
                            background:
                              'linear-gradient(to right, #FD991B 0%, #FEBE3E 100%)',
                            color: 'black',
                          }}
                        >
                          <Typography
                            className='font-medium truncate'
                            color='inherit'
                          >
                            {/* Web */}
                          </Typography>
                          <div className='flex items-center justify-center opacity-75'>
                            <Icon className='text-20 mx-8' color='inherit'>
                              access_time
                            </Icon>
                            <div className='text-14 font-medium whitespace-nowrap'>
                              {formatDistanceToNowStrict(
                                Number(pin?.createdAt)
                              ) + ' ago'}
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
                        <CardActions className='justify-center pb-24'>
                          <Button
                            to={`/apps/academy/courses/1/angular`}
                            component={Link}
                            className='justify-start px-32'
                            color='primary'
                            variant='outlined'
                          >
                            More →
                          </Button>
                        </CardActions>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className='flex flex-1 items-center justify-center'>
                <Typography color='textSecondary' className='text-24 my-24'>
                  No parties found!
                </Typography>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default withReducer('academyApp', reducer)(Parties);
