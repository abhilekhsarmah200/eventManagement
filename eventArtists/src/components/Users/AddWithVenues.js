import React, { useEffect, useContext, useState } from 'react';
import { LoginContext } from '../ContextProvider/Context';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import DataTable from '../DataTable/DataTable';
import { Box, CircularProgress } from '@mui/material';

export default function AddWithVenues() {
  const [data, setData] = useState(false);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  const { logindata, setLoginData } = useContext(LoginContext);

  const [organisersIds, setOrganisersIds] = useState([]);

  const [photosData, setPhotosData] = useState('');

  const history = useNavigate();

  const UsersList = async () => {
    let token = localStorage.getItem('artistsdatatoken');
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

  const DashboardValid = async () => {
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
      history('/artists/join_venue');
    }
  };

  localStorage.setItem('organiserId', logindata?.ValidUserOne?._id);
  const path = 'http://localhost:8080/public/images/';

  let compaireOrganiserId = localStorage.getItem('organiserId');

  useEffect(() => {
    // setTimeout(() => {
    DashboardValid();
    UsersList();
    setData(true);
    // }, 2000);
  }, []);
  return (
    <div>
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
      {/* <>
        {photosData?.users?.length > 0 ? (
          <>
            <div> Uploaded Photos:</div>
            <div className='flex justify-center gap-6 flex-wrap'>
              {photosData?.users?.map((item, index) => (
                <>
                  {item.imgCollection?.map((imgs, ind) => (
                    <img
                      className='h-32 w-40 mt-4 shadow-md border rounded-lg'
                      src={imgs}
                    />
                  ))}
                </>
              ))}
            </div>
          </>
        ) : (
          <div> Upload Venue Photos:</div>
        )}
      </>

      <FilesUploadComponent id={logindata?.ValidUserOne?._id} /> */}
    </div>
  );
}
