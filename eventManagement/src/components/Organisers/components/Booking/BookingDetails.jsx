import { Box, Button, CircularProgress } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BasicTable from './DataTable';

export default function BookingDetailsOrganiser() {
  const [organisersBookingList, setOrganisersBookingList] = useState([]);

  const { id } = useParams();

  const [data, setData] = useState(false);
  const organiserId = localStorage.getItem('userId');

  const ViewYourOrganisersBookings = async () => {
    const res = await fetch(
      `http://localhost:8010/getOrganiserBookingDetails/${organiserId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();
    console.log({ data });
    setOrganisersBookingList(data);
    // setVisible(true);
  };

  const foodList = organisersBookingList
    ?.map((item, index) => item.foodList)
    .toString();

  const final = foodList?.replace(
    /{"name":"|","code":"Premium"}|","code":"Normal"}/gi,
    ''
  );

  useEffect(() => {
    ViewYourOrganisersBookings();
    setData(true);
  }, []);
  return (
    <div className='flex md:flex-row flex-col sm:gap-6 gap-2 justify-center md:items-start items-center m-10'>
      <div className='m-4'>
        {organisersBookingList.length > 0 ? (
          <div>
            <BasicTable users={organisersBookingList} />
          </div>
        ) : (
          <div className='flex justify-center flex-col items-center gap-3'>
            <div>
              <img
                className='md:h-96 h-60'
                src='https://cdn.dribbble.com/users/8436/screenshots/3139896/media/826c6e7d67e456b67d99574bc8d2453e.gif'
              />
            </div>
            <div className='font-secondary font-bold uppercase text-base md:text-3xl'>
              <a href={`/`}>No Booking Yet...&nbsp;</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
