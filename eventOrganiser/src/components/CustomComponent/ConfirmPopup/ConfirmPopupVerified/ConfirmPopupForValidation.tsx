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

export default function DraggableDialogVerified({ id, organiserId }) {
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
      const res = await fetch(
        `http://localhost:8080/updateArtistsforRequestAccepted/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requestAccepted: true,
          }),
        }
      );

      const data = await res.json();
      if (res.status === 200) {
        toast.success(`Organiser Verified Successfully`, {
          position: 'top-center',
        });
        setTimeout(function () {
          window.location = `/organiser/artistsRequest/${organiserId}`;
        }, 2000);
      }
    } else {
      toast.error('Organiser not verified yet..');
    }
  };

  return (
    <div>
      <div
        className='w-36 border p-3 rounded-xl text-center border-blue-400 hover:bg-blue-400 hover:text-white cursor-pointer transform duration-300'
        onClick={handleClickOpen}
        style={{ fontSize: '0.9rem' }}
      >
        Accept
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby='draggable-dialog-title'
        draggable={false}
        fullWidth='50%'
      >
        <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
          Verify Artists
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are You want to Accept the Request?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' autoFocus onClick={handleClose}>
            No
          </Button>
          <Button variant='contained' onClick={() => handleVerified(id)}>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
