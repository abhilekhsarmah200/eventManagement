import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Avatar, Button } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import { toast } from 'react-toastify';

export default function BasicTable(props) {
  const handleDelete = async (id) => {
    let token = localStorage.getItem('admindatatoken');
    let res = [];
    try {
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
        window.location = '/admin/view-users';
      } else {
        toast.error('User not deleted');
        return;
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };
  return (
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
                      <img
                        className='rounded-md h-20'
                        src={`${props.path}${row?.photo}`}
                      />
                    </div>
                  ) : (
                    <div className='flex justify-center'>
                      <ImageIcon style={{ fontSize: '3rem', color: 'grey' }} />
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
                  <div className='flex'>
                    <Button
                      startIcon={<PreviewIcon />}
                      variant='outlined'
                      className='cursor-pointer'
                      color='error'
                      onClick={() => handleDelete(row._id)}
                    >
                      View
                    </Button>
                    <div className='text-4xl px-1'>/</div>
                    <Button
                      startIcon={<DeleteIcon />}
                      variant='outlined'
                      className='cursor-pointer'
                      color='error'
                      onClick={() => handleDelete(row._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
