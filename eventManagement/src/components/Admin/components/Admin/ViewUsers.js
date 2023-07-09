import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { LoginContext } from '../ContextProvider/Context';
import DataTable from '../DataTable/DataTable';
import { Box, CircularProgress } from '@mui/material';
import SmallDevicesTable from '../DataTable/SmallDevicesTable';
import SimpleDataTableOrganisers from '../DataTable/OrganisersTable';
export default function ViewUsersAdmin({ logindata }) {
  const [users, setUsers] = useState(null);

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

  const UsersList = async () => {
    let token = localStorage.getItem('admindatatoken');
    let res = [];
    try {
      setLoading(true);
      res = await fetch('http://localhost:8010/getallorganisers', {
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

  console.log({ users });

  useEffect(() => {
    UsersList();
  }, []);
  const path = 'http://localhost:8010/public/images/';
  return (
    <>
      <div className='lg:p-5 p-2 flex justify-center flex-col'>
        <div>
          {logindata ? (
            <>
              <div className=' py-1'>
                <SimpleDataTableOrganisers users={users} path={path} />
              </div>
            </>
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
