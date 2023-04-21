import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../ContextProvider/Context';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { ToastContainer, toast } from 'react-toastify';
import { Avatar, Menu, MenuItem } from '@mui/material';
import man from '../../assests/img/man.png';
import axios from 'axios';

const AdminProfile = () => {
  const { logindata, setLoginData } = useContext(LoginContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const [data, setData] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const history = useNavigate();

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
      history('/admin/profile');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      DashboardValid();
      setData(true);
    }, 2000);
  }, []);
  console.log({ logindata });
  return (
    <>
      {data ? (
        <>
          <div className='flex flex-col items-center justify-center gap-4 mt-5'>
            <div>
              <img
                alt='avatar'
                src={man}
                className='h-40 rounded-full shadow-md'
              />
            </div>
            <div>
              <h1 className='uppercase'>
                {logindata ? logindata.ValidUserOne.fname : ''}
              </h1>
            </div>
          </div>
          <div className='flex justify-end p-5'>
            <div
              className='cursor-pointer underline text-red-400'
              onClick={handleClick}
            >
              Want to Change Your Password?
            </div>
            <Menu
              id='basic-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {logindata.ValidUserOne && (
                <>
                  <MenuItem>
                    <a href='mailto:mailbuddy98@gmail.com'>contact with us!</a>
                  </MenuItem>
                </>
              )}
            </Menu>
          </div>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          Loading... &nbsp;
          <CircularProgress />
        </Box>
      )}
      <ToastContainer />
    </>
  );
};

export default AdminProfile;
