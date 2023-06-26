import React, { useEffect, useContext, useState } from 'react';
import { LoginContext } from '../ContextProvider/Context';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import DataTable from './DataTable/DataTable';
import { Box, CircularProgress } from '@mui/material';

export default function AddWithVenues({ logindata }) {
  const [data, setData] = useState(false);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  const history = useNavigate();

  const UsersList = async () => {
    let token = localStorage.getItem('artistsdatatoken');
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

  const path = 'http://localhost:8010/public/images/';

  useEffect(() => {
    // setTimeout(() => {

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
                <DataTable users={users} logindata={logindata} path={path} />
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
