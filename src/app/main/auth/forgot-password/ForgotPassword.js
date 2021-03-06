import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

import { FORGOT_PASSWORD_MUTATION } from 'graphql/mutations';
import { useClient } from 'graphql/client';
import Context from 'app/AppContext';

import { showMessage } from 'app/store/fuse/messageSlice';

import { handleErrors } from 'app/services/errorService/handleErrors';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
});

const defaultValues = {
  email: '',
};

const ForgotPassword = () => {
  const { state, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const client = useClient();
  const classes = useStyles();
  const reduxDispatch = useDispatch();

  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = async (formValues) => {
    try {
      setLoading(true);
      const input = formValues;
      const { forgotPassword } = await client?.request(FORGOT_PASSWORD_MUTATION, input);

      if (forgotPassword) {
        reduxDispatch(
          showMessage({
            message: 'Reset link sended successfully, check your email.',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom', //top bottom
              horizontal: 'right', //left center right
            },
            variant: 'success', //success error info warning null
          })
        );

        setLoading(false);
        reset(defaultValues);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
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
          message: 'An error ocurred.',
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
        <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className='w-full max-w-384'>
            <CardContent className='flex flex-col items-center justify-center p-16 sm:p-24 md:p-32'>
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

              <Typography variant='h6' className='mt-16 mb-24 font-semibold text-18 sm:text-24'>
                Recover your password
              </Typography>

              <form name='recoverForm' noValidate className='flex flex-col justify-center w-full' onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='mb-16'
                      label='Email'
                      autoFocus
                      type='email'
                      error={!!errors.email}
                      helperText={errors?.email?.message}
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />

                <Button
                  variant='contained'
                  color='primary'
                  className='w-224 mx-auto mt-16'
                  aria-label='Reset'
                  disabled={_.isEmpty(dirtyFields) || !isValid || loading}
                  type='submit'
                >
                  {loading && (
                    <div className={classes.root}>
                      <CircularProgress />
                    </div>
                  )}
                  {!loading && 'Send reset link'}
                </Button>
              </form>

              <div className='flex flex-col items-center justify-center pt-32 pb-24'>
                <Link className='font-normal' to='/login'>
                  Go back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
