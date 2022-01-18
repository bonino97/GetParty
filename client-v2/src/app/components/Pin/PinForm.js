import { useCallback, useEffect, useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import _ from '@lodash';
import axios from 'axios';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import StepConnector from '@material-ui/core/StepConnector';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import Icon from '@material-ui/core/Icon';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import { DateTimePicker } from '@material-ui/pickers';
import { Autocomplete } from '@material-ui/lab';

import Context from 'app/AppContext';
import './PinForm.css';

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
  startDate: null,
  endDate: null,
  image: '',

  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',

  availableTickets: 0,
  priceOfTicket: 0,
  takeFees: false,

  periodicParty: false,
  publicParty: false,
  entryRequirements: '',

  tags: '',
  instagram: '',
  twitter: '',
  facebook: '',
};

const schema = yup.object().shape({
  title: yup.string().required('You must enter a party name or title.'),
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
  return [0, 1, 2, 3, 4];
};

const steps = getSteps();

const PinForm = ({}) => {
  const classes = useStyles();
  const { state, dispatch } = useContext(Context);
  const { draft } = state;

  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { control, watch, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleImageUpload = async () => {
    try {
      const uploadPreset = 'getpartyapp';
      const cloudName = 'dpu5kohkp';

      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', uploadPreset);
      data.append('cloud_name', cloudName);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        data
      );

      return res.data.url;
    } catch (error) {
      console.error('Error uploading image: ', error);
      return;
    }
  };

  const handleDeleteDraft = () => {
    setSubmitting(false);
    dispatch({ type: 'DELETE_DRAFT' });
  };

  const { isValid, dirtyFields, errors } = formState;

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  /**
   * Form Submit
   */
  const onSubmit = async (formValues) => {
    try {
      setSubmitting(true);

      const { latitude, longitude } = state.draft;

      if (image) {
        formValues.image = await handleImageUpload();
      }

      const createPinInput = {
        latitude,
        longitude,

        title: formValues?.title,
        content: formValues?.content,
        phone: formValues?.phone,
        partyType: formValues?.partyType,
        startDate: formValues?.startDate,
        endDate: formValues?.endDate,
        image: formValues?.image,

        street: formValues?.street,
        city: formValues?.city,
        state: formValues?.state,
        zipCode: formValues?.zipCode,
        country: formValues?.country,

        availableTickets: formValues?.availableTickets,
        priceOfTicket: formValues?.priceOfTicket,
        takeFees: formValues?.takeFees,

        periodicParty: formValues?.periodicParty,
        publicParty: formValues?.publicParty,
        entryRequirements: formValues?.entryRequirements,

        tags: formValues?.tags,
        instagram: formValues?.instagram,
        twitter: formValues?.twitter,
        facebook: formValues?.facebook,
      };

      console.log(createPinInput);

      const { createPin } = await client?.request(
        CREATE_PIN_MUTATION,
        createPinInput
      );

      if (createPin) {
        reduxDispatch(
          showMessage({
            message: 'Party added successfully.',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom', //top bottom
              horizontal: 'right', //left center right
            },
            variant: 'success', //success error info warning null
          })
        );
      }
      handleDeleteDraft();
    } catch (error) {
      setSubmitting(false);
      console.error('Error creating party: ', error);
    }
  };

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

        <form noValidate className='flex flex-col md:overflow-hidden'>
          <DialogContent classes={{}}>
            {activeStep === 0 && (
              <div>
                <div className='flex'>
                  <Controller
                    control={control}
                    name='title'
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className='mb-16'
                        label='Party Name'
                        placeholder='Whats the name of the party?'
                        id='title'
                        error={!!errors?.title}
                        helperText={errors?.title?.message}
                        variant='outlined'
                        required
                        autoFocus
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
                        className='mb-16'
                        name='content'
                        label='Description'
                        placeholder='Description of party.'
                        variant='outlined'
                        multiline
                        rows={2}
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
                      <FormControl className='flex w-full ' variant='outlined'>
                        <InputLabel htmlFor='category-label-placeholder'>
                          Category
                        </InputLabel>
                        <Select
                          input={
                            <OutlinedInput
                              {...field}
                              className='mb-16'
                              name='partyType'
                              id='partyType-placeholder'
                              placeholder='Select a party type.'
                              variant='outlined'
                              fullWidth
                            />
                          }
                        >
                          <MenuItem value='all'>
                            <em> None </em>
                          </MenuItem>
                          <MenuItem value='category2'>Category 2</MenuItem>
                          <MenuItem value='category3'>Category 3</MenuItem>
                          <MenuItem value='category4'>Category 4</MenuItem>
                          <MenuItem value='category5'>Category 5</MenuItem>
                        </Select>
                      </FormControl>
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
                        className='mb-16'
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
                        label='End Date'
                        inputVariant='outlined'
                        value={value}
                        onChange={onChange}
                        className='mb-16'
                        minDate={startDate}
                        fullWidth
                      />
                    )}
                  />
                </div>

                <div className='flex items-center justify-center'>
                  <div>
                    <input
                      accept='image/*'
                      id='image'
                      type='file'
                      className='image-input'
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                    <label
                      htmlFor='image'
                      className={clsx(
                        classes.productImageUpload,
                        'flex items-center justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5'
                      )}
                    >
                      <Icon
                        fontSize='large'
                        color='action'
                        style={{ color: image && '#FEBE3E' }}
                      >
                        cloud_upload
                      </Icon>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div>
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
                        autoFocus
                        fullWidth
                        type='number'
                      />
                    )}
                  />
                </div>
                <div className='flex'>
                  <Controller
                    control={control}
                    name='street'
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className='mb-24'
                        label='Street'
                        placeholder='Complete street and number of party location.'
                        id='street'
                        name='street'
                        variant='outlined'
                        fullWidth
                      />
                    )}
                  />
                </div>

                <div className='flex'>
                  <Controller
                    control={control}
                    name='city'
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className='mb-24'
                        label='City'
                        placeholder='City of party location.'
                        id='city'
                        name='city'
                        variant='outlined'
                        fullWidth
                      />
                    )}
                  />
                </div>

                <div className='flex'>
                  <Controller
                    control={control}
                    name='state'
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className='mb-24'
                        label='State'
                        placeholder='State of party location.'
                        id='state'
                        name='state'
                        variant='outlined'
                        fullWidth
                      />
                    )}
                  />
                </div>

                <div className='flex'>
                  <Controller
                    control={control}
                    name='zipCode'
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className='mb-24'
                        label='Zip Code'
                        placeholder='Zip Code of party location.'
                        id='zipCode'
                        name='zipCode'
                        variant='outlined'
                        fullWidth
                        type='number'
                      />
                    )}
                  />
                </div>

                <div className='flex'>
                  <Controller
                    control={control}
                    name='country'
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className='mb-24'
                        label='Country'
                        placeholder='Country of party location.'
                        id='country'
                        name='country'
                        variant='outlined'
                        fullWidth
                      />
                    )}
                  />
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div>
                <div className='flex'>
                  <Controller
                    name='availableTickets'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className='mt-8 mb-16'
                        label='Available Tickets'
                        id='availableTickets'
                        placeholder='Number of available tickets.'
                        variant='outlined'
                        type='number'
                        autoFocus
                        fullWidth
                      />
                    )}
                  />
                </div>
                <div className='flex'>
                  <Controller
                    name='priceOfTicket'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className='mt-8 mb-16'
                        label='Price of Ticket'
                        placeholder='Whats the party ticket price?'
                        id='priceOfTicket'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>$</InputAdornment>
                          ),
                        }}
                        type='number'
                        variant='outlined'
                        fullWidth
                      />
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
                        label='Tax included in price?'
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
              </div>
            )}

            {activeStep === 3 && (
              <div>
                <div className='flex'>
                  <Controller
                    name='publicParty'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FormControlLabel
                        className='mt-8 mb-24'
                        label='Is it a private party?'
                        control={
                          <Switch
                            onChange={(ev) => {
                              onChange(ev.target.checked);
                            }}
                            checked={value}
                            name='publicParty'
                          />
                        }
                      />
                    )}
                  />
                </div>

                <div className='flex'>
                  <Controller
                    control={control}
                    name='entryRequirements'
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className='mt-16 mb-24'
                        name='entryRequirements'
                        label='Entry Requirements'
                        placeholder='Does the party have any entry requirements?'
                        variant='outlined'
                        multiline
                        rows={2}
                        fullWidth
                      />
                    )}
                  />
                </div>

                <div className='flex'>
                  <Controller
                    name='periodicParty'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FormControlLabel
                        className='mt-8 mb-24'
                        label='Is it a periodic party?'
                        control={
                          <Switch
                            onChange={(ev) => {
                              onChange(ev.target.checked);
                            }}
                            checked={value}
                            name='periodicParty'
                          />
                        }
                      />
                    )}
                  />
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div>
                <div className='flex'>
                  <Controller
                    name='tags'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        className='mt-8 mb-16'
                        multiple
                        freeSolo
                        options={[]}
                        value={value}
                        fullWidth
                        onChange={(event, newValue) => {
                          onChange(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder='Select multiple tags'
                            label='Tags'
                            variant='outlined'
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </div>

                <div className='flex'>
                  <Controller
                    control={control}
                    name='instagram'
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className='mb-24'
                        label='Instagram'
                        placeholder='Instagram url'
                        id='instagram'
                        name='instagram'
                        variant='outlined'
                        fullWidth
                      />
                    )}
                  />
                </div>

                <div className='flex'>
                  <Controller
                    control={control}
                    name='twitter'
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className='mb-24'
                        label='Twitter'
                        placeholder='Twitter url'
                        id='twitter'
                        name='twitter'
                        variant='outlined'
                        fullWidth
                      />
                    )}
                  />
                </div>

                <div className='flex'>
                  <Controller
                    control={control}
                    name='facebook'
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className='mb-24'
                        label='Facebook'
                        placeholder='Facebook url'
                        id='facebook'
                        name='facebook'
                        variant='outlined'
                        fullWidth
                      />
                    )}
                  />
                </div>
              </div>
            )}
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
                className={classes.button}
                disabled={_.isEmpty(dirtyFields) || !isValid}
                type='button'
                onClick={handleSubmit(onSubmit)}
              >
                Finish
              </Button>
            ) : (
              <Button
                variant='contained'
                color='primary'
                onClick={handleNext}
                className={classes.button}
                type='button'
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
