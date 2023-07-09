import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Avatar, Menu, MenuItem } from '@mui/material';
import man from '../../assests/img/man.png';

const AdminProfile = ({ logindata }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const path = 'http://localhost:8010/public/images/';

  return (
    <>
      <>
        <div className='flex flex-col md:w-[40%] w-[80%] py-4 mx-auto bg-white items-center justify-center gap-4 mt-5'>
          <div>
            <img
              src={logindata ? `${path}${logindata?.ValidUserOne?.photo}` : man}
              alt={logindata?.ValidUserOne?.photo}
              className='h-40 rounded-full shadow-md'
            />
          </div>
          <div>
            <h1 className=''>
              {logindata ? logindata?.ValidUserOne?.email : ''}
            </h1>
          </div>
          <div>
            <h1 className='uppercase'>
              {logindata ? logindata?.ValidUserOne?.fname : ''}
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
            <>
              <MenuItem>
                <a href='mailto:mailbuddy98@gmail.com?subject=Request for change password&body=Hey Event Partners, I want to change my password'>
                  contact with us!
                </a>
              </MenuItem>
            </>
          </Menu>
        </div>
      </>

      <ToastContainer />
    </>
  );
};

export default AdminProfile;
