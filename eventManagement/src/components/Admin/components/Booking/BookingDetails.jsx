import { Box, Button, CircularProgress } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BasicTable from './DataTable';
import { LoginContext } from '../ContextProvider/Context';
import { toast } from 'react-toastify';

export default function BookingDetails() {
  const [userData, setUserData] = useState([]);

  const viewDetails = async () => {
    const res = await fetch(`http://localhost:8010/getallBookingDetails`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

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
  }, []);
  return (
    <div className='flex md:flex-row flex-col sm:gap-6 gap-2 justify-center md:items-start items-center my-10'>
      <div className='m-4'>
        {userData.length > 0 ? (
          <div>
            <BasicTable users={userData} />
          </div>
        ) : (
          <div className='text-red-400'>No Booking Yet...&nbsp;</div>
        )}
      </div>
    </div>
  );
}
