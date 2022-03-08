import React, { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from 'react-google-login';

import { GraphQLClient } from 'graphql-request';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import Context from 'app/AppContext';
import { ME_QUERY } from 'graphql/queries';
import { API_URL } from 'app/constants/ApiData';
import { CLIENT_ID } from 'app/constants/GoogleData';
import { LOGIN_MUTATION } from 'graphql/mutations';
import { useClient } from 'graphql/client';

import { showMessage } from 'app/store/fuse/messageSlice';

import { handleErrors } from 'app/services/errorService/handleErrors';

import './Login.css';

const useStyles = makeStyles((theme) => ({
  root: {},
  leftSection: {},
  rightSection: {
    background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(theme.palette.primary.dark, 0.5)} 100%)`,
    color: theme.palette.primary.contrastText,
  },
}));

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  password: yup.string().required('Please enter your password.').min(8, 'Password is too short - should be 8 chars minimum.'),
});

const defaultValues = {
  email: '',
  password: '',
  remember: true,
};

const Login = () => {
  const history = useHistory();

  const classes = useStyles();
  const { state, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const client = useClient();

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
      const { login } = await client?.request(LOGIN_MUTATION, input);
      console.log(login);
      if (login) {
        localStorage.setItem('token', login?.jwt);
        console.log(login);
        reduxDispatch(
          showMessage({
            message: 'User logged in successfully.',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom', //top bottom
              horizontal: 'right', //left center right
            },
            variant: 'success', //success error info warning null
          })
        );

        const user = await getCurrentUser(login);
        console.log(user);
        history.push(`/map`);
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
  const onSuccess = async (googleUser) => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(API_URL, {
        headers: {
          authorization: idToken,
        },
      });
      const { me } = await client.request(ME_QUERY);

      dispatch({ type: 'LOGIN_USER', payload: me });
      dispatch({ type: 'IS_LOGGED_IN', payload: googleUser.isSignedIn() });
      return history.push('/map');
    } catch (error) {
      onFailure(error);
    }
  };
  const onFailure = async (err) => {
    dispatch({ type: 'IS_LOGGED_IN', payload: false });
  };

  const getCurrentUser = async (login) => {
    const authClient = new GraphQLClient(API_URL, {
      headers: {
        authorization: login?.jwt,
      },
    });

    const { me } = await authClient.request(ME_QUERY);

    if (me) {
      dispatch({ type: 'LOGIN_USER', payload: me });
      dispatch({ type: 'IS_LOGGED_IN', payload: true });
    }

    return me;
  };

  return (
    <div className={clsx(classes.root, 'flex flex-col flex-auto items-center justify-center flex-shrink-0 p-16 md:p-24')}>
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        className='flex w-full max-w-400 md:max-w-3xl rounded-20 shadow-2xl overflow-hidden'
      >
        <Card className={clsx(classes.leftSection, 'flex flex-col w-full max-w-sm items-center justify-center shadow-0')} square>
          <CardContent className='flex flex-col items-center justify-center w-full py-96 max-w-320'>
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

            <form name='loginForm' noValidate className='flex flex-col justify-center w-full' onSubmit={handleSubmit(onSubmit)}>
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
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className='mb-16'
                    label='Password'
                    type='password'
                    error={!!errors.password}
                    helperText={errors?.password?.message}
                    variant='outlined'
                    required
                    fullWidth
                  />
                )}
              />

              <div className='flex flex-col sm:flex-row items-center justify-center sm:justify-between'>
                <Controller
                  name='remember'
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormControlLabel label='Remember Me' control={<Checkbox {...field} />} />
                    </FormControl>
                  )}
                />

                <Link className='font-normal' to='/forgot-password'>
                  Forgot Password?
                </Link>
              </div>

              <Button
                variant='contained'
                color='primary'
                className='w-full mx-auto mt-16'
                aria-label='LOG IN'
                disabled={_.isEmpty(dirtyFields) || !isValid || loading}
                type='submit'
              >
                {loading && (
                  <div className={classes.root}>
                    <CircularProgress />
                  </div>
                )}
                {!loading && 'Login'}
              </Button>
            </form>

            <div className='my-24 flex items-center justify-center'>
              <Divider className='w-32' />
              <span className='mx-8 font-semibold'>OR</span>
              <Divider className='w-32' />
            </div>

            {/* <Button
              variant='outlined'
              color='primary'
              size='small'
              className='w-192 mb-8'
            >
              Log in with Google
            </Button> */}

            <GoogleLogin
              clientId={CLIENT_ID}
              onSuccess={onSuccess}
              onFailure={onFailure}
              isSignedIn={true}
              className='w-192 mb-8 border border-black login-button'
              buttonText='Login with Google'
            />

            {/* <Button
              variant='outlined'
              color='primary'
              size='small'
              className='w-192'
            >
              Log in with Facebook
            </Button> */}
          </CardContent>

          <div className='flex flex-col items-center justify-center pb-32'>
            <span className='font-normal'>Don't have an account?</span>
            <Link className='font-normal' to='/register'>
              Create an account
            </Link>
          </div>
        </Card>

        <div className={clsx(classes.rightSection, 'hidden md:flex flex-1 items-center justify-center p-64')}>
          <div className='max-w-320'>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
              <Typography color='inherit' className='text-32 sm:text-44 font-semibold leading-tight'>
                Welcome to <br />
                Get Party!
              </Typography>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
              <Typography variant='subtitle1' color='inherit' className='mt-32 font-medium'>
                Start looking for the party, your party.
              </Typography>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
