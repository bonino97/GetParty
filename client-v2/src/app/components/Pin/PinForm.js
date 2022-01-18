import { useCallback, useEffect, useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import _ from '@lodash';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { DateTimePicker } from '@material-ui/pickers';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import StepConnector from '@material-ui/core/StepConnector';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Context from 'app/AppContext';

/**
 * Stepper Stuff
 */

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    '& $line': {
      borderColor: '#FEBE3E',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#FEBE3E',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#FEBE3E',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#FEBE3E',
    zIndex: 1,
    fontSize: 18,
  },
});

const QontoStepIcon = (props) => {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <Check className={classes.completed} />
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  );
};

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
};

/**
 * Form Validation Schema
 */

const defaultValues = {
  title: '',
  content: '',
  phone: '',
  partyType: '',
  startDate: new Date(),
  endDate: new Date(),
  image: '',

  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',

  availableTickets: 0,
  priceOfTicket: 0,
  takeFees: false,

  periodicEvent: false,
  publicParty: false,
  entryRequirements: '',
  tags: [''],
  instagram: '',
  twitter: '',
  facebook: '',
};

const schema = yup.object().shape({
  title: yup.string().required('You must enter a title.'),
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const getSteps = () => {
  return [1, 2, 3, 4];
};

const steps = getSteps();

const PinForm = ({}) => {
  const classes = useStyles();
  const { state, dispatch } = useContext(Context);
  const { draft } = state;

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm(
    {
      mode: 'onChange',
      defaultValues,
      resolver: yupResolver(schema),
    }
  );

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDeleteDraft = () => {
    dispatch({ type: 'DELETE_DRAFT' });
  };

  const { isValid, dirtyFields, errors } = formState;

  const title = watch('title');
  const image = watch('image');

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  /**
   * Form Submit
   */
  function onSubmit(data) {
    console.log(data);
  }

  return (
    draft && (
      <Dialog
        classes={{
          paper: 'm-24',
        }}
        fullWidth
        maxWidth='md'
        open={true}
      >
        <AppBar position='static'>
          <Toolbar className='flex w-full'>
            <Typography variant='subtitle1' className='text-white font-600'>
              Create Party
            </Typography>
          </Toolbar>
        </AppBar>

        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<QontoConnector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={QontoStepIcon}></StepLabel>
            </Step>
          ))}
        </Stepper>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col md:overflow-hidden'
        >
          <DialogContent classes={{ root: 'p-24' }}>
            <div>
              <div className='flex'>
                <Controller
                  control={control}
                  name='title'
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='mb-24'
                      label='Party Name'
                      placeholder='Whats the name of the party?'
                      id='title'
                      error={!!errors.name}
                      helperText={errors?.name?.message}
                      variant='outlined'
                      required
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className='flex'>
                <Controller
                  control={control}
                  name='content'
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='mb-24'
                      name='content'
                      label='Description'
                      placeholder='Description of party.'
                      variant='outlined'
                      multiline
                      rows={5}
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className='flex'>
                <Controller
                  control={control}
                  name='phone'
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='mb-24'
                      label='Phone'
                      placeholder='Phone number of the party.'
                      id='phone'
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className='flex'>
                <Controller
                  control={control}
                  name='partyType'
                  render={({ field }) => (
                    <Select
                      labelId='demo-simple-select-outlined-label'
                      id='demo-simple-select-outlined'
                      native
                      {...field}
                      fullWidth
                      className='mb-24'
                      name='partyType'
                      label='Party Type'
                      inputProps={{
                        name: 'partyType',
                        id: 'outlined-age-native-simple',
                      }}
                    >
                      <MenuItem value=''>
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  )}
                />
              </div>

              <div className='flex'>
                <Controller
                  name='takeFees'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      className='mt-8 mb-16'
                      label='Take fees?'
                      control={
                        <Switch
                          onChange={(ev) => {
                            onChange(ev.target.checked);
                          }}
                          checked={value}
                          name='takeFees'
                        />
                      }
                    />
                  )}
                />
              </div>

              <div className='flex'>
                <Controller
                  control={control}
                  name='nickname'
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='mb-24'
                      label='Nickname'
                      id='nickname'
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <div className='flex'>
                <Controller
                  control={control}
                  name='email'
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='mb-24'
                      label='Email'
                      id='email'
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className='flex'>
                <Controller
                  control={control}
                  name='company'
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='mb-24'
                      label='Company'
                      id='company'
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className='flex'>
                <Controller
                  control={control}
                  name='jobTitle'
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='mb-24'
                      label='Job title'
                      id='jobTitle'
                      name='jobTitle'
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className='flex'>
                <Controller
                  control={control}
                  name='birthday'
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='mb-24'
                      id='birthday'
                      label='Birthday'
                      type='date'
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <div className='flex'>
                <Controller
                  control={control}
                  name='address'
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='mb-24'
                      label='Address'
                      id='address'
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />
              </div>
              <div className='flex'>
                <Controller
                  name='startDate'
                  control={control}
                  defaultValue=''
                  render={({ field: { onChange, value } }) => (
                    <DateTimePicker
                      label='Start Date'
                      inputVariant='outlined'
                      value={value}
                      onChange={onChange}
                      className='mb-24'
                      maxDate={endDate}
                      fullWidth
                    />
                  )}
                />
              </div>
              <div className='flex'>
                <Controller
                  name='endDate'
                  control={control}
                  defaultValue=''
                  render={({ field: { onChange, value } }) => (
                    <DateTimePicker
                      label='Due Date'
                      inputVariant='outlined'
                      value={value}
                      onChange={onChange}
                      className='mb-24'
                      minDate={startDate}
                      fullWidth
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <div className='flex'>
                <Controller
                  control={control}
                  name='email'
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='mb-24'
                      label='Email'
                      id='email'
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className='flex'>
                <Controller
                  control={control}
                  name='company'
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='mb-24'
                      label='Company'
                      id='company'
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className='flex'>
                <Controller
                  control={control}
                  name='jobTitle'
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='mb-24'
                      label='Job title'
                      id='jobTitle'
                      name='jobTitle'
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className='flex'>
                <Controller
                  control={control}
                  name='birthday'
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='mb-24'
                      id='birthday'
                      label='Birthday'
                      type='date'
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />
              </div>
            </div>
          </DialogContent>

          <DialogActions className='justify-between p-20 pb-16 border-t border-white'>
            {activeStep === 0 ? (
              <Button
                onClick={handleDeleteDraft}
                variant='contained'
                color='secondary'
              >
                Cancel
              </Button>
            ) : (
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <Button
                variant='contained'
                color='primary'
                onClick={handleNext}
                className={classes.button}
                disabled={_.isEmpty(dirtyFields) || !isValid}
              >
                Finish
              </Button>
            ) : (
              <Button
                variant='contained'
                color='primary'
                onClick={handleNext}
                className={classes.button}
              >
                Next
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    )
  );
};

export default PinForm;
