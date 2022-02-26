import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { motion } from 'framer-motion';
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import * as yup from 'yup';
import _ from '@lodash';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { useClient } from 'graphql/client';
import { REGISTER_MUTATION } from 'graphql/mutations';

import { showMessage } from 'app/store/fuse/messageSlice';

import { handleErrors } from 'app/services/errorService/handleErrors';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().required('You must enter your name'),
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  password: yup.string().required('Please enter your password.').min(8, 'Password is too short - should be 8 chars minimum.'),
  passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  termsAndConditions: yup.boolean().oneOf([true], 'The terms and conditions must be accepted.'),
});

const defaultValues = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  termsAndConditions: false,
};

const Register = () => {
  const classes = useStyles();
  const client = useClient();
  const history = useHistory();
  const reduxDispatch = useDispatch();
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = async (formValues) => {
    try {
      const input = formValues;
      const { register } = await client?.request(REGISTER_MUTATION, input);
      if (register) {
        reduxDispatch(
          showMessage({
            message: 'User created successfully.',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom', //top bottom
              horizontal: 'right', //left center right
            },
            variant: 'success', //success error info warning null
          })
        );
        history.push(`/confirm-email/${input?.email}`);
        reset(defaultValues);
      }
    } catch (error) {
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
    <div className={clsx(classes.root, 'flex flex-col flex-auto p-16 sm:p-24 md:flex-row md:p-0 overflow-hidden')}>
      <div className='flex flex-col flex-grow-0 items-center  p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left'>
        <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}>
          <div className='flex items-center mb-24'>
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

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
          <Typography color='primary' className='text-32 sm:text-44 font-semibold leading-tight'>
            Welcome to
            <br />
            Get Party!
          </Typography>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
          <Typography variant='subtitle1' className='mt-32 font-medium'>
            Create account to increase your parties.
          </Typography>
        </motion.div>
      </div>

      <Card
        component={motion.div}
        initial={{ x: 200 }}
        animate={{ x: 0 }}
        transition={{ bounceDamping: 0 }}
        className='w-full max-w-400 mx-auto m-16 md:m-0 rounded-20 md:rounded-none'
        square
        layout
      >
        <CardContent className='flex flex-col items-center justify-center p-16 sm:p-32 md:p-48 md:pt-128 '>
          <Typography variant='h6' className='mb-24 font-semibold text-18 sm:text-24'>
            Create an account
          </Typography>

          <form name='registerForm' noValidate className='flex flex-col justify-center w-full' onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className='mb-16'
                  label='Name'
                  autoFocus
                  type='name'
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  variant='outlined'
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className='mb-16'
                  label='Email'
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

            <Controller
              name='passwordConfirm'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className='mb-16'
                  label='Repeat password'
                  type='password'
                  error={!!errors.passwordConfirm}
                  helperText={errors?.passwordConfirm?.message}
                  variant='outlined'
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name='termsAndConditions'
              control={control}
              render={({ field }) => (
                <FormControl className='items-center' error={!!errors.termsAndConditions}>
                  <FormControlLabel label='I read and accept terms and conditions' control={<Checkbox {...field} />} />
                  <FormHelperText>{errors?.termsAndConditions?.message}</FormHelperText>
                </FormControl>
              )}
            />

            <Button
              variant='contained'
              color='primary'
              className='w-full mx-auto mt-16'
              aria-label='Register'
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type='submit'
            >
              Create an account
            </Button>
          </form>

          <div className='flex flex-col items-center justify-center pt-32 pb-24'>
            <span className='font-normal'>Already have an account?</span>
            <Link className='font-normal' to='/login'>
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
