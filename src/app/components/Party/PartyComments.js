import { useDispatch, useSelector } from 'react-redux';
import { memo, useContext, useEffect } from 'react';

import FuseScrollbars from '@fuse/core/FuseScrollbars';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { IconButton, Icon } from '@material-ui/core';

import Context from 'app/AppContext';

import Comments from 'app/components/Comment/Comments';
import CreateComment from 'app/components/Comment/CreateComment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 355,
    height: 'auto',
  },
}));

function PartyCommentsSwip() {
  const { state } = useContext(Context);
  const { currentPin } = state;

  const classes = useStyles();

  const handleView = () => {
    if (currentPin) {
      return (
        <FuseScrollbars className='p-16'>
          <div className='flex-inline space-y-2 h-screen'>
            <div className='item w-full h-auto'>
              <Typography className='text-24 font-semibold leading-none text-center'>
                Comments
              </Typography>
            </div>
            <div className='item w-full h-auto pt-20'>
              <Comments />
            </div>
            <div className='item w-full h-auto border-t border-white"'>
              <CreateComment />
            </div>
          </div>
        </FuseScrollbars>
      );
    }

    if (!currentPin) {
      return (
        <div className='flex-inline space-y-2 h-screen w-auto'>
          <div className='item justify-center items-center'>
            <Typography className='text-24 text-center' color='textSecondary'>
              Select Party
            </Typography>
          </div>
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
      open={PartyCommentsSwipState}
      anchor='right'
      onOpen={(ev) => {}}
      //   onClose={() => handleTogglePartyCommentsSwip/()}
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

export default memo(PartyCommentsSwip);
