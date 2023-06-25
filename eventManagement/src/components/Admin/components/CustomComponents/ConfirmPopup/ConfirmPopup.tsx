import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router';

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle='#draggable-dialog-title'
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function DraggableDialog({ id }) {
  const history = useNavigate();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id) => {
    let token = localStorage.getItem('admindatatoken');

    try {
      if (open == true) {
        let res = await fetch(`http://localhost:8010/deleteorganiser/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        toast.success('User deleted successfully');
        setTimeout(function () {
          window.location = '/admin/view-users';
        }, 2000);
      } else {
        toast.error('User not deleted');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Tooltip title='Delete'>
        <Button
          variant='outlined'
          className='cursor-pointer'
          color='error'
          onClick={handleClickOpen}
        >
          <DeleteIcon />
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby='draggable-dialog-title'
        draggable={false}
      >
        <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
          Delete Organiser
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Are You want to delete?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            No
          </Button>
          <Button onClick={() => handleDelete(id)}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
