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

export default function DraggableDialogImage({ id, item, path }) {
  const history = useNavigate();

  const [open, setOpen] = useState(false);
  const [organiserData, setOrganiserData] = useState(null);

  const handleClickOpen = async (id) => {
    const res = await fetch(
      `http://localhost:8080/viewJoinedDataUsingOrganiser/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();
    setOrganiserData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div
        className='cursor-pointer transform duration-300 lg:hover:scale-95'
        onClick={() => handleClickOpen(item?.joinWith)}
      >
        <img
          alt='Card'
          className='bg-gray-400 rounded-lg w-80 h-60'
          src={
            item?.photo
              ? `${path}${item?.photo}`
              : `https://static.thenounproject.com/png/504708-200.png`
          }
        />
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby='draggable-dialog-title'
        draggable={false}
        fullWidth={'40%'}
      >
        <div className='p-5'>
          {organiserData
            ?.map((item, index) => (
              <>
                <div className='flex justify-center'>
                  <img
                    src={`${path}${item?.photo}`}
                    className='w-60 h-36 rounded-lg'
                  />
                </div>
                <div className='flex justify-start'>
                  <span className='font-bold'>Venue Name: </span>&nbsp;
                  {item?.joinWith?.venueName}
                </div>
                <div className='flex justify-start'>
                  <span className='font-bold'>Manager Name: </span>&nbsp;
                  {item?.joinWith?.fname}
                </div>
                <div className='flex justify-start'>
                  <span className='font-bold'>Manager Phone: </span>&nbsp;
                  <a
                    className='underline'
                    href={`tel:+91 ${item?.joinWith?.phone}`}
                  >
                    +91 {item?.joinWith?.phone}
                  </a>
                </div>
                <div className='flex justify-start'>
                  <span className='font-bold'>Details: </span>&nbsp;
                  <span
                    className='text-black Montserrat_font text-12 '
                    dangerouslySetInnerHTML={{
                      __html: item?.joinWith?.details?.map(
                        (item) => item?.htmlValue
                      ),
                    }}
                  ></span>
                </div>

                <div className='flex justify-start'>
                  <span className='font-bold'>Address: </span>&nbsp;
                  {item?.joinWith?.address +
                    ', ' +
                    item?.joinWith?.city +
                    ' ' +
                    '(' +
                    item?.joinWith?.state +
                    ')'}
                </div>
              </>
            ))
            .slice(1)}
        </div>
        <div className='w-40 mx-auto p-2'>
          <Button onClick={handleClose} variant='contained'>
            Close
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
