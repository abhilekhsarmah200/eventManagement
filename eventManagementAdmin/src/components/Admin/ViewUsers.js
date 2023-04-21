import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { LoginContext } from '../ContextProvider/Context';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Menu, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
export default function ViewUsers({ datas }) {
  const [users, setUsers] = useState(null);
  const { logindata, setLoginData } = useContext(LoginContext);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const history = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const DashboardValid = async () => {
    let token = localStorage.getItem('admindatatoken');

    const res = await fetch('/validadmin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    const data = await res.json();

    if (data.status == 401 || !data) {
      toast.error(`please login first!`, {
        position: 'top-center',
      });
      history('/admin/login');
    } else {
      console.log('user verify');
      setLoginData(data);
      history('/admin/view-users');
    }
  };

  const UsersList = async () => {
    let token = localStorage.getItem('admindatatoken');
    let res = [];
    try {
      setLoading(true);
      res = await fetch('http://localhost:8080/getallorganisers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        // body: JSON.stringify({ users }),
      });
    } catch (error) {
      console.log({ error });
    } finally {
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    }
  };
  const ids = users?.map((element, index) => element?._id);

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
      } else {
        return;
      }
    } catch (err) {
      console.log(err);
    } finally {
      toast.success('User deleted successfully');
      window.location = '/admin/view-users';
    }
  };

  //   const deleteUser = async () => {
  //     let token = localStorage.getItem('admindatatoken');

  //     const res = await fetch(`http://localhost:8080/deleteorganiser/${id}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: token,
  //       },
  //       // body: JSON.stringify({ users }),
  //     });
  //     toast.success(`user delted successfully`, {
  //       position: 'top-center',
  //     });
  //     // const data = await res.json();
  //   };
  console.log({ users });

  useEffect(() => {
    setTimeout(() => {
      DashboardValid();
      UsersList();
    }, 2000);
  }, []);
  return (
    <>
      <div className='p-5 flex justify-center flex-col'>
        <div className='relative flex gap-10 flex-wrap'>
          <div className='flex flex-col justify-center items-center'>
            <div>Sl No:</div>
            <div>
              {loading ? (
                <div className='flex flex-col items-center'>
                  <div>Loading...</div>
                  <CircularProgress color='secondary' />
                </div>
              ) : (
                <>
                  {users.length === 0 ? (
                    <div className='absolute text-red-500 w-full top-0 mt-8 mx-auto'>
                      Organisers data unavailable...
                    </div>
                  ) : (
                    <>
                      {users?.map((element, index) => (
                        <div className='py-1'>{index + 1}</div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className='flex flex-col justify-center items-start'>
            <div>Name:</div>
            <div>
              {loading ? (
                <div className='flex flex-col items-center'>
                  <div>Loading...</div>
                  <CircularProgress color='secondary' />
                </div>
              ) : (
                <>
                  {users?.map((element, index) => (
                    <div className='py-1'>{element?.fname}</div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className='flex flex-col justify-center items-start'>
            <div>Email:</div>
            <div>
              {loading ? (
                <div className='flex flex-col items-center'>
                  <div>Loading...</div>
                  <CircularProgress color='secondary' />
                </div>
              ) : (
                <>
                  {users?.map((element, index) => (
                    <div className='py-1'>{element?.email}</div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className='flex flex-col justify-center items-start'>
            <div>Mobile:</div>
            <div>
              {loading ? (
                <div className='flex flex-col items-center'>
                  <div>Loading...</div>
                  <CircularProgress color='secondary' />
                </div>
              ) : (
                <>
                  {users?.map((element, index) => (
                    <div className='py-1'>
                      <a href={`tel:${element.phone}`}>{element?.phone}</a>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className='flex flex-col justify-center items-start'>
            <div>Address:</div>
            <div>
              {loading ? (
                <div className='flex flex-col items-center'>
                  <div>Loading...</div>
                  <CircularProgress color='secondary' />
                </div>
              ) : (
                <>
                  {users?.map((element, index) => (
                    <div className='py-1'>{element?.address}</div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className='flex flex-col justify-center items-start'>
            <div>Actions:</div>
            <div>
              {loading ? (
                <div className='flex flex-col items-center'>
                  <div>Loading...</div>
                  <CircularProgress color='secondary' />
                </div>
              ) : (
                <>
                  {users?.map((element, index) => (
                    <div className='py-1' key={index}>
                      <Button
                        startIcon={<DeleteIcon />}
                        variant='outlined'
                        className='cursor-pointer'
                        color='error'
                        onClick={() => handleDelete(element._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        <ToastContainer autoClose={2000} />
      </div>
    </>
  );
}
