// import React, { useContext } from 'react';
// import { withStyles } from '@material-ui/core/styles';
// import { GoogleLogin } from 'react-google-login';
// import { GraphQLClient } from 'graphql-request';
// import Context from 'app/AppContext';
// import Typography from '@material-ui/core/Typography';
// import { ME_QUERY } from 'graphql/queries';
// import { BASE_URL } from 'graphql/client';

// const Login = ({ classes }) => {
//   const { dispatch } = useContext(Context);

//   const onSuccess = async (googleUser) => {
//     try {
//       const idToken = googleUser.getAuthResponse().id_token;
//       const client = new GraphQLClient(BASE_URL, {
//         headers: {
//           authorization: idToken,
//         },
//       });
//       const { me } = await client.request(ME_QUERY);
//       dispatch({ type: 'LOGIN_USER', payload: me });
//       dispatch({ type: 'IS_LOGGED_IN', payload: googleUser.isSignedIn() });
//     } catch (error) {
//       onFailure(error);
//     }
//   };

//   const onFailure = async (err) => {
//     console.error(err);
//   };

//   return (
//     <div className={classes.root}>
//       <Typography
//         component='h1'
//         variant='h3'
//         gutterBottom
//         noWrap
//         style={{ color: 'rgb(66,133,244)' }}
//       >
//         Welcome
//       </Typography>
//       <GoogleLogin
//         clientId='372691160732-gsoaq00le7f368557s1f0ch2ghfpgoqu.apps.googleusercontent.com'
//         onSuccess={onSuccess}
//         onFailure={onFailure}
//         isSignedIn={true}
//         theme='dark'
//         buttonText='Login with Google'
//       />
//     </div>
//   );
// };

// const styles = {
//   root: {
//     height: '100vh',
//     display: 'flex',
//     justifyContent: 'center',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
// };

// export default withStyles(styles)(Login);

import React, { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

import { GraphQLClient } from 'graphql-request';

import { yupResolver } from '@hookform/resolvers/yup';
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
import _ from '@lodash';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import * as yup from 'yup';

import Context from 'app/AppContext';
import { ME_QUERY } from 'graphql/queries';
import { BASE_URL } from 'graphql/client';

const useStyles = makeStyles((theme) => ({
  root: {},
  leftSection: {},
  rightSection: {
    background: `linear-gradient(to right, ${
      theme.palette.primary.dark
    } 0%, ${darken(theme.palette.primary.dark, 0.5)} 100%)`,
    color: theme.palette.primary.contrastText,
  },
}));

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup
    .string()
    .email('You must enter a valid email')
    .required('You must enter a email'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
});

const defaultValues = {
  email: '',
  password: '',
  remember: true,
};

function Login() {
  const classes = useStyles();
  const { state, dispatch } = useContext(Context);
  console.log(state);
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit() {
    reset(defaultValues);
  }

  const onSuccess = async (googleUser) => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(BASE_URL, {
        headers: {
          authorization: idToken,
        },
      });
      const { me } = await client.request(ME_QUERY);
      console.log(me);
      dispatch({ type: 'LOGIN_USER', payload: me });
      dispatch({ type: 'IS_LOGGED_IN', payload: googleUser.isSignedIn() });
    } catch (error) {
      onFailure(error);
    }
  };

  const onFailure = async (err) => {
    console.error(err);
  };

  return (
    <div
      className={clsx(
        classes.root,
        'flex flex-col flex-auto items-center justify-center flex-shrink-0 p-16 md:p-24'
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        className='flex w-full max-w-400 md:max-w-3xl rounded-20 shadow-2xl overflow-hidden'
      >
        <Card
          className={clsx(
            classes.leftSection,
            'flex flex-col w-full max-w-sm items-center justify-center shadow-0'
          )}
          square
        >
          <CardContent className='flex flex-col items-center justify-center w-full py-96 max-w-320'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
            >
              <div className='flex items-center mb-48'>
                <img
                  className='logo-icon w-48'
                  src='assets/images/logos/fuse.svg'
                  alt='logo'
                />
                <div className='border-l-1 mr-4 w-1 h-40' />
                <div>
                  <Typography
                    className='text-24 font-semibold logo-text'
                    color='inherit'
                  >
                    FUSE
                  </Typography>
                  <Typography
                    className='text-16 tracking-widest -mt-8 font-700'
                    color='textSecondary'
                  >
                    REACT
                  </Typography>
                </div>
              </div>
            </motion.div>

            <form
              name='loginForm'
              noValidate
              className='flex flex-col justify-center w-full'
              onSubmit={handleSubmit(onSubmit)}
            >
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
                      <FormControlLabel
                        label='Remember Me'
                        control={<Checkbox {...field} />}
                      />
                    </FormControl>
                  )}
                />

                <Link
                  className='font-normal'
                  to='/pages/auth/forgot-password-2'
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                variant='contained'
                color='primary'
                className='w-full mx-auto mt-16'
                aria-label='LOG IN'
                disabled={_.isEmpty(dirtyFields) || !isValid}
                type='submit'
              >
                Login
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
              clientId='372691160732-gsoaq00le7f368557s1f0ch2ghfpgoqu.apps.googleusercontent.com'
              onSuccess={onSuccess}
              onFailure={onFailure}
              isSignedIn={true}
              variant='outlined'
              color='primary'
              size='small'
              className='w-192 mb-8'
              buttonText='Login with Google'
            />

            <Button
              variant='outlined'
              color='primary'
              size='small'
              className='w-192'
            >
              Log in with Facebook
            </Button>
          </CardContent>

          <div className='flex flex-col items-center justify-center pb-32'>
            <span className='font-normal'>Don't have an account?</span>
            <Link className='font-normal' to='/pages/auth/register-3'>
              Create an account
            </Link>
          </div>
        </Card>

        <div
          className={clsx(
            classes.rightSection,
            'hidden md:flex flex-1 items-center justify-center p-64'
          )}
        >
          <div className='max-w-320'>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            >
              <Typography
                color='inherit'
                className='text-32 sm:text-44 font-semibold leading-tight'
              >
                Welcome <br />
                to the <br /> FUSE React!
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
            >
              <Typography
                variant='subtitle1'
                color='inherit'
                className='mt-32 font-medium'
              >
                Powerful and professional admin template for Web Applications,
                CRM, CMS, Admin Panels and more.
              </Typography>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
