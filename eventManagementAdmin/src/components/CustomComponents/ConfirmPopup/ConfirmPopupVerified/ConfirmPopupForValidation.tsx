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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
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

export default function DraggableDialogVerified({ id }) {
  const history = useNavigate();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleVerified = async (id) => {
    if (open == true) {
      const res = await fetch(`http://localhost:8080/updateorganiser/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          validUser: true,
        }),
      });

      const data = await res.json();
      if (res.status === 200) {
        toast.success(`Organiser Verified Successfully`, {
          position: 'top-center',
        });
        setTimeout(function () {
          window.location = `/admin/view-users`;
        }, 2000);
      }
    } else {
      toast.error('Organiser not verified yet..');
    }
  };

  return (
    <div>
      <Tooltip title='Verify'>
        <Button
          variant='contained'
          className='cursor-pointer'
          color='info'
          onClick={handleClickOpen}
        >
          <CheckCircleOutlineIcon />
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
          Verify Organiser
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Are You want to Verify?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            No
          </Button>
          <Button onClick={() => handleVerified(id)}>Verify</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
