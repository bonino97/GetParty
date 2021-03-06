import { useCallback, useEffect, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import _ from '@lodash';
import axios from 'axios';
import { addHours, isValid as isValidDate, addYears } from 'date-fns';
import { motion } from 'framer-motion';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
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
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import { DateTimePicker } from '@material-ui/pickers';
import { Autocomplete } from '@material-ui/lab';

import FuseScrollbars from '@fuse/core/FuseScrollbars';

import { showMessage } from 'app/store/fuse/messageSlice';

import Context from 'app/AppContext';

import { useAuthClient } from 'graphql/authClient';
import { CREATE_PIN_MUTATION } from 'graphql/mutations';

import { CATEGORIES_LIST } from 'app/constants/CategoriesList';
import './PartyForm.css';

import { getReverseGeocodingData } from 'app/services/geoCoding/getReverseGeocodingData';

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
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
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
  category: '',
  startDate: new Date(),
  endDate: null,
  image: '',

  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',

  availableTickets: 0,
  priceOfTicket: 0,
  takeFees: false,
  sellTickets: false,

  isPeriodic: false,
  isPrivate: false,
  entryRequirements: '',

  tags: [],
  instagram: '',
  twitter: '',
  facebook: '',

  tickets: [],
};

const schema = yup.object().shape({
  title: yup.string().required('You must enter a party name or title.'),
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    flexGrow: 1,
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const getSteps = () => {
  return [0, 1, 2, 3, 4];
};

const oneYearDate = addYears(new Date(), 1);

const steps = getSteps();

const PartyForm = ({}) => {
  const client = useAuthClient();
  const classes = useStyles();
  const reduxDispatch = useDispatch();
  const { state, dispatch } = useContext(Context);

  const { draft } = state;

  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(true);
  const [sellTickets, setSellTickets] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [ticketId, setTicketId] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');

  const [editTicket, setEditTicket] = useState(null);

  const [tickets, setTickets] = useState([]);

  const { control, watch, handleSubmit, formState, reset, setValue } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const { isValid, dirtyFields, errors } = formState;

  useEffect(async () => {
    if (draft?.longitude === 0) return false;
    const location = await getReverseGeocodingData(draft?.latitude, draft?.longitude);

    if (!location) return false;

    setValue('address', location?.address);
    setValue('city', location?.city);
    setValue('state', location?.state);
    setValue('zipCode', location?.zipCode);
    setValue('country', location?.country);
  }, [draft]);

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
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, data);

      return res.data.url;
    } catch (error) {
      console.error('Error uploading image: ', error);
      return;
    }
  };

  const handleClose = () => {
    setSubmitting(false);
    setOpen(false);
    dispatch({ type: 'DELETE_DRAFT' });
  };

  const onAddTicket = () => {
    const id = ticketId + 1;
    setTicketId(id);

    setTickets([
      ...tickets,
      { ticketId: parseInt(id), quantity: parseInt(quantity), price: parseInt(price), title: ticketTitle, description: ticketDescription },
    ]);
    resetTicketValues();
  };

  const onEditTicket = () => {
    const updatedTickets = [...tickets];
    const index = updatedTickets.findIndex((ticket) => ticket.ticketId === editTicket?.ticketId);
    updatedTickets[index] = {
      ticketId: parseInt(editTicket?.ticketId),
      quantity: parseInt(quantity),
      price: parseInt(price),
      title: ticketTitle,
      description: ticketDescription,
    };
    setTickets(updatedTickets);
    resetTicketValues();
  };

  const resetTicketValues = () => {
    setQuantity(0);
    setPrice(0);
    setTicketTitle('');
    setTicketDescription('');
    setEditTicket(null);
  };

  const handleTicketDelete = (ticket) => {
    const newTickets = tickets.filter((t) => ticket?.ticketId !== t?.ticketId);
    setTickets(newTickets);
    resetTicketValues();
  };

  const handleTicketEdit = (ticket) => {
    setEditTicket(ticket);
    setQuantity(ticket?.quantity);
    setPrice(ticket?.price);
    setTicketTitle(ticket?.title);
    setTicketDescription(ticket?.description);
  };

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
        category: formValues?.category,
        startDate: formValues?.startDate,
        endDate: formValues?.endDate ? formValues.endDate : addHours(formValues?.startDate, 6),
        image: formValues?.image,

        location: {
          address: formValues?.address,
          city: formValues?.city,
          state: formValues?.state,
          zipCode: formValues?.zipCode,
          country: formValues?.country,
        },

        takeFees: formValues?.takeFees,

        isPeriodic: formValues?.isPeriodic,
        isPrivate: formValues?.isPrivate,
        entryRequirements: formValues?.entryRequirements,

        tags: formValues?.tags,
        instagram: formValues?.instagram,
        twitter: formValues?.twitter,
        facebook: formValues?.facebook,

        tickets,
      };

      const { createPin } = await client?.request(CREATE_PIN_MUTATION, createPinInput);

      if (createPin) {
        setActiveStep(0);
        reset(defaultValues);
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
      handleClose();
    } catch (error) {
      setSubmitting(false);
      console.error('Error creating party: ', error);
    }
  };

  return (
    <Dialog
      classes={{
        paper: 'm-24',
      }}
      fullWidth
      maxWidth='md'
      open={open}
      keepMounted
      onClose={handleClose}
    >
      <AppBar position='static'>
        <Toolbar className='flex w-full'>
          <Typography variant='subtitle1' className='text-white font-600'>
            Create Party
          </Typography>
        </Toolbar>
      </AppBar>

      <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}></StepLabel>
          </Step>
        ))}
      </Stepper>

      <form autoComplete='none' noValidate className='flex flex-col md:overflow-hidden'>
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
                      autoComplete='none'
                      className='mb-16'
                      label='Party Name'
                      placeholder='Whats the name of the party?'
                      id='title'
                      error={!!errors?.title}
                      helperText={errors?.title?.message}
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
                      autoComplete='none'
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
                  name='category'
                  render={({ field }) => (
                    <FormControl className='flex w-full ' variant='outlined'>
                      <InputLabel htmlFor='category-label-placeholder'>Category</InputLabel>
                      <Select
                        input={
                          <OutlinedInput
                            {...field}
                            className='mb-16'
                            name='category'
                            id='category-placeholder'
                            placeholder='Select a party type.'
                            variant='outlined'
                            fullWidth
                          />
                        }
                      >
                        <MenuItem key={'None'} selected value='None'>
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
                  )}
                />
              </div>

              <div className='flex'>
                <Controller
                  name='tags'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      className='mb-16'
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
                          autoComplete='none'
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
                  name='startDate'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DateTimePicker
                      label='Start Date'
                      inputVariant='outlined'
                      value={value}
                      onChange={onChange}
                      className='mb-16'
                      minDate={Date.now()}
                      maxDate={isValidDate(endDate) ? endDate : oneYearDate}
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className='flex'>
                <Controller
                  name='endDate'
                  control={control}
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
                      autoComplete='none'
                      className='mb-24'
                      label='Phone'
                      placeholder='Phone number of the party.'
                      id='phone'
                      variant='outlined'
                      fullWidth
                      type='number'
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                    />
                  )}
                />
              </div>
              <div className='flex'>
                <Controller
                  control={control}
                  name='address'
                  render={({ field }) => (
                    <TextField
                      {...field}
                      autoComplete='none'
                      className='mb-24'
                      label='Address'
                      placeholder='Complete address of party location.'
                      id='address'
                      name='address'
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
                      autoComplete='none'
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
                      autoComplete='none'
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
                      autoComplete='none'
                      className='mb-24'
                      label='Zip Code'
                      placeholder='Zip Code of party location.'
                      id='zipCode'
                      name='zipCode'
                      variant='outlined'
                      fullWidth
                      type='text'
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
                      autoComplete='none'
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
            <>
              <div className='flex'>
                <Controller
                  name='sellTickets'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      className='mb-12'
                      label='Sell tickets?'
                      control={
                        <Switch
                          onChange={(ev) => {
                            onChange(ev.target.checked);
                            setSellTickets(ev.target.checked);
                          }}
                          checked={value}
                          name='sellTickets'
                        />
                      }
                    />
                  )}
                />
              </div>
              {sellTickets && (
                <>
                  {tickets?.length > 0 && (
                    <div className='pb-24'>
                      <FuseScrollbars className='flex-grow overflow-x-auto pb-12'>
                        <Table className='min-w-sm max-w-xl'>
                          <TableHead className='p-0'>
                            <TableRow>
                              <TableCell className='pr-0'>Quantity</TableCell>
                              <TableCell>Price</TableCell>
                              <TableCell>Title</TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell padding='none' className='text-center'>
                                Actions
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {tickets?.map((ticket) => {
                              return (
                                <TableRow
                                  key={ticket?.ticketId}
                                  // onClick={(event) => dispatch(setSelectedItem(item.id))}
                                  // selected={item.id === selectedItemId}
                                  className='cursor-pointer'
                                >
                                  <TableCell className='pr-0'>{ticket.quantity}</TableCell>
                                  <TableCell>$ {ticket.price}</TableCell>
                                  <TableCell>{ticket.title}</TableCell>
                                  <TableCell>
                                    {ticket?.description.length > 15 ? ticket?.description.slice(0, 15) + ' ...' : ticket?.description}
                                  </TableCell>
                                  <TableCell padding='none' className='text-center'>
                                    <IconButton onClick={() => handleTicketDelete(ticket)}>
                                      <Icon>delete</Icon>
                                    </IconButton>
                                    <IconButton onClick={() => handleTicketEdit(ticket)}>
                                      <Icon>edit</Icon>
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </FuseScrollbars>
                    </div>
                  )}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='availableTickets'
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            autoComplete='none'
                            label='Available Tickets *'
                            id='availableTickets'
                            placeholder='Number of available tickets.'
                            variant='outlined'
                            type='number'
                            fullWidth
                            value={quantity}
                            InputProps={{
                              inputProps: { min: 0, max: 99999 },
                            }}
                            onChange={(e) => setQuantity(e.target.value)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='priceOfTicket'
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            autoComplete='none'
                            label='Price of Ticket *'
                            placeholder='Whats the party ticket price?'
                            id='priceOfTicket'
                            value={price}
                            InputProps={{
                              startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                              inputProps: { min: 0, max: 99999 },
                            }}
                            onChange={(e) => setPrice(e.target.value)}
                            type='number'
                            variant='outlined'
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name='ticketTitle'
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            autoComplete='none'
                            label='Ticket Title'
                            id='ticketTitle'
                            placeholder="What's the party ticket title?"
                            variant='outlined'
                            type='text'
                            fullWidth
                            value={ticketTitle}
                            onChange={(e) => setTicketTitle(e.target.value)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        control={control}
                        name='content'
                        render={({ field }) => (
                          <TextField
                            {...field}
                            autoComplete='none'
                            name='content'
                            label='Description'
                            placeholder='Description of ticket.'
                            variant='outlined'
                            value={ticketDescription}
                            multiline
                            rows={2}
                            fullWidth
                            onChange={(e) => setTicketDescription(e.target.value)}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <div className='flex justify-between pt-16 pb-16'>
                    <div className='flex'>
                      <Controller
                        name='takeFees'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <FormControlLabel
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
                    <div className='flex'>
                      {!editTicket && (
                        <Button
                          variant='contained'
                          color='secondary'
                          type='button'
                          disabled={_.isNaN(parseInt(quantity)) || _.isNaN(parseInt(price)) || parseInt(quantity) === 0}
                          onClick={onAddTicket}
                        >
                          Add Ticket
                        </Button>
                      )}

                      {editTicket && (
                        <Button
                          variant='contained'
                          color='secondary'
                          type='button'
                          disabled={_.isNaN(parseInt(quantity)) || _.isNaN(parseInt(price)) || parseInt(quantity) === 0}
                          onClick={onEditTicket}
                        >
                          Edit Ticket
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeStep === 3 && (
            <div>
              <div className='flex'>
                <Controller
                  name='isPrivate'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      className='mt-8 mb-24'
                      label='Its a private party?'
                      control={
                        <Switch
                          onChange={(ev) => {
                            onChange(ev.target.checked);
                          }}
                          checked={value}
                          name='isPrivate'
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
                      autoComplete='none'
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
                  name='isPeriodic'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      className='mt-8 mb-24'
                      label='Its a periodic party?'
                      control={
                        <Switch
                          onChange={(ev) => {
                            onChange(ev.target.checked);
                          }}
                          checked={value}
                          name='isPeriodic'
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
                  control={control}
                  name='instagram'
                  render={({ field }) => (
                    <TextField
                      {...field}
                      autoComplete='none'
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
                      autoComplete='none'
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
                      autoComplete='none'
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
              <div className='flex items-center justify-center'>
                <div>
                  <input accept='image/*' id='image' type='file' className='image-input' onChange={(e) => setImage(e.target.files[0])} />
                  <label
                    htmlFor='image'
                    className={clsx(
                      classes.productImageUpload,
                      'flex items-center justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5'
                    )}
                  >
                    <Icon fontSize='large' color='action' style={{ color: image && '#FEBE3E' }}>
                      cloud_upload
                    </Icon>
                  </label>
                </div>
              </div>
            </div>
          )}
        </DialogContent>

        <DialogActions className='justify-between p-20 pb-16 border-t border-white'>
          {activeStep === 0 ? (
            <Button onClick={handleClose} variant='contained' color='secondary'>
              Cancel
            </Button>
          ) : (
            <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
              Back
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button
              variant='contained'
              color='primary'
              className={classes.button}
              disabled={_?.isEmpty(dirtyFields) || !isValid || submitting}
              type='button'
              onClick={handleSubmit(onSubmit)}
            >
              Finish
            </Button>
          ) : (
            <Button variant='contained' color='primary' onClick={handleNext} className={classes.button} type='button'>
              Next
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PartyForm;
