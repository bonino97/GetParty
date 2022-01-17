import { amber, blue, green, red } from '@material-ui/core/colors';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideMessage } from 'app/store/fuse/messageSlice';

const useStyles = makeStyles((theme) => ({
  root: {},
  success: {
    // backgroundColor: green[100],
    // color: 'rgb(30, 70, 32)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFFFFF',
  },
  error: {
    // backgroundColor: red[100],
    // color: 'rgb(97, 26, 21)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFFFFF',
  },
  info: {
    backgroundColor: blue[100],
    color: '#FFFFFF',
  },
  warning: {
    backgroundColor: amber[100],
    color: '#FFFFFF',
  },
}));

const variantIcon = {
  success: 'check_circle',
  warning: 'warning',
  error: 'error_outline',
  info: 'info',
};

function FuseMessage(props) {
  const dispatch = useDispatch();
  const state = useSelector(({ fuse }) => fuse.message.state);
  const options = useSelector(({ fuse }) => fuse.message.options);

  const classes = useStyles();

  return (
    <Snackbar
      {...options}
      open={state}
      onClose={() => dispatch(hideMessage())}
      classes={{
        root: classes.root,
      }}
      ContentProps={{
        variant: 'body2',
        headlineMapping: {
          body1: 'div',
          body2: 'div',
        },
      }}
    >
      <SnackbarContent
        className={clsx(classes[options.variant])}
        message={
          <div className='flex items-center'>
            {variantIcon[options.variant] && (
              <Icon color='inherit'>{variantIcon[options.variant]}</Icon>
            )}
            <Typography className='mx-8'>{options.message}</Typography>
          </div>
        }
        action={[
          <IconButton
            key='close'
            aria-label='Close'
            color='inherit'
            onClick={() => dispatch(hideMessage())}
          >
            <Icon>close</Icon>
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
}

export default memo(FuseMessage);
