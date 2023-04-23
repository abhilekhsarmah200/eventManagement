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
import axios from 'axios';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import ClearIcon from '@mui/icons-material/Clear';
import Tooltip from '@mui/material/Tooltip';

export default function AddVenue() {
  const { logindata, setLoginData } = useContext(LoginContext);

  const [data, setData] = useState(false);
  const [profileImage, setProfileImage] = useState([]);

  const setImage = (e) => {
    const setProfile = e.target.files;
    const selectedFilesArray = Array.from(setProfile);
    const imageArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    setInpval({ ...inpval, photo: e.target.files });
    console.log(e.target.files);
    setProfileImage(imageArray);
  };
  const [inpval, setInpval] = useState({
    fname: '',
    email: '',
    password: '',
    cpassword: '',
    phone: '',
    address: '',
    pinCode: '',
    photo: '',
  });

  const history = useNavigate();

  const vanueValid = async () => {
    let token = localStorage.getItem('organiserdatatoken');

    const res = await fetch('/organiservalid', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    const data = await res.json();

    if (data.status == 401 || !data) {
      toast.error('login first!!', {
        position: 'top-center',
      });
      window.location = '/organiser/login';
    } else {
      console.log('user verify');
      setLoginData(data);
      history('/organiser/add_vanue');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      vanueValid();
      setData(true);
    }, 2000);
  }, []);
  return (
    <>
      {data ? (
        <div className='flex flex-col justify-center items-center p-5 gap-4'>
          <div className='flex justify-center'>
            <Stack direction='row' alignItems='center' spacing={2}>
              <Button variant='contained' component='label'>
                Upload
                <input
                  onChange={setImage}
                  hidden
                  accept='image/jpg, image/jpeg, image/png, image/webp'
                  multiple
                  type='file'
                />
              </Button>
              <IconButton
                color='primary'
                aria-label='upload picture'
                component='label'
              >
                <input
                  onChange={setImage}
                  hidden
                  multiple
                  accept='image/jpg, image/jpeg, image/png, image/webp'
                  type='file'
                />
                <PhotoCamera />
              </IconButton>
            </Stack>
          </div>
          <div className='flex justify-center mb-4'>
            {profileImage && (
              <div className='flex gap-4 flex-wrap'>
                {profileImage?.map((img, index) => {
                  return (
                    <div className='relative'>
                      <div className='absolute top-0 right-0'>
                        <div
                          onClick={() => {
                            setProfileImage(
                              profileImage.filter((e) => e !== img)
                            );
                          }}
                        >
                          <Tooltip title='Delete Image' placement='right'>
                            <ClearIcon className='cursor-pointer hover:bg-gray-300 text-red-500 p-1 hover:text-black rounded-full' />
                          </Tooltip>
                        </div>
                      </div>
                      <div>
                        <img src={img} className='w-40 h-20 rounded-md' />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            <TextField
              id='outlined-basic'
              type='email'
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
              id='outlined-basic'
              type='text'
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
              id='outlined-basic'
              type='text'
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
                id='outlined-basic'
                type='tel'
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
                id='outlined-basic'
                type='text'
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
}
