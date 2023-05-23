import React, { useEffect, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../ContextProvider/Context';
import { ToastContainer, toast } from 'react-toastify';

export default function Home() {
  const { logindata, setLoginData } = useContext(LoginContext);

  const [data, setData] = useState(false);

  const history = useNavigate();

  const HomeValid = async () => {
    let token = localStorage.getItem('artistsdatatoken');

    const res = await fetch('/artistsvalid', {
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
      setTimeout(function () {
        window.location = '/artists/login';
      }, 1000);
    } else {
      console.log('user verify');
      setLoginData(data);
      history('/artists');
    }
  };

  useEffect(() => {
    HomeValid();
    setData(true);
  }, []);
  return (
    <div>
      <ToastContainer />
    </div>
  );
}
