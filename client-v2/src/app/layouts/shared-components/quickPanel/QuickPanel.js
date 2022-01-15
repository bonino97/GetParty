import { useDispatch, useSelector } from 'react-redux';
import { memo, useContext } from 'react';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { IconButton, Icon } from '@material-ui/core';
import withReducer from 'app/store/withReducer';
import { toggleQuickPanel } from 'app/layouts/shared-components/quickPanel/store/stateSlice';
import reducer from './store';
import Context from 'app/AppContext';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 320,
  },
}));

function QuickPanel(props) {
  const reduxDispatch = useDispatch();
  const { state, dispatch } = useContext(Context);
  const quickPanelState = useSelector(({ quickPanel }) => quickPanel.state);
  const classes = useStyles();

  const handleToggleQuickPanel = () => reduxDispatch(toggleQuickPanel());
  const handleClose = () => console.log(123);
  const handleDismissAll = () => console.log(123);

  return (
    <SwipeableDrawer
      classes={{ paper: classes.root }}
      open={quickPanelState}
      anchor='right'
      onOpen={(ev) => {}}
      onClose={() => handleToggleQuickPanel()}
      disableSwipeToOpen
    >
      <IconButton
        className='m-4 absolute top-0 right-0 z-999'
        onClick={handleClose}
      >
        <Icon color='action'>close</Icon>
      </IconButton>
      {state.currentPin ? (
        <FuseScrollbars className='p-16'>
          <div className='flex flex-col'>
            <div className='flex justify-between items-end pt-136 mb-36'>
              <Typography className='text-28 font-semibold leading-none'>
                Notifications
              </Typography>
              <Typography
                className='text-12 underline cursor-pointer'
                color='secondary'
                onClick={handleDismissAll}
              >
                dismiss all
              </Typography>
            </div>
          </div>
        </FuseScrollbars>
      ) : (
        <div className='flex flex-1 items-center justify-center p-16'>
          <Typography className='text-24 text-center' color='textSecondary'>
            Select Party
          </Typography>
        </div>
      )}
    </SwipeableDrawer>
  );
}

export default withReducer('quickPanel', reducer)(memo(QuickPanel));
