import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import Moment from 'react-moment';
import { useNavigate } from 'react-router-dom';

export default function BasicTable(props) {
  const [userData, setUserData] = useState();
  const history = useNavigate();

  let id = props?.users?.map((item) => item.organiser_Id);

  const vewBookingById = async (id) => {
    history(`/viewBookingDetails/${id}`);
  };

  const path = 'http://localhost:8010/public/images/';

  return (
    <div>
      <div className='md:text-2xl text-xl mb-5 text-center font-bold'>
        Booking List:
      </div>
      <div className='hidden md:block'>
        <TableContainer component={Paper}>
          {props?.users?.length === 0 ? (
            <div>Data not Available...</div>
          ) : (
            <Table sx={{ minWidth: '100%' }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell width='10%' align='center'>
                    <b>SL No</b>
                  </TableCell>
                  <TableCell width='10%' align='center'>
                    <b>Venue Name</b>
                  </TableCell>
                  <TableCell width='10%' align='center'>
                    <b>Booking For</b>
                  </TableCell>
                  <TableCell width='10%' align='center'>
                    <b>Event Name</b>
                  </TableCell>
                  <TableCell width='10%' align='center'>
                    <b>Booking At</b>
                  </TableCell>
                  <TableCell width='10%' align='center'>
                    <b>Booked Date</b>
                  </TableCell>
                  <TableCell width='10%' align='center'>
                    <b>Booking Details</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props?.users?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align='center'>
                      <div className='uppercase'>{index + 1}</div>
                    </TableCell>
                    <TableCell align='center'>
                      <div className='uppercase text-left'>
                        {row?.venueName}
                      </div>
                    </TableCell>
                    <TableCell align='center'>
                      <div className='uppercase text-left'>{row?.userName}</div>
                    </TableCell>
                    <TableCell align='center'>
                      <div className='uppercase text-left'>
                        {row?.eventName}
                      </div>
                    </TableCell>
                    <TableCell align='center'>
                      <Moment format='DD-MM-YYYY'>{row?.createdAt}</Moment>
                    </TableCell>

                    <TableCell align='center'>
                      <Moment format='DD-MM-YYYY'>{row?.bookingDate}</Moment>
                    </TableCell>
                    <TableCell align='center'>
                      {row?.paymentStatus === 'pending' ? (
                        <div>
                          <div
                            className='bg-white hover:bg-yellow-400 border-yellow-400 border p-2 cursor-pointer text-black hover:text-white transform duration-300 rounded-xl'
                            color='error'
                          >
                            Booking Pending...
                          </div>
                        </div>
                      ) : row?.paymentStatus === 'confirmed' ? (
                        <div>
                          <div className='bg-white hover:bg-blue-400 border-blue-400 border p-2 cursor-pointer text-black hover:text-white transform duration-300 rounded-xl'>
                            Booking Confirmed
                          </div>
                        </div>
                      ) : row?.paymentStatus === 'canceled' ? (
                        <div>
                          <div className='bg-white hover:bg-red-400 border-red-400 border p-2 cursor-pointer text-black hover:text-white transform duration-300 rounded-xl'>
                            Booking Canceled
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className='bg-white hover:bg-green-500 border-green-500 border p-2 cursor-pointer text-black hover:text-white transform duration-300 rounded-xl'>
                            Booking Completed
                          </div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </div>
      <div className='flex sm:w-[90vw] w-[95vw] md:hidden border sm:p-4 p-1 shadow-xl flex-col gap-6'>
        {props?.users?.map((row, index) => (
          <div className='flex flex-col gap-2 border-b-2 pb-2'>
            <div className='flex justify-start gap-x-10'>
              <div className='w-28 sm:w-40 text-sm sm:text-base'>SL No:</div>
              <div className='text-sm sm:text-base'>{index + 1}</div>
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
                Booking For:
              </div>
              <div className='uppercase text-sm sm:text-base'>
                {row?.userName}
              </div>
            </div>
            <div className='flex justify-start gap-x-10'>
              <div className='w-28 sm:w-40 text-sm sm:text-base'>
                Event Name:
              </div>
              <div className='text-sm sm:text-base'>{row?.eventName}</div>
            </div>
            <div className='flex justify-start gap-x-10'>
              <div className='w-28 sm:w-40 text-sm sm:text-base'>
                Booking At:
              </div>
              <div className='text-sm sm:text-base'>
                <Moment format='DD-MM-YYYY'>{row?.createdAt}</Moment>
              </div>
            </div>
            <div className='flex justify-start gap-x-10'>
              <div className='w-28 sm:w-40 text-sm sm:text-base'>
                Booked Date:
              </div>
              <div className='text-sm sm:text-base'>
                <Moment format='DD-MM-YYYY'>{row?.bookingDate}</Moment>
              </div>
            </div>
            <div className='flex justify-start gap-x-10'>
              <div className='w-28 sm:w-40 text-sm sm:text-base'>Status:</div>
              <div>
                {row?.paymentStatus === 'pending' ? (
                  <div>
                    <div
                      className='bg-white w-36 text-center text-xs sm:text-base hover:bg-yellow-400 border-yellow-400 border p-2 cursor-pointer text-black hover:text-white transform duration-300 rounded-xl'
                      color='error'
                    >
                      Booking Pending...
                    </div>
                  </div>
                ) : row?.paymentStatus === 'confirmed' ? (
                  <div>
                    <div className='bg-white w-36 text-center text-xs sm:text-base hover:bg-blue-400 border-blue-400 border p-2 cursor-pointer text-black hover:text-white transform duration-300 rounded-xl'>
                      Booking Confirmed
                    </div>
                  </div>
                ) : row?.paymentStatus === 'canceled' ? (
                  <div>
                    <div className='bg-white w-36 text-center text-xs sm:text-base hover:bg-red-400 border-red-400 border p-2 cursor-pointer text-black hover:text-white transform duration-300 rounded-xl'>
                      Booking Canceled
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className='bg-white w-36 text-center text-xs sm:text-base hover:bg-green-500 border-green-500 border p-2 cursor-pointer text-black hover:text-white transform duration-300 rounded-xl'>
                      Booking Completed
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
