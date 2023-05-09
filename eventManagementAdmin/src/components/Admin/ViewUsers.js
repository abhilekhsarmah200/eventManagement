import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { LoginContext } from '../ContextProvider/Context';
import DataTable from '../DataTable/DataTable';
import { Box, CircularProgress } from '@mui/material';
export default function ViewUsers({ datas }) {
  const [users, setUsers] = useState(null);
  const { logindata, setLoginData } = useContext(LoginContext);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const history = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const DashboardValid = async () => {
    let token = localStorage.getItem('admindatatoken');

    const res = await fetch('http://localhost:8010/validadmin', {
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
      history('/admin/view-users');
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
  const ids = users?.map((element, index) => element?._id);

  console.log({ users });

  useEffect(() => {
    DashboardValid();
    UsersList();
  }, []);
  const path = 'http://localhost:8080/public/images/';
  return (
    <>
      <div className='p-5 flex justify-center flex-col'>
        <div>
          {logindata ? (
            <div className='py-1'>
              <DataTable users={users} path={path} />
            </div>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              Loading... &nbsp;
              <CircularProgress />
            </Box>
          )}
        </div>

        <ToastContainer autoClose={2000} />
      </div>
    </>
  );
}
