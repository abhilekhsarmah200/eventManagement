import { Box, Button, CircularProgress } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../../ContextProvider/Context';
import { toast } from 'react-toastify';

export default function ViewBookingDetails() {
  const [userData, setUserData] = useState([]);
  const [organisersData, setOrganisersData] = useState([]);
  const { logindata, setLoginData } = useContext(LoginContext);
  const [loading, setLoading] = useState(true);

  const history = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState(false);

  const DashboardValid = async () => {
    let token = localStorage.getItem('usersdatatoken');

    const res = await fetch('http://localhost:8010/validuser', {
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
      history('/login');
    } else {
      console.log('user verify');
      setLoginData(data);
      history(`/viewBookingDetails/${id}`);
    }
  };

  const organiser_Id = userData.organiser_Id;
  console.log(organiser_Id);

  const viewDetails = async () => {
    const res = await fetch(`http://localhost:8010/getBookingDetails/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    setUserData(data);
    console.log({ data });
  };

  // const viewOrganiserDetails = async () => {
  //   const res = await fetch(
  //     `http://localhost:8080/getOrganiserById/${organiser_Id}`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     }
  //   );

  //   const data = await res.json();
  //   setOrganisersData(data);
  //   console.log({ data });
  // };

  const foodList = userData?.foodList?.toString();

  const final = foodList?.replace(
    /{"name":"|","code":"Premium"}|","code":"Normal"}|","code":"Luxury"}|","code":"Delux"}/gi,
    ''
  );

  console.log({ final });
  useEffect(() => {
    viewDetails();
    setData(true);
    DashboardValid();
    // viewOrganiserDetails();
  }, []);
  return (
    <div className='flex lg:flex-row flex-col sm:gap-6 gap-2 justify-center lg:items-start items-center m-10'>
      <div className='sm:my-10 my-4 lg:ml-10 m-4 sm:p-4 p-2 lg:w-[60%] w-[80%] border shadow-xl border-violet-800 rounded-md'>
        <div className='flex gap-2 py-5 items-center border border-t-0 border-x-0 border-b-black'>
          <div>
            <i
              className='pi pi-check-circle rounded-full p-1'
              style={{ fontSize: '1rem', color: 'white', background: 'green' }}
            ></i>
          </div>
          <div>Booking Confirmed</div>
        </div>
        <div className='flex p-4 gap-2 items-end border-b-1 border border-t-0 border-x-0 border-b-black'>
          <div>
            <img
              src='https://cdn-icons-png.flaticon.com/512/3378/3378693.png'
              alt=''
              srcset=''
              className='w-8 h-8'
            />
          </div>
          <div className=''>
            Your Booking for{' '}
            <span className='font-bold' style={{ color: '#482967' }}>
              {userData?.venueName}
            </span>{' '}
            Confirmed
          </div>
        </div>
        <div className='flex p-4 gap-2 items-end border-b-1 border border-t-0 border-x-0 border-b-black'>
          <div>
            <img
              src='https://cdn-icons-png.flaticon.com/512/3378/3378693.png'
              alt=''
              srcset=''
              className='w-8 h-8'
            />
          </div>
          <div className=''>
            Your Booking for{' '}
            <span className='font-bold' style={{ color: '#482967' }}>
              {userData?.venueName}
            </span>{' '}
            Confirmed
          </div>
        </div>
      </div>
      <div className='sm:my-10 my-4 lg:mr-10 m-4 sm:p-4 p-2 lg:w-[40%] w-[80%] border shadow-xl border-violet-800 rounded-md'>
        <div className='flex gap-2 items-center border border-t-0 border-x-0 border-b-black'>
          <div>Payment Summary</div>
        </div>
        <div className='m-4'>
          {userData ? (
            <div>
              <div>
                <div>
                  <div className='flex flex-col gap-2 border border-b-1 border-r-0 border-l-0 border-t-0 border-black'>
                    <div className='grid grid-cols-2'>
                      <div>Plate Price/guest:</div>
                      <div className='flex justify-end'>{final}</div>
                    </div>
                    <div className='grid grid-cols-2'>
                      <div>Guests:</div>
                      <div className='flex justify-end'>{userData?.guest}</div>
                    </div>
                  </div>
                  <div className='grid grid-cols-2 mt-2'>
                    <div>Grand Total:</div>
                    <div className='flex justify-end'>
                      {userData?.totalPrice}/-
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex justify-end mt-4'>
                <div>
                  <Button variant='outlined'>Pay Advance</Button>
                </div>
              </div>
            </div>
          ) : (
            'No Booking Yet...'
          )}
        </div>
      </div>
    </div>
  );
}
