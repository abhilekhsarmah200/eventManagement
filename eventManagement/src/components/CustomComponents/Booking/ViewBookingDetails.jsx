import { Box, Button, CircularProgress } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../../ContextProvider/Context';
import { toast } from 'react-toastify';
import Moment from 'react-moment';

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
  const path = 'http://localhost:8080/public/images/';
  console.log({ final });
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
              <div className='flex justify-end h-10'>
                <Button variant='outlined'>Cancel Request</Button>
              </div>
            </div>
          </nav>
          <div>
            <div className='flex lg:flex-row flex-col sm:gap-6 gap-2 justify-center lg:items-start items-center m-10'>
              <div>
                <div className='sm:my-10 my-4 lg:ml-10 m-4 sm:p-4 p-2 lg:w-[80%] w-[80%] border shadow-xl border-violet-800 rounded-md'>
                  <div className='flex gap-2 py-5 items-center border border-t-0 border-x-0 border-b-black'>
                    <div>
                      <i
                        className='pi pi-check-circle rounded-full p-1'
                        style={{
                          fontSize: '1rem',
                          color: 'white',
                          background: 'green',
                        }}
                      ></i>
                    </div>
                    <div>Booking Confirmed</div>
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
                      Confirmed{' '}
                      <b>(Please Contact with Event manager before 1 day)</b>{' '}
                      <span>
                        <a href={`tel:+91 ${userData?.organiserPhone}`}>
                          <i className='pi pi-phone text-black'></i>
                        </a>
                      </span>
                    </div>
                  </div>
                  <div className='flex p-4 gap-2 items-end'>
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
                  </div>
                </div>
                <div className='sm:my-6 my-2 relative lg:ml-10 m-4 sm:p-4 p-2 lg:w-[80%] w-[80%] border shadow-xl border-violet-800 rounded-md'>
                  <div className='flex gap-2 py-2 items-center'>
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
                  </div>
                </div>
                <div className='sm:my-6 my-2 relative lg:ml-10 m-4 sm:p-4 p-2 lg:w-[80%] w-[80%] border shadow-xl border-violet-800 rounded-md'>
                  <div className='flex gap-2 py-2 items-center'>
                    <div>
                      <b>Need Our Help?</b>
                      <div className='flex flex-row  justify-around w-full items-end'>
                        <div className='text-gray-400 text-xs'>
                          Call us in case you face any issue in Our service.
                        </div>
                        <div className='flex gap-2 items-center absolute p-2 border border-1 rounded-md hover:bg-[#482967] hover:text-white cursor-pointer right-0 bottom-0 mb-5 mr-5'>
                          <i className='pi pi-phone text-black'></i>
                          <a href='tel:+91 1232433221'>+91 1232433221</a>
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
                              <div>Plate Price/guest:</div>
                              <div className='flex justify-end'>{final}</div>
                            </div>
                            {userData?.requiredArtist && (
                              <div className='grid grid-cols-2'>
                                <div>Artists:</div>
                                <div className='flex justify-end'>
                                  {userData?.requiredArtist}
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
          </div>
        </>
      ) : null}
    </div>
  );
}
