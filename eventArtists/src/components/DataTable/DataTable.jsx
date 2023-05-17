import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Avatar, Box, Button, CircularProgress } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { toast } from 'react-toastify';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate, NavLink } from 'react-router-dom';
// import ViewDetailedOrganisers from '../Admin/ViewDetailedOrganisers';
import CustomizedDialogs from '../DialogBox/DialogBox.tsx';

export default function BasicTable(props) {
  const history = useNavigate();

  const [loading, setLoading] = useState(false);
  const [organisersData, setOrganisersData] = useState('');

  const handleJoinedVanue = async (id) => {
    let token = localStorage.getItem('artistsdatatoken');

    let res = [];
    try {
      setLoading(true);
      const text = 'Are you want to delete?';

      if (window.confirm(text) == true) {
        res = await fetch(`http://localhost:8080/deleteorganiser/${id}`, {
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

  const getUserById = async (id) => {
    // let token = localStorage.getItem('artistsdatatoken');

    history(`/admin/view-users/${id}`);
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
    let token = localStorage.getItem('artistsdatatoken');
    let res = [];
    try {
      setLoading(true);

      const text = 'Are you want to verify this Organiser?';

      if (window.confirm(text) == true) {
        res = await fetch(`http://localhost:8080/updateorganiser/${id}`, {
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
                  <b>Vanue Name</b>
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
                        <CustomizedDialogs img={row?.photo} path={props.path} />
                      </div>
                    ) : (
                      <div className='flex justify-center'>
                        <ImageIcon
                          style={{ fontSize: '3rem', color: 'grey' }}
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell align='center'>{row?.vanueName}</TableCell>
                  <TableCell align='center'>{row?.fname}</TableCell>
                  <TableCell align='center'>
                    <div className='w-[50%] break-words mx-auto'>
                      {row?.email}
                    </div>
                  </TableCell>
                  <TableCell align='center'>{row?.phone}</TableCell>
                  <TableCell align='center'>{row?.address}</TableCell>
                  <TableCell align='center'>{row?.pinCode}</TableCell>
                  <TableCell align='center'>
                    <Tooltip title='Join Vanue'>
                      <Button
                        variant='outlined'
                        className='cursor-pointer'
                        color='info'
                        onClick={() => handleJoinedVanue(row._id)}
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
  );
}