import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../ContextProvider/Context';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { ToastContainer, toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import HomeIcon from '@mui/icons-material/Home';
import pIcon from '../../assets/img/man.png';
import { Button } from '@mui/material';

const DashboardOrganisers = ({ logindata }) => {
  const [data, setData] = useState(false);

  const history = useNavigate();

  const updateOrganiserDetails = async (id) => {
    const res = await fetch(`http://localhost:8010/updateorganiser/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        validUser: true,
      }),
    });

    const data = await res.json();
    if (res.status === 200) {
      toast.success(`Organiser Updated Successfully!!`, {
        position: 'top-center',
      });
      setTimeout(function () {
        window.location = `/organiser/profile`;
      }, 2000);
    }
  };

  useEffect(() => {
    setData(true);
  }, []);
  console.log({ logindata });
  const path = 'http://localhost:8010/public/images/';

  return (
    <>
      {data ? (
        <div className='flex flex-col justify-center items-center p-5 gap-4'>
          {logindata && (
            <>
              <div>
                <img
                  src={
                    logindata
                      ? `${path}${logindata?.ValidUserOne?.photo}`
                      : pIcon
                  }
                  className='h-40 rounded-md shadow-md'
                  alt=''
                />
              </div>
              <div>
                <TextField
                  disabled={true}
                  id='outlined-basic'
                  type='email'
                  value={logindata ? logindata.ValidUserOne.email : ''}
                  // onChange={setVal}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                  name='email'
                  className='w-[20rem]'
                  placeholder='Enter Your Email'
                  label='Primary Email'
                  variant='outlined'
                  readOnly
                />
              </div>
              <div>
                <TextField
                  disabled={true}
                  id='outlined-basic'
                  type='text'
                  value={logindata ? logindata.ValidUserOne.fname : ''}
                  // onChange={setVal}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <BadgeIcon />
                      </InputAdornment>
                    ),
                  }}
                  name='fname'
                  className='w-[20rem] uppercase'
                  placeholder='Enter Your Name'
                  label='Name'
                  variant='outlined'
                  readOnly
                />
              </div>
              <div>
                <TextField
                  disabled={true}
                  id='outlined-basic'
                  type='text'
                  value={
                    logindata
                      ? `${
                          logindata.ValidUserOne.area +
                          ', ' +
                          logindata.ValidUserOne.city +
                          '(' +
                          logindata.ValidUserOne.state +
                          ')'
                        }`
                      : ''
                  }
                  // onChange={setVal}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <HomeIcon />
                      </InputAdornment>
                    ),
                  }}
                  name='address'
                  className='w-[20rem]'
                  placeholder='Enter Your Address'
                  label='Address'
                  variant='outlined'
                  readOnly
                />
              </div>
              <div className='flex gap-4'>
                <div>
                  <TextField
                    disabled={true}
                    id='outlined-basic'
                    type='tel'
                    value={logindata ? logindata.ValidUserOne.phone : ''}
                    // onChange={setVal}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <LocalPhoneIcon />
                        </InputAdornment>
                      ),
                    }}
                    name='phone'
                    className='w-[9.5rem]'
                    placeholder='mobile'
                    label='Mobile Number'
                    variant='outlined'
                    readOnly
                  />
                </div>
                <div>
                  <TextField
                    disabled={true}
                    id='outlined-basic'
                    type='text'
                    value={logindata ? logindata.ValidUserOne.pinCode : ''}
                    // onChange={setVal}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <PersonPinCircleIcon />
                        </InputAdornment>
                      ),
                    }}
                    name='pinCode'
                    className='w-[9.5rem]'
                    placeholder='PinCode'
                    label='PIN Code'
                    variant='outlined'
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Button
                  variant='outlined'
                  className='btn'
                  onClick={updateOrganiserDetails}
                >
                  Sign Up
                </Button>
              </div>
            </>
          )}
        </div>
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

export default DashboardOrganisers;
