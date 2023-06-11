import React, { useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { toast } from 'react-toastify';
import { useNavigate, NavLink } from 'react-router-dom';
import DraggableDialogVerified from '../CustomComponents/ConfirmPopup/ConfirmPopupVerified/ConfirmPopupForValidation.tsx';
import DraggableDialog from '../CustomComponents/ConfirmPopup/ConfirmPopup.tsx';
import CustomizedDialogs from '../DialogBox/DialogBox.tsx';
import ImageIcon from '@mui/icons-material/Image';

export default function SmallDevicesTable({
  users,
  path,
  getUserById = () => {},
  loading,
}) {
  return (
    <div>
      <div className='flex sm:w-[95vw] w-[95vw] lg:hidden border sm:p-4 p-1 shadow-xl flex-col gap-6'>
        {users?.map((row, index) => (
          <div className='flex flex-col gap-2 border-b-2 pb-2'>
            <div className='flex justify-start gap-x-10'>
              <div className='w-28 sm:w-40 text-sm sm:text-base'>Image:</div>
              <div className='text-sm sm:text-base'>
                {row?.photo ? (
                  <div className='flex justify-center'>
                    <CustomizedDialogs img={row?.photo} path={path} />
                  </div>
                ) : (
                  <div className='flex justify-center'>
                    <ImageIcon style={{ fontSize: '3rem', color: 'grey' }} />
                  </div>
                )}
              </div>
            </div>
            <div className='flex justify-start gap-x-10'>
              <div className='w-28 sm:w-40 text-sm sm:text-base'>
                Venue Name:
              </div>
              <div className='uppercase text-sm sm:text-base'>
                {row?.venueName}
              </div>
            </div>
            <div className='flex justify-start gap-x-10'>
              <div className='w-28 sm:w-40 text-sm sm:text-base'>
                Manager Name:
              </div>
              <div className='uppercase text-sm sm:text-base'>{row?.fname}</div>
            </div>
            <div className='flex justify-start gap-x-10'>
              <div className='w-28 sm:w-40 text-sm sm:text-base'>Email:</div>
              <div className='text-sm sm:text-base'>{row?.email}</div>
            </div>
            <div className='flex justify-start gap-x-10'>
              <div className='w-28 sm:w-40 text-sm sm:text-base'>Mobile:</div>
              <div className='text-sm sm:text-base'>{row?.phone}</div>
            </div>
            <div className='flex justify-start gap-x-10'>
              <div className='w-28 sm:w-40 text-sm sm:text-base'>Address:</div>
              <div className='text-sm sm:text-base'>
                {row?.address}, {row?.city} ({row?.state})
              </div>
            </div>
            <div className='flex justify-start gap-x-10'>
              <div className='w-28 sm:w-40 text-sm sm:text-base'>PIN Code:</div>
              <div>{row?.pinCode}</div>
            </div>
            <div className='flex justify-start gap-x-10'>
              <div className='w-28 sm:w-40 text-sm sm:text-base'>Actions:</div>
              <div>
                <div className='flex'>
                  {row?.validUser === false ? (
                    <div className='flex'>
                      <Tooltip title='verify user'>
                        {loading ? (
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            Loading... &nbsp;
                            <CircularProgress />
                          </Box>
                        ) : (
                          <DraggableDialogVerified id={row._id} />
                        )}
                      </Tooltip>
                    </div>
                  ) : (
                    <div className='flex'>
                      <Tooltip title='view'>
                        <Button
                          variant='outlined'
                          className='cursor-pointer'
                          color='success'
                          onClick={() => getUserById(row._id)}
                        >
                          <VisibilityIcon />
                        </Button>
                      </Tooltip>
                    </div>
                  )}
                  <div className='text-4xl px-1'>/</div>
                  <DraggableDialog id={row._id} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
