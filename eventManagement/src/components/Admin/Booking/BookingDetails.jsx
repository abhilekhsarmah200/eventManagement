import { Box, Button, CircularProgress } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminBasicTable from './DataTable';
import SimpleDataTableBookings from '../components/DataTableBookings/DataTable';

export default function AdminBookingDetails({ logindata }) {
  const [userData, setUserData] = useState([]);

  const { id } = useParams();

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
          <>
            <div className='md:text-2xl text-xl mb-5 text-center font-bold'>
              Booking List:
            </div>
            <div>
              <SimpleDataTableBookings users={userData} />
            </div>
          </>
        ) : (
          <div className='flex justify-center flex-col items-center gap-3'>
            <div>
              <img
                className='md:h-96 h-60'
                src='https://cdn.dribbble.com/users/8436/screenshots/3139896/media/826c6e7d67e456b67d99574bc8d2453e.gif'
              />
            </div>
            <div className='font-secondary font-bold uppercase text-base md:text-3xl'>
              No Booking Yet...&nbsp;
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
