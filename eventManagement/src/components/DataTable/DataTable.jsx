import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { toast } from 'react-toastify';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import CustomizedDialogs from '../CustomComponents/DialogBox/DialogBox.tsx';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

export default function BasicTable(props) {
  const history = useNavigate();

  const [loading, setLoading] = useState(false);
  const [organisersData, setOrganisersData] = useState('');

  const getUserById = async (id) => {
    // let token = localStorage.getItem('usersdatatoken');

    history(`/bookvenue/${id}`);
  };

  console.log({ organisersData });
  const [inpval, setInpval] = useState({
    validUser: false,
  });

  const setVal = (e) => {
    // console.log(e.target.value);

    setInpval({ ...inpval, [e.target.name]: e.target.value });
  };
  const handleVerified = async (id) => {
    let token = localStorage.getItem('usersdatatoken');
    let res = [];
    try {
      setLoading(true);

      const text = 'Are you want to verify this Organiser?';

      if (window.confirm(text) === true) {
        res = await fetch(`http://localhost:8010/updateorganiser/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });

        setInpval({
          ...inpval,
          validUser: true,
        });
        if (res.status === 401 || res.status === 404) {
          toast.error('User not Verified Successfully');
        } else {
          toast.success('User Verified Successfully');
          window.location = '/';
        }
      } else {
        toast.warn('User not verified');
        return;
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      window.location = '/';
    }
  };

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
                  <b>Image</b>
                </TableCell>
                <TableCell width='10%' align='center'>
                  <b>Venue Name</b>
                </TableCell>
                <TableCell width='10%' align='center'>
                  <b>Manager Name</b>
                </TableCell>
                <TableCell width='10%' align='center'>
                  <b>Address</b>
                </TableCell>
                <TableCell width='10%' align='center'>
                  <b>PIN Code</b>
                </TableCell>
                <TableCell width='10%' align='center'>
                  <b>Rating</b>
                </TableCell>
                <TableCell width='10%' align='center'>
                  <b>Book Your Venue</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props?.users?.map((row, index) => (
                <TableRow
                  key={row?.fname}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component='th' scope='row'>
                    {row?.photo ? (
                      <div className='flex justify-center'>
                        <CustomizedDialogs
                          img={row?.photo}
                          id={row?._id}
                          path={props.path}
                        />
                      </div>
                    ) : (
                      <div className='flex justify-center'>
                        <ImageIcon
                          style={{ fontSize: '3rem', color: 'grey' }}
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell align='center'>{row?.venueName}</TableCell>
                  <TableCell align='center'>{row?.fname}</TableCell>
                  <TableCell align='center'>
                    {row?.area}, {row?.city} ({row?.state})
                  </TableCell>
                  <TableCell align='center'>{row?.pinCode}</TableCell>
                  <TableCell align='center'>
                    <Tooltip title={`${row?.totalRating} ⭐`}>
                      <div className='flex justify-center items-center gap-2'>
                        <div>
                          <Rating
                            name='text-feedback'
                            value={row?.totalRating}
                            readOnly
                            precision={0.5}
                            style={{ color: '#472967' }}
                            emptyIcon={
                              <StarIcon
                                style={{ opacity: 0.55 }}
                                fontSize='inherit'
                              />
                            }
                          />
                        </div>
                        <div className='cursor-pointer'>
                          <a href={`/bookvenue/${row._id}#ratings`}>
                            ({row?.ratings?.length})ratings
                          </a>
                        </div>
                      </div>
                    </Tooltip>
                  </TableCell>
                  <TableCell align='center'>
                    <div>
                      <Button
                        onClick={() => getUserById(row._id)}
                        variant='contained'
                      >
                        Book
                      </Button>
                    </div>
                    {/* <div>
                      <Button
                        variant='contained'
                        onClick={() => getUserById(row._id)}
                      >
                        View Users
                      </Button>
                    </div> */}
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
