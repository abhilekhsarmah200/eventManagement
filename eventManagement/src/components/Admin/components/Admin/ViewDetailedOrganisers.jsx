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
import ViewOrganisersRelatedphotos from '../CustomComponents/ViewOrganisersRelatedphotos';

export default function AdminViewDetailedOrganisers() {
  const [organisersData, setOrganisersData] = useState([]);

  const { id } = useParams();

  const organiserById = async () => {
    try {
      const res = await fetch(`http://localhost:8010/getOrganiserById/${id}`, {
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

  useEffect(() => {
    organiserById();
  }, []);

  console.log({ organisersData });
  const path = 'http://localhost:8010/public/images/';

  return (
    <div className='px-10 py-4'>
      {organisersData ? (
        <>
          <div className='flex gap-2 max-w-fit py-1 px-3 rounded-md'>
            <a className='text-black' href='/admin/profile'>
              Admin Dashboard
            </a>
            <ArrowForwardIosIcon style={{ color: 'black' }} />
            <a className='text-black' href='/admin/view-users/'>
              View Users
            </a>
          </div>
          <div className='flex gap-4 items-center flex-col'>
            <div>
              <img
                className='h-52 w-52 rounded-full shadow-xl border'
                src={`${path}${organisersData?.photo}`}
              />
            </div>
            <div className='flex md:flex-row flex-col mt-5 md:w-[40rem] w-full gap-4'>
              <TextField
                id='input-with-icon-textfield'
                value={organisersData?.venueName}
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
      <div>
        <ViewOrganisersRelatedphotos />
      </div>
    </div>
  );
}
