import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { Link, useHistory } from 'react-router-dom';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { RESET_PASSWORD_MUTATION } from 'graphql/mutations';
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
  password: yup.string().required('Please enter your password.').min(8, 'Password is too short - should be 8 chars minimum.'),
  passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const defaultValues = {
  password: '',
  passwordConfirm: '',
};

function ResetPassword() {
  const { state, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const client = useClient();
  const classes = useStyles();
  const reduxDispatch = useDispatch();
  const { token } = useParams();
  const history = useHistory();

  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = async (formValues) => {
    try {
      setLoading(true);
      const input = {
        password: formValues.password,
        token,
      };
      const { resetPassword } = await client?.request(RESET_PASSWORD_MUTATION, input);
      if (resetPassword) {
        reduxDispatch(
          showMessage({
            message: 'Password modified successfully.',
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
        return history.push('/login');
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
                Reset your password
              </Typography>

              <form name='resetForm' noValidate className='flex flex-col justify-center w-full' onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='mb-16'
                      label='Password'
                      type='password'
                      name='password'
                      error={!!errors.password}
                      helperText={errors?.password?.message}
                      variant='outlined'
                      required
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name='passwordConfirm'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='mb-16'
                      label='Repeat Password'
                      type='password'
                      error={!!errors.passwordConfirm}
                      helperText={errors?.passwordConfirm?.message}
                      variant='outlined'
                      required
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
                  {!loading && 'Reset password'}
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
}

export default ResetPassword;
