import { Box, Button, CircularProgress } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BasicTable from './DataTable';
import { LoginContext } from '../ContextProvider/Context';
import { toast } from 'react-toastify';

export default function BookingDetails() {
  const [userData, setUserData] = useState([]);

  const { logindata, setLoginData } = useContext(LoginContext);

  const { id } = useParams();
  const history = useNavigate();

  const [data, setData] = useState(false);

  const DashboardValid = async () => {
    let token = localStorage.getItem('admindatatoken');

    const res = await fetch('/validadmin', {
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
      history('/admin/view-bookings');
    }
  };

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
    setData(true);
    DashboardValid();
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
