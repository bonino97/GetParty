import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { useParams } from 'react-router';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { useClient } from 'graphql/client';

import { showMessage } from 'app/store/fuse/messageSlice';

import { handleErrors } from 'app/services/errorService/handleErrors';
import { CONFIRM_ACCOUNT_MUTATION } from 'graphql/mutations';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const ConfirmAccount = () => {
  const classes = useStyles();
  const { token } = useParams();
  const [error, setError] = useState(false);
  const client = useClient();
  const reduxDispatch = useDispatch();

  useEffect(async () => {
    await onConfirmAccount();
  }, []);

  const onConfirmAccount = async () => {
    try {
      const input = { token };
      const { confirmAccount } = await client?.request(CONFIRM_ACCOUNT_MUTATION, input);
      if (confirmAccount) {
      }
    } catch (error) {
      setError(true);
      if (handleErrors(error)) {
        const { message } = handleErrors(error);
        return reduxDispatch(
          showMessage({
            message,
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom', //top bottom
              horizontal: 'right', //left center right
            },
            variant: 'error', //success error info warning null
          })
        );
      }

      return reduxDispatch(
        showMessage({
          message: 'An error ocurred validating account.',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom', //top bottom
            horizontal: 'right', //left center right
          },
          variant: 'error', //success error info warning null
        })
      );
    }
  };

  return (
    <div className={clsx(classes.root, 'flex flex-col flex-auto items-center justify-center p-16 sm:p-32')}>
      <div className='flex flex-col items-center justify-center w-full'>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
          <div className='flex items-center mb-48'>
            <img className='logo-icon mr-4 mb-2 w-48' src='assets/icons/custom/get-party-yellow.png' alt='logo' />
            <div className='border-l-1 mr-4 w-1 h-40' />
            <div>
              <Typography className='text-24 font-semibold logo-text' color='inherit'>
                GET
              </Typography>
              <Typography className='text-16 tracking-widest -mt-8 font-700' color='textSecondary'>
                PARTY
              </Typography>
            </div>
          </div>
        </motion.div>
        {!error && (
          <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className='w-full max-w-384'>
              <CardContent className='flex flex-col items-center justify-center p-16 sm:p-24 md:p-32'>
                <div className='m-32'>
                  <Icon className='text-96' color='action'>
                    check
                  </Icon>
                </div>

                <Typography variant='h5' className='text-center mb-16 font-semibold'>
                  Welcome to Get Party!
                </Typography>

                <Typography className='text-center w-full' color='textSecondary'>
                  Your account has been successfully confirmed.
                </Typography>

                <div className='flex flex-col items-center justify-center pt-32 pb-24'>
                  <Link className='font-normal' to='/login'>
                    Go back to login
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className='w-full max-w-384'>
              <CardContent className='flex flex-col items-center justify-center p-16 sm:p-24 md:p-32'>
                <div className='m-32'>
                  <Icon className='text-96' color='action'>
                    error
                  </Icon>
                </div>

                <Typography variant='h5' className='text-center mb-16 font-semibold'>
                  Welcome to Get Party!
                </Typography>

                <Typography className='text-center w-full' color='textSecondary'>
                  An error ocurred validating your account.
                </Typography>
                <Typography className='text-center w-full' color='textSecondary'>
                  Please, try again, or contact an administrator.
                </Typography>

                <div className='flex flex-col items-center justify-center pt-32 pb-24'>
                  <Link className='font-normal' to='/login'>
                    Go back to login
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ConfirmAccount;
