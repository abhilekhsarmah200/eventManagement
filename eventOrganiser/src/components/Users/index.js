import React, { useEffect, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../ContextProvider/Context';
import { ToastContainer, toast } from 'react-toastify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import { Avatar, Box, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

export default function Home() {
  const { logindata, setLoginData } = useContext(LoginContext);

  const [data, setData] = useState(false);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  const history = useNavigate();

  const HomeValid = async () => {
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
      history('/organiser');
    }
  };

  const UsersList = async () => {
    let token = localStorage.getItem('admindatatoken');
    let res = [];
    try {
      setLoading(true);
      res = await fetch('http://localhost:8080/getallorganisers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        // body: JSON.stringify({ users }),
      });
    } catch (error) {
      console.log({ error });
    } finally {
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    }
  };

  const getVenuePhotosById = async (id) => {
    // let token = localStorage.getItem('admindatatoken');

    history(`/organiser/view_venuePhotos/${id}`);
  };

  useEffect(() => {
    HomeValid();
    UsersList();
    setData(true);
  }, []);
  return (
    <div>
      <div>
        {users?.map((row, index) => (
          <div className='flex'>
            <Tooltip title='view'>
              <Button
                variant='outlined'
                className='cursor-pointer'
                color='success'
                onClick={() => getVenuePhotosById(row._id)}
              >
                <VisibilityIcon />
              </Button>
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
}
