import React, { useEffect, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../ContextProvider/Context';
import { ToastContainer, toast } from 'react-toastify';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { CircularProgress } from '@mui/material';

export default function Home() {
  const { logindata, setLoginData } = useContext(LoginContext);

  const [data, setData] = useState(false);
  const [organiserData, setOrganiserData] = useState(null);

  let organiserId = logindata?.ValidUserOne?.organiserId;
  console.log(organiserId);
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
  const ViewYourBookings = async () => {
    const res = await fetch(
      `http://localhost:8080/viewJoinedDataUsingArtistsId/${organiserId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();
    setOrganiserData(data);
  };

  useEffect(() => {
    HomeValid();
    setData(true);
    setTimeout(function () {
      ViewYourBookings();
    }, 3000);
  }, []);

  console.log({ organiserData });
  const path = 'http://localhost:8080/public/images/';

  const header = (
    <>
      {organiserData?.length === 0 ? (
        <>
          {organiserData ? (
            <div className='flex flex-col gap-4'>
              {organiserData?.map((item, index) => (
                <div key={index}>
                  {' '}
                  <div>Your Organization:</div>
                  <img alt='Card' src={`${path}${item?.joinWith?.photo}`} />
                </div>
              ))}
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
        </>
      ) : (
        <div>
          You are not connected with any organisation{' '}
          <a href='/artists/join_venue' className='underline'>
            Please join a organisation
          </a>
        </div>
      )}
    </>
  );
  const footer = (
    <div className='flex flex-wrap justify-content-end gap-2'>
      <Button label='Save' icon='pi pi-check' />
      <Button
        label='Cancel'
        icon='pi pi-times'
        className='p-button-outlined p-button-secondary'
      />
    </div>
  );
  return (
    <div>
      <div className='card my-10 flex justify-center'>
        <Card
          title='Title'
          subTitle='Subtitle'
          footer={footer}
          header={header}
          className='md:w-[25rem] border shadow-xl p-5'
        >
          <p className='m-0'>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore
            sed consequuntur error repudiandae numquam deserunt quisquam
            repellat libero asperiores earum nam nobis, culpa ratione quam
            perferendis esse, cupiditate neque quas!
          </p>
        </Card>
      </div>
      <ToastContainer />
    </div>
  );
}
