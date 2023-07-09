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
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { toast } from 'react-toastify';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import CustomizedDialogs from '../DialogBox/DialogBox.tsx';
import ViewYourBookings from '../ViewYourBookings.jsx';

export default function BasicTable(props) {
  const history = useNavigate();

  const [loading, setLoading] = useState(false);
  const [organisersData, setOrganisersData] = useState(null);

  const [inpval, setInpval] = useState({
    artistsName: '',
    requestDate: '',
    eventName: '',
    bookedBy: '',
    bookedFor: '',
    requestedBy: '',
  });

  const organiserId = localStorage.getItem('organiserId');

  const handleJoinedVenue = async (id) => {
    let token = localStorage.getItem('artistsdatatoken');

    const response = await fetch(
      `http://localhost:8010/getOrganiserById/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );

    const data = await response.json();
    setOrganisersData(data);
    console.log({ organisersData });

    const url1 = `http://localhost:8010/updateArtistsforOrganiser/${props?.logindata?.ValidUserOne?._id}`;

    setLoading(true);
    const text = 'Are you want to Join?';

    let res = await fetch(url1, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organiserId: data?._id,
      }),
    });

    const url = `http://localhost:8010/JoinWithVenues`;

    try {
      setLoading(true);
      const text = 'Are you want to Join?';

      if (window.confirm(text) == true) {
        let res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            artistsName: props?.logindata?.ValidUserOne?.fname,
            eventName: data?.venueName,
            requestedBy: props?.logindata?.ValidUserOne?._id,
            requestDate: new Date(),
            joinWith: data?._id,
            photo: data?.photo,
            artistsPhoto: props?.logindata?.ValidUserOne?.photo,
          }),
        });
        toast.success(`your request is send to ${data?.venueName} !!`);

        localStorage.setItem('organiserId', data?._id);

        setTimeout(function () {
          window.location = `/artists/join_venue`;
        }, 2000);
      } else {
        toast.error("Request cann't send");
        // setLoading(false);
        // setTimeout(function () {
        //   return;
        // }, 2000);
      }
    } catch (err) {
      console.log(err);
    }
    // } finally {
    //   setLoading(false);
    //   setTimeout(function () {
    //     window.location = '/admin/view-users';
    //   }, 2000);
    // }
  };
  const path = 'http://localhost:8010/public/images/';
  const getUserById = async (id) => {
    // let token = localStorage.getItem('artistsdatatoken');

    history(`/admin/view-users/${id}`);
  };

  const setVal = (e) => {
    // console.log(e.target.value);

    setInpval({ ...inpval, [e.target.name]: e.target.value });
  };
  const handleVerified = async (id) => {
    let token = localStorage.getItem('artistsdatatoken');
    let res = [];
    try {
      setLoading(true);

      const text = 'Are you want to verify this Organiser?';

      if (window.confirm(text) == true) {
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
        if (res.status == 401 || res.status == 404) {
          toast.error('User not Verified Successfully');
        } else {
          toast.success('User Verified Successfully');
          window.location = '/admin/view-users';
        }
      } else {
        toast.warn('User not verified');
        return;
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      window.location = '/admin/view-users';
    }
  };
  console.log(props?.logindata?.ValidUserOne?.organiserId);

  return (
    <>
      {props?.logindata?.ValidUserOne?.organiserId ===
      '643654594db3ac9a63fb4f1a' ? (
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
                      <b>Email</b>
                    </TableCell>
                    <TableCell width='10%' align='center'>
                      <b>Mobile</b>
                    </TableCell>
                    <TableCell width='10%' align='center'>
                      <b>Address</b>
                    </TableCell>
                    <TableCell width='10%' align='center'>
                      <b>PIN Code</b>
                    </TableCell>
                    <TableCell width='10%' align='center'>
                      <b>Action</b>
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
                        <div className='w-[50%] break-words mx-auto'>
                          {row?.email}
                        </div>
                      </TableCell>
                      <TableCell align='center'>{row?.phone}</TableCell>
                      <TableCell align='center'>
                        {row?.area + ', ' + row?.city + ' (' + row?.state + ')'}
                      </TableCell>
                      <TableCell align='center'>{row?.pinCode}</TableCell>
                      <TableCell align='center'>
                        <Tooltip title='Join Venue'>
                          <Button
                            variant='outlined'
                            className='cursor-pointer'
                            color='info'
                            onClick={() => handleJoinedVenue(row?._id)}
                          >
                            <AddBusinessIcon />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </div>
      ) : (
        <div>
          <ViewYourBookings
            path={path}
            logindata={props?.logindata}
            id={props?.logindata?.ValidUserOne?.organiserId}
          />
        </div>
      )}
    </>
  );
}
