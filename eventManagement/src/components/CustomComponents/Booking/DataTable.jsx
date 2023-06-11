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
  const [organisersData, setOrganisersData] = useState();
  const history = useNavigate();

  let id = props?.users?.map((item) => item.organiser_Id);

  const vewBookingById = async (id) => {
    history(`/viewBookingDetails/${id}`);
  };

  useEffect(() => {
    // organiserById();
  }, []);

  const path = 'http://localhost:8080/public/images/';

  return (
    <div>
      <TableContainer component={Paper}>
        {props?.users?.length === 0 ? (
          <div>Data not Available...</div>
        ) : (
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell width='10%' align='center'>
                  <b>SL No</b>
                </TableCell>
                <TableCell width='10%' align='center'>
                  <b>Venue Name</b>
                </TableCell>
                <TableCell width='10%' align='center'>
                  <b>Event Name</b>
                </TableCell>
                <TableCell width='10%' align='center'>
                  <b>Booked Date</b>
                </TableCell>
                <TableCell width='10%' align='center'>
                  <b>Booking Date</b>
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
                    <div className='uppercase'>{row?.venueName}</div>
                  </TableCell>
                  <TableCell align='center'>
                    <div className='uppercase'>{row?.eventName}</div>
                  </TableCell>
                  <TableCell align='center'>
                    <Moment format='DD-MM-YYYY'>{row?.createdAt}</Moment>
                  </TableCell>

                  <TableCell align='center'>
                    <Moment format='DD-MM-YYYY'>{row?.bookingDate}</Moment>
                  </TableCell>
                  <TableCell align='center'>
                    {row?.paymentStatus === 'canceled' ? (
                      <div>
                        <Button
                          onClick={() => vewBookingById(row._id)}
                          variant='outlined'
                          color='error'
                        >
                          Booking Canceled
                        </Button>
                      </div>
                    ) : row?.paymentStatus === 'confirmed' ? (
                      <div>
                        <Button
                          onClick={() => vewBookingById(row._id)}
                          variant='outlined'
                          color='success'
                        >
                          Booking Confirmed
                        </Button>
                      </div>
                    ) : row?.paymentStatus === 'completed' ? (
                      <div>
                        <Button
                          onClick={() => vewBookingById(row._id)}
                          variant='outlined'
                        >
                          Booking Completed
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button
                          onClick={() => vewBookingById(row._id)}
                          variant='outlined'
                          color='warning'
                        >
                          Payment Pending...
                        </Button>
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
  );
}
