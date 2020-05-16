import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import styles from './index.module.css';

function AlertPopUp(props) {

  return (
    <Dialog
      open={props.open}
      fullWidth
      maxWidth={'sm'}
    >
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.popupHide()} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const mapStateToProps = state => ({
  open: state.popup.open,
  title: state.popup.title,
  text: state.popup.text
});

const mapDispatchToProps = dispatch => ({
  popupHide: () => dispatch({type: 'POP_UP_HIDE'})
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertPopUp);