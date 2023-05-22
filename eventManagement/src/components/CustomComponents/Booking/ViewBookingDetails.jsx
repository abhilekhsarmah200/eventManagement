import { Box, Button, CircularProgress, Tooltip } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../../ContextProvider/Context';
import { ToastContainer, toast } from 'react-toastify';
import Moment from 'react-moment';

export default function ViewBookingDetails() {
  const [userData, setUserData] = useState([]);
  const [organisersData, setOrganisersData] = useState([]);
  const { logindata, setLoginData } = useContext(LoginContext);
  const [loading, setLoading] = useState(true);

  const history = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState(false);

  const date = new Date();
  let currentDay = String(date.getDate()).padStart(2, '0');
  let currentDate = `${currentDay}`;
  console.log(currentDate);

  //Booking Date
  const bookingDate = new Date(`${userData?.bookingDate}`);
  let bookingCurrentDay = String(bookingDate.getDate()).padStart(2, '0');
  let bookingCurrentDate = `${bookingCurrentDay}`;
  console.log(bookingCurrentDate);

  const remainingDate = bookingCurrentDate - currentDate;
  console.log(remainingDate);

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
  console.log({ userData });

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

  const cancelBooking = async () => {
    const res = await fetch(`http://localhost:8010/cancelBookingById/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        is_canceled: true,
      }),
    });

    const data = await res.json();
    if (res.status === 200) {
      toast.success(`booking canceled`, {
        position: 'top-center',
      });
      setTimeout(function () {
        window.location = `/viewBookingDetails/${id}`;
      }, 2000);
    }
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

  const path = 'http://localhost:8080/public/images/';

  useEffect(() => {
    viewDetails();
    setData(true);
    DashboardValid();
    // viewOrganiserDetails();
  }, []);
  return (
    <div>
      {userData ? (
        <>
          <nav className='shadow-xl lg:px-20 sm:px-10 px-8 py-4'>
            <div className='grid grid-cols-2 items-center'>
              <div className='flex flex-col justify-center items-end'>
                <div className='font-bold font-serif text-2xl'>
                  Event Partners
                </div>
                <div>
                  Request At:{' '}
                  <Moment format='D MMM YYYY'>{userData?.createdAt}</Moment>
                </div>
              </div>
              {userData?.is_canceled === false && (
                <div className='flex justify-end h-10'>
                  {remainingDate === 1 ? (
                    <Tooltip title="You cann't Cancel your Booking before 1 day">
                      <div className='cursor-pointer'>
                        <Button
                          disabled
                          onClick={cancelBooking}
                          variant='outlined'
                        >
                          Cancel Request
                        </Button>
                      </div>
                    </Tooltip>
                  ) : (
                    <Button onClick={cancelBooking} variant='outlined'>
                      Cancel Request
                    </Button>
                  )}
                </div>
              )}
            </div>
          </nav>
          <div>
            <div className='flex lg:flex-row flex-col sm:gap-6 gap-2 justify-center lg:items-start items-center m-10'>
              <div>
                <div className='sm:my-10 my-4 lg:ml-10 m-4 sm:p-4 p-2 lg:w-[80%] w-[80%] border shadow-xl border-violet-800 rounded-md'>
                  <div className='flex gap-2 py-5 items-center border border-t-0 border-x-0 border-b-black'>
                    <div>
                      {userData?.is_canceled === false ? (
                        <i
                          className='pi pi-check-circle rounded-full p-1'
                          style={{
                            fontSize: '1rem',
                            color: 'white',
                            background: 'green',
                          }}
                        ></i>
                      ) : (
                        <i
                          className='pi pi-exclamation-circle rounded-full p-1'
                          style={{
                            fontSize: '1rem',
                            color: 'white',
                            background: 'red',
                          }}
                        ></i>
                      )}
                    </div>
                    {userData?.is_canceled === false ? (
                      <div>Booking Confirmed</div>
                    ) : (
                      <div className='text-red-600'>
                        You Canceled Your Booking
                      </div>
                    )}
                  </div>
                  <div className='flex p-4 gap-2 items-center border-b-1 border border-t-0 border-x-0 border-b-black'>
                    <div className='shadow-xl rounded-xl'>
                      <img
                        src={`${path}${userData?.organiserPhoto}`}
                        alt=''
                        srcset=''
                        className='h-20 rounded-xl'
                      />
                    </div>
                    <div className=''>
                      Your Booking for{' '}
                      <span className='font-bold' style={{ color: '#482967' }}>
                        {userData?.venueName}
                      </span>{' '}
                      {userData?.is_canceled === false ? (
                        <span>
                          "Confirmed "
                          <b>
                            (Please Contact with Event manager before 1 day)
                            <span>
                              <a href={`tel:+91 ${userData?.organiserPhone}`}>
                                <i className='pi pi-phone text-black'></i>
                              </a>
                            </span>
                          </b>
                        </span>
                      ) : (
                        'Canceled'
                      )}
                    </div>
                  </div>
                  <div className='flex p-4 gap-2 items-end'>
                    {userData?.is_canceled === false ? (
                      <div className=''>
                        Your Event Date is <br />
                        <div>
                          <Moment format='D MMM YYYY'>
                            {userData?.bookingDate}
                          </Moment>{' '}
                          at{' '}
                          <span
                            className='font-bold'
                            style={{ color: '#482967' }}
                          >
                            {userData?.venueName}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className=''>
                        Your Event Date was <br />
                        <div>
                          <Moment format='D MMM YYYY'>
                            {userData?.bookingDate}
                          </Moment>{' '}
                          at{' '}
                          <span
                            className='font-bold'
                            style={{ color: '#482967' }}
                          >
                            {userData?.venueName}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='sm:my-6 my-2 relative lg:ml-10 m-4 sm:p-4 p-2 lg:w-[80%] w-[80%] border shadow-xl border-violet-800 rounded-md'>
                  <div className='flex gap-2 py-2 items-center'>
                    {userData?.is_canceled === false ? (
                      <div>
                        <b>Service Checklist</b>
                        <div className='flex flex-row  justify-around w-full items-end'>
                          <div className='text-gray-400 text-xs'>
                            Check what's Services we will give you
                          </div>
                          <div className='absolute right-0 bottom-0 mb-5 mr-5'>
                            <i className='pi pi-arrow-right'></i>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className='opacity-25'>
                        <b>Service Checklist</b>
                        <div className='flex flex-row  justify-around w-full items-end'>
                          <div className='text-gray-400 text-xs'>
                            Check what's Services we will give you
                          </div>
                          <div className='absolute right-0 bottom-0 mb-5 mr-5'>
                            <i className='pi pi-arrow-right'></i>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='sm:my-6 my-2 lg:ml-10 m-4 sm:p-4 p-2 lg:w-[80%] w-[80%] border shadow-xl border-violet-800 rounded-md'>
                  <div className='flex gap-2 py-2 items-center'>
                    <div>
                      <b>Need Our Help?</b>
                      <div className='flex flex-row  justify-around w-full items-start'>
                        <div className='text-gray-400 text-xs'>
                          Call us in case you face any issue in Our service.
                        </div>
                        <div className='flex gap-2 items-center p-2 border border-1 rounded-md hover:bg-[#482967] hover:text-white cursor-pointer'>
                          <i className='pi pi-phone text-black'></i>
                          <a className='text-xs' href='tel:+91 1232433221'>
                            +91 1232433221
                          </a>
                        </div>
                      </div>
                    </div>
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
                              <div>
                                Plate Price:{' '}
                                <span className='text-xs'>
                                  ({userData?.foodList})
                                </span>
                              </div>
                              <div className='flex justify-end'>
                                {userData?.foodDishPrice}
                              </div>
                            </div>
                            {userData?.requiredArtist && (
                              <div className='grid grid-cols-2'>
                                <div>
                                  Required Artists:{' '}
                                  <span className='text-xs'>
                                    ({userData?.requiredArtist})
                                  </span>
                                </div>
                                <div className='flex justify-end'>
                                  {userData?.requiredArtistPrice}/-
                                </div>
                              </div>
                            )}
                            <div className='grid grid-cols-2'>
                              <div>Guests:</div>
                              <div className='flex justify-end'>
                                {userData?.guest}
                              </div>
                            </div>
                          </div>
                          <div className='grid grid-cols-2 mt-2'>
                            <div>Grand Total:</div>
                            <div className='flex justify-end'>
                              ₹{userData?.totalPrice}/-
                              <span className='text-xs mt-1'>
                                (GST inclusive)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='flex justify-end mt-4'>
                        <div>
                          <Button
                            disabled={userData?.is_canceled === true}
                            variant='outlined'
                          >
                            Pay Advance
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    'No Booking Yet...'
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      <ToastContainer />
    </div>
  );
}
