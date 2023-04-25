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
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import Tooltip from '@mui/material/Tooltip';

export default function AddVenue() {
  const { logindata, setLoginData } = useContext(LoginContext);
  const [loginDatas, setLoginDatas] = useState([]);
  const DashboardValid = async () => {
    let token = localStorage.getItem('organiserdatatoken');

    const res = await fetch('http://localhost:8080/organiservalid', {
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
  const logindatas = logindata;
  const [inpval, setInpval] = useState({
    userId: logindatas ? logindatas?.ValidUserOne?._id : '',
    vanueName: logindatas ? logindatas?.ValidUserOne?.vanueName : '',
    phone: logindatas ? logindatas?.ValidUserOne?.phone : '',
    address: logindatas ? logindatas?.ValidUserOne?.address : '',
    pinCode: logindatas ? logindatas?.ValidUserOne?.pinCode : '',
    photo: '',
  });

  const [data, setData] = useState(false);
  const [profileImage, setProfileImage] = useState([]);

  const setImage1 = (e) => {
    let setProfile = e.target.files;
    let file = setProfile[0];
    const selectedFilesArray = Array.from(setProfile);
    const imageArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    setInpval({ ...inpval, photo: file });
    console.log(e.target.files);
    setProfileImage(imageArray);
  };

  const setVal = (e) => {
    // console.log(e.target.value);

    setInpval({ ...inpval, [e.target.name]: e.target.value });
  };

  const history = useNavigate();

  const addVanuesData = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:8080/addVanues';
    const formdata = new FormData();

    formdata.append('myFiles', inpval.photo, inpval.photo.name);
    formdata.append('userId', inpval.userId);
    formdata.append('vanueName', inpval.vanueName);
    formdata.append('phone', inpval.phone);
    formdata.append('address', inpval.address);
    formdata.append('pinCode', inpval.pinCode);

    const { userId, vanueName, phone, address, pinCode, photo } = inpval;

    if (vanueName === '') {
      toast.error('Vanue Name is required!', {
        position: 'top-center',
      });
    } else if (phone === '') {
      toast.error('mobile number required', {
        position: 'top-center',
      });
    } else if (phone.length < 10) {
      toast.error('please provide a valid number', {
        position: 'top-center',
      });
    } else if (address === '') {
      toast.error('Address required', {
        position: 'top-center',
      });
    } else if (pinCode === '') {
      toast.error('PIN Code required', {
        position: 'top-center',
      });
    } else if (photo === '') {
      toast.error('Photos are required', {
        position: 'top-center',
      });
    } else {
      // console.log("user registration succesfully done");

      try {
        let res = await axios.post(url, formdata);
        if (res.status === 422) {
          toast.error('email is already taken', {
            position: 'top-center',
          });
        } else {
          toast.success('Registration Successfully done 😃!', {
            position: 'top-center',
          });
          window.location = '/organiser';
        }
      } catch (error) {}
    }
  };
  console.log({ ...logindata?.ValidUserOne });
  useEffect(() => {
    DashboardValid();
    setData(true);
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
                  name='myFiles'
                  onChange={setImage1}
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
                  onChange={setImage1}
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
          <div className='hidden'>
            <TextField
              id='outlined-basic'
              type='text'
              onChange={setVal}
              value={inpval.userId}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              name='userId'
              className='w-[20rem]'
              label='User Id'
              variant='outlined'
              readOnly
            />
          </div>
          <div>
            <TextField
              id='outlined-basic'
              type='text'
              onChange={setVal}
              value={inpval.vanueName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <BadgeIcon />
                  </InputAdornment>
                ),
              }}
              name='vanueName'
              className='w-[20rem] uppercase'
              label='vanue Name'
              variant='outlined'
              readOnly
            />
          </div>
          <div>
            <TextField
              id='outlined-basic'
              type='text'
              onChange={setVal}
              value={inpval.address}
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
                onChange={setVal}
                value={inpval.phone}
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
                onChange={setVal}
                value={inpval.pinCode}
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
          <Button
            startIcon={<AddBusinessIcon />}
            variant='contained'
            className='btn'
            onClick={addVanuesData}
          >
            Add Vanue
          </Button>
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
