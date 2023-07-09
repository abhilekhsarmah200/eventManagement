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

export default function DraggableDialog({ id, item, logindata }) {
  const history = useNavigate();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log({ logindata });

  const handleDelete = async (id) => {
    let token = localStorage.getItem('admindatatoken');

    let res1 = await fetch(
      `http://localhost:8010/updateArtistsforOrganiser/${logindata?.ValidUserOne?._id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organiserId: '643654594db3ac9a63fb4f1a',
        }),
      }
    );

    try {
      if (open == true) {
        let res = await fetch(
          `http://localhost:8010/deleteJoinedDataUsingArtistsId/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          }
        );

        toast.success('Request canceled successfully');

        setTimeout(function () {
          window.location = '/artists/join_venue';
        }, 2000);
      } else {
        toast.error('Request not canceled');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Button
        variant='outlined'
        className='cursor-pointer'
        color='error'
        onClick={handleClickOpen}
      >
        {item?.requestAccepted === false
          ? 'Cancel Request'
          : 'Leave organization'}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        fullWidth='50%'
        dra
        aria-labelledby='draggable-dialog-title'
        draggable={false}
      >
        <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
          Cancel Request
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Are You want to cancel?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' autoFocus onClick={handleClose}>
            No
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={() => handleDelete(id)}
          >
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
