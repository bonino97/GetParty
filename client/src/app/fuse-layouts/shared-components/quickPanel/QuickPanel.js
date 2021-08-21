import React, { useContext } from 'react';
import { Drawer } from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import { useSelector, useDispatch } from 'react-redux';
import * as Actions from './store/actions/index';
import withReducer from 'app/store/withReducer';
import reducer from './store/reducers';
import { makeStyles } from '@material-ui/styles';
import Context from 'app/AppContext';
import CreatePin from 'app/components/Pin/CreatePin';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 280,
  },
}));

function QuickPanel(props) {
  const { state } = useContext(Context);
  const { draft } = state;
  const dispatch = useDispatch();
  const quickPanelState = useSelector(({ quickPanel }) => quickPanel.state);
  const classes = useStyles();

  return (
    <Drawer
      classes={{ paper: classes.root }}
      open={quickPanelState}
      anchor='right'
      onClose={(ev) => dispatch(Actions.toggleQuickPanel())}
    >
      <FuseScrollbars>{draft ? <CreatePin /> : null}</FuseScrollbars>
    </Drawer>
  );
}

export default withReducer('quickPanel', reducer)(QuickPanel);
