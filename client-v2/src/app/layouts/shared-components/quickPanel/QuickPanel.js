import { useDispatch, useSelector } from 'react-redux';
import { memo, useContext, useEffect } from 'react';

import FuseScrollbars from '@fuse/core/FuseScrollbars';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { IconButton, Icon } from '@material-ui/core';

import {
  toggleQuickPanel,
  closeQuickPanel,
} from 'app/layouts/shared-components/quickPanel/store/stateSlice';
import reducer from 'app/layouts/shared-components/quickPanel/store';

import withReducer from 'app/store/withReducer';
import Context from 'app/AppContext';

import Comments from 'app/components/Comment/Comments';
import CreateComment from 'app/components/Comment/CreateComment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 355,
  },
}));

function QuickPanel(props) {
  const reduxDispatch = useDispatch();
  const { state, dispatch } = useContext(Context);
  const { currentPin } = state;

  const quickPanelState = useSelector(({ quickPanel }) => quickPanel?.state);
  const classes = useStyles();

  const handleToggleQuickPanel = () => reduxDispatch(toggleQuickPanel());
  const handleClose = () => reduxDispatch(closeQuickPanel());
  const handleView = () => {
    if (currentPin) {
      return (
        <FuseScrollbars className='p-16'>
          <div className='grid grid-flow-row auto-rows-max md:auto-rows-min'>
            <div className='col-auto'>
              <Typography className='text-24 font-semibold leading-none text-center'>
                Comments
              </Typography>
            </div>
            <div className='pt-20 col-auto'>
              <Comments />
            </div>
            <div className='col-auto'>
              <CreateComment />
            </div>
          </div>
        </FuseScrollbars>
      );
    }

    if (!currentPin) {
      return (
        <div className='flex flex-1 items-center justify-center p-16'>
          <Typography className='text-24 text-center' color='textSecondary'>
            Select Party
          </Typography>
        </div>
      );
    }
  };

  useEffect(() => {
    handleView();
  }, []);

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

      {handleView()}
    </SwipeableDrawer>
  );
}

export default withReducer('quickPanel', reducer)(memo(QuickPanel));
