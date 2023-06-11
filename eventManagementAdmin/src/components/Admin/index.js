import { Box, Button, CircularProgress } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../ContextProvider/Context';
import { ToastContainer, toast } from 'react-toastify';

export default function Admin() {
  const { logindata, setLoginData } = useContext(LoginContext);

  const [data, setData] = useState(false);

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
    DashboardValid();
    setData(true);
  }, []);
  console.log({ logindata });
  return (
    <div>
      {data ? (
        <>
          <Button variant='outlined'>
            <a href='/admin/view-users'>View Users</a>
          </Button>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
