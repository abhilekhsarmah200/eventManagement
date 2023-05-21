import { Box, Button, CircularProgress } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BasicTable from './DataTable';

export default function BookingDetails() {
  const [userData, setUserData] = useState([]);

  const { id } = useParams();

  const [data, setData] = useState(false);

  const viewDetails = async () => {
    const res = await fetch(
      `http://localhost:8010/viewBookingsByUserId/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();
    setUserData(data);
    console.log({ data });
  };

  const foodList = userData?.map((item, index) => item.foodList).toString();

  const final = foodList?.replace(
    /{"name":"|","code":"Premium"}|","code":"Normal"}/gi,
    ''
  );

  console.log({ userData });
  useEffect(() => {
    viewDetails();
    setData(true);
  }, []);
  return (
    <div className='flex md:flex-row flex-col sm:gap-6 gap-2 justify-center md:items-start items-center m-10'>
      <div className='m-4'>
        {userData.length > 0 ? (
          <div>
            <BasicTable users={userData} />
          </div>
        ) : (
          <div>
            No Booking Yet...&nbsp;
            <span>
              <a className='underline text-blue-500' href='/'>
                search your event
              </a>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
