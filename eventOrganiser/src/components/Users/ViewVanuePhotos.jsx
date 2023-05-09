import {
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../ContextProvider/Context';
import { ToastContainer, toast } from 'react-toastify';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HotelIcon from '@mui/icons-material/Hotel';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function ViewVanuePhotos() {
  const { logindata, setLoginData } = useContext(LoginContext);

  const [organisersData, setOrganisersData] = useState([]);

  const { id } = useParams();

  const [data, setData] = useState(false);

  const history = useNavigate();

  const organiserById = async () => {
    try {
      const res = await fetch(`http://localhost:8080/vanuephotos/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setOrganisersData(data);
      console.log({ data });
    } catch (error) {
      console.log({ error });
    }
  };

  const DashboardValid = async () => {
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
      toast.error(`please login first!`, {
        position: 'top-center',
      });
      history('/organiser/login');
    } else {
      console.log('organiser verify');
      setLoginData(data);
      history(`/organiser/view_vanuePhotos/${id}`);
    }
  };

  useEffect(() => {
    DashboardValid();
    //   getUserById();
    organiserById();
    setData(true);
  }, []);

  console.log({ organisersData });
  const path = 'http://localhost:8080/public/images/';

  return (
    <div className='px-10 py-4'>
      {organisersData ? (
        <>
          <div className='flex gap-2 bg-[#C36AC4] max-w-fit py-1 px-3 rounded-md'>
            <a className='text-white underline' href='/admin/dashboard/'>
              Admin Dashboard
            </a>
            <ArrowForwardIosIcon style={{ color: 'white' }} />
            <a className='text-white underline' href='/admin/view-users/'>
              View Users
            </a>
          </div>
          <div className='flex gap-4 items-center flex-col'>
            <div>
              <img
                className='h-[50vh] rounded-lg shadow-xl border'
                src={`${path}${organisersData?.photo}`}
              />
            </div>
            <div className='flex md:flex-row flex-col mt-5 md:w-[40rem] w-full gap-4'>
              <TextField
                id='input-with-icon-textfield'
                value={organisersData?.vanueName}
                style={{ width: '100%' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <HotelIcon />
                    </InputAdornment>
                  ),
                }}
                disabled
                variant='standard'
              />
              <TextField
                id='input-with-icon-textfield'
                value={organisersData?.fname}
                style={{ width: '100%' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
                disabled
                variant='standard'
              />
            </div>
            <div className='flex md:flex-row flex-col md:w-[40rem] w-full gap-4'>
              <TextField
                id='input-with-icon-textfield'
                value={organisersData?.email}
                style={{ width: '100%' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <ContactMailIcon />
                    </InputAdornment>
                  ),
                }}
                disabled
                variant='standard'
              />

              <TextField
                id='input-with-icon-textfield'
                value={organisersData?.phone}
                style={{ width: '100%' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LocalPhoneIcon />
                    </InputAdornment>
                  ),
                }}
                disabled
                variant='standard'
              />
            </div>
            <div className='flex md:flex-row flex-col md:w-[40rem] w-full gap-4'>
              <TextField
                id='input-with-icon-textfield'
                value={organisersData?.pinCode}
                style={{ width: '100%' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PersonPinCircleIcon />
                    </InputAdornment>
                  ),
                }}
                disabled
                variant='standard'
              />
            </div>
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
    </div>
  );
}
