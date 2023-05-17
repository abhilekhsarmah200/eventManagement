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

export default function ViewDetailedOrganisers() {
  const { logindata, setLoginData } = useContext(LoginContext);

  const [organisersData, setOrganisersData] = useState([]);

  const { id } = useParams();

  const [data, setData] = useState(false);

  const history = useNavigate();

  const viewDetails = async () => {
    const res = await fetch(`http://localhost:8080/viewAllDetails/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    console.log({ organisersData });
    setOrganisersData(data);
  };

  const DashboardValid = async () => {
    let token = localStorage.getItem('usersdatatoken');

    const res = await fetch('/validuser', {
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
      history('/login');
    } else {
      console.log('admin verify');
      setLoginData(data);
      // history(`/admin/view-users/${id}`);
    }
  };

  useEffect(() => {
    DashboardValid();
    viewDetails();
    setData(true);
  }, []);

  console.log({ organisersData });
  const path = 'http://localhost:8080/public/images/';

  return (
    <div className='px-10 py-4'>
      {organisersData ? (
        <>
          <div>
            {organisersData
              ?.map((data, index) => (
                <div className='flex gap-4 items-center flex-col'>
                  <div>
                    <img
                      className='h-40 w-40 rounded-full shadow-xl border'
                      src={`${path}${data?.organiser_Id?.photo}`}
                    />
                  </div>

                  <div className='flex md:flex-row flex-col mt-5 md:w-[40rem] w-full gap-4'>
                    <TextField
                      id='input-with-icon-textfield'
                      value={data?.organiser_Id?.vanueName}
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
                      value={data?.organiser_Id?.fname}
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
                      value={data?.organiser_Id?.email}
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
                      value={data?.organiser_Id?.phone}
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
                      value={data?.organiser_Id?.pinCode}
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
              ))
              .slice(0, 1)}
            <div>
              <div className='flex'>Vanue Photos:</div>
              <div className='flex justify-center gap-4 flex-wrap'>
                {organisersData?.map((data, index) => (
                  <div className='flex justify-center gap-4 mt-5 flex-wrap'>
                    {data?.imgCollection?.map((item, index) => (
                      <img
                        src={item}
                        className='lg:h-80 sm:h-40 h-32 border shadow-xl rounded-lg'
                      />
                    ))}
                  </div>
                ))}
              </div>
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
