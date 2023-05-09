import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../ContextProvider/Context';
import { ToastContainer, toast } from 'react-toastify';

const Error = () => {
  const { logindata, setLoginData } = useContext(LoginContext);

  const [data, setData] = useState(false);

  const history = useNavigate();

  const ErrorValid = async () => {
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
      history('*');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      ErrorValid();
      setData(true);
    }, 2000);
  }, []);
  return (
    <>
      {data ? (
        <div className='container'>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src='https://media0.giphy.com/media/kfS15Gnvf9UhkwafJn/giphy.gif?cid=6c09b9521fltv8bdxou06hvacgoxsl08cqhwut9oi2koarug&rid=giphy.gif&ct=g'
              alt='error'
              style={{ width: '100px', marginBottom: 20 }}
            />
            {/* <h1 className="mb-3">404 ERROR </h1> */}
            <h2 className='mb-3'>PAGE NOT FOUND</h2>
            <a
              href='/organiser'
              className='btn btn-primary'
              style={{ fontSize: 18 }}
            >
              {' '}
              Back To Home Page{' '}
            </a>
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
    </>
  );
};

export default Error;
