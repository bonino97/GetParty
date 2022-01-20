import React, { useContext, useMemo, useEffect, useState } from 'react';

import Masonry from 'react-masonry-css';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { isPast } from 'date-fns';
import { Subscription } from 'react-apollo';

import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

import {
  PIN_ADDED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION,
} from 'graphql/subscriptions';

import Context from 'app/AppContext';

import { CATEGORIES_LIST } from 'app/constants/CategoriesList';

import PartyItem from 'app/components/Party/PartyItem';
import NoParties from 'app/main/parties/parties/NoParties';

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

const Parties = (props) => {
  const { state, dispatch } = useContext(Context);
  const { pins } = state;

  const classes = useStyles(props);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('None');

  const handleSelectedCategory = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchText = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <>
      <div className='flex flex-col flex-auto flex-shrink-0 w-full'>
        {/* Header */}
        <div
          className={clsx(
            classes.header,
            'relative overflow-hidden flex flex-shrink-0 items-center justify-center h-100 sm:h-168'
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
                Parties near Miami, Beach!
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
            >
              <Typography
                color='inherit'
                className='text-12 sm:text-14 mt-8 sm:mt-16 opacity-75 leading-tight sm:leading-loose'
              ></Typography>
            </motion.div>
          </div>

          <Icon className={classes.headerIcon}> audiotrack </Icon>
        </div>
        <div className='flex flex-col flex-1 max-w-2xl w-full mx-auto px-8 sm:px-16 py-24'>
          {/* Filters */}
          <div className='flex flex-col flex-shrink-0 sm:flex-row items-center justify-between py-24'>
            <TextField
              label='Search for a party'
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
                <MenuItem key={'None'} disabled value='None'>
                  <em>None</em>
                </MenuItem>
                {CATEGORIES_LIST &&
                  CATEGORIES_LIST.map((category) => {
                    return (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    );
                  })}
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

            return pins && pins.length > 0 ? (
              <>
                <div className='flex flex-wrap w-full'>
                  <Masonry
                    breakpointCols={{
                      default: 3,
                      1920: 3,
                      1600: 3,
                      1366: 3,
                      1280: 3,
                      960: 2,
                      600: 1,
                      480: 1,
                    }}
                    className='my-masonry-grid flex w-full'
                    columnClassName='my-masonry-grid_column flex flex-col p-0 md:p-8'
                  >
                    {pins.map((pin) => {
                      return (
                        !isPast(new Date(pin?.endDate)) && (
                          <motion.div
                            className='mb-32 ml-10 '
                            key={pin?._id}
                            variants={{
                              hidden: {
                                opacity: 0,
                                y: 20,
                              },
                              show: {
                                opacity: 1,
                                y: 0,
                              },
                            }}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{
                              y: 0,
                              opacity: 1,
                              transition: { delay: 0.1 },
                            }}
                          >
                            <PartyItem {...pin} />
                          </motion.div>
                        )
                      );
                    })}
                  </Masonry>
                </div>
              </>
            ) : (
              <NoParties />
            );
          })}
        </div>
      </div>

      <Subscription
        subscription={PIN_ADDED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinAdded } = subscriptionData?.data;
          dispatch({ type: 'CREATE_PIN', payload: pinAdded });
        }}
      />
      <Subscription
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdated } = subscriptionData?.data;
          dispatch({ type: 'CREATE_COMMENT', payload: pinUpdated });
        }}
      />
      <Subscription
        subscription={PIN_DELETED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinDeleted } = subscriptionData?.data;
          dispatch({ type: 'DELETE_PIN', payload: pinDeleted });
        }}
      />
    </>
  );
};

export default Parties;
