import { Box, Button, CircularProgress, Tooltip } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../../ContextProvider/Context';
import { ToastContainer, toast } from 'react-toastify';
import Moment from 'react-moment';
import { Dialog } from 'primereact/dialog';
import Rate from '../Rate';

export default function ViewBookingDetails() {
  const [userData, setUserDatasetUserData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [organisersData, setOrganisersData] = useState([]);
  const { logindata, setLoginData } = useContext(LoginContext);
  const [loading, setLoading] = useState(true);

  const history = useNavigate();
  const { id } = useParams();
  const [visible, setVisible] = useState(false);

  const [data, setData] = useState(false);
  const [paid, setPaid] = useState(false);

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

  const viewPaymentDetailsByBookingId = async () => {
    const res = await fetch(
      `http://localhost:8010/viewPaymentsByOrderId/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();
    setPaymentData(data);
  };

  console.log({ userData });

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
    setUserDatasetUserData(data);
    console.log({ data });
  };

  const CompleteTheBooking = async () => {};

  const cancelBooking = async () => {
    if (visible) {
      if (remainingDate <= 1) {
        toast.error(
          `You cann't Cancel your Booking before 1 day!!! you have to pay 50% of total ${userData?.totalPrice}/-`,
          {
            position: 'top-center',
          }
        );
        setPaid(true);
      } else {
        const res = await fetch(
          `http://localhost:8010/CalculateTotalBalanceByBookingId/${id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentStatus: 'canceled',
            }),
          }
        );

        const data = await res.json();
        if (res.status === 200) {
          toast.success(`booking canceled`, {
            position: 'top-center',
          });
          setTimeout(function () {
            window.location = `/viewBookingDetails/${id}`;
          }, 2000);
        }
      }
    }
  };

  const gst = (userData?.totalPrice * 18) / 100;

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

  const path = 'http://localhost:8010/public/images/';

  useEffect(() => {
    viewDetails();
    setData(true);
    DashboardValid();
    viewPaymentDetailsByBookingId();
    // viewOrganiserDetails();
  }, []);

  const yesNoContent = (
    <div>
      <Button
        variant='outlined'
        onClick={() => setVisible(false)}
        className='p-button-text'
      >
        <i className='pi pi-times'></i>&nbsp;No
      </Button>

      {remainingDate <= 1 ? (
        <Button
          variant='outlined'
          onClick={() => setVisible(false)}
          className='p-button-text'
        >
          <i className='pi pi-check'></i>&nbsp;Ok
        </Button>
      ) : (
        <Button
          label='Yes'
          variant='outlined'
          onClick={cancelBooking}
          autoFocus
        >
          <i className='pi pi-check'></i>&nbsp;Yes
        </Button>
      )}
    </div>
  );
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
              {userData?.paymentStatus === 'canceled' ? null : (
                <>
                  <div className='flex justify-end h-10'>
                    <Button onClick={() => setVisible(true)} variant='outlined'>
                      Cancel Request
                    </Button>
                  </div>
                  <Dialog
                    header='Cancel Booking'
                    headerClassName='text-center'
                    visible={visible}
                    style={{ width: '50vw' }}
                    draggable={false}
                    onHide={() => setVisible(false)}
                    footer={yesNoContent}
                  >
                    <div className='text-center'>
                      <p>Are you want to cancel your booking?</p>
                      <sup className='text-red-300 mt-5'>
                        {remainingDate <= 1 &&
                          ' *if you cancel your booking before one day you will not get any refund and also you have to pay 50% of total amount !!'}
                      </sup>
                    </div>
                  </Dialog>
                </>
              )}
            </div>
          </nav>
          <div>
            <div className='flex lg:flex-row justify-evenly lg:gap-8 flex-col lg:items-start items-center m-10'>
              <div>
                <div className='sm:my-10 my-4 lg:ml-10 m-4 sm:p-4 p-2 lg:w-[100%] w-[80%] border shadow-xl border-violet-800 rounded-md'>
                  <div className='flex gap-2 py-5 items-center border border-t-0 border-x-0 border-b-black'>
                    <div>
                      <>
                        {userData?.paymentStatus === 'confirmed' ? (
                          <i
                            className='pi pi-check-circle rounded-full p-1'
                            style={{
                              fontSize: '1rem',
                              color: 'white',
                              background: 'green',
                            }}
                          ></i>
                        ) : userData?.paymentStatus === 'pending' ? (
                          <i
                            className='pi pi-info-circle rounded-full p-1'
                            style={{
                              fontSize: '1rem',
                              color: 'white',
                              background: 'orange',
                            }}
                          ></i>
                        ) : userData?.paymentStatus === 'Completed' ? (
                          <i
                            className='pi pi-check-circle rounded-full p-1'
                            style={{
                              fontSize: '1rem',
                              color: 'white',
                              background: 'blue',
                            }}
                          ></i>
                        ) : (
                          <i
                            className='pi pi-times-circle rounded-full p-1'
                            style={{
                              fontSize: '1rem',
                              color: 'white',
                              background: 'red',
                            }}
                          ></i>
                        )}
                      </>
                    </div>

                    <>
                      {userData?.paymentStatus === 'confirmed' ? (
                        <div>Booking Confirmed</div>
                      ) : userData?.paymentStatus === 'pending' ? (
                        <div>Payment pending</div>
                      ) : userData?.paymentStatus === 'Completed' ? (
                        <div>Booking Completed</div>
                      ) : (
                        <div>Booking Canceled</div>
                      )}
                    </>
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
                          {userData?.paymentStatus === 'pending'
                            ? 'Pending '
                            : userData?.paymentStatus === 'confirmed'
                            ? 'Confirmed'
                            : userData?.paymentStatus === 'completed'
                            ? 'completed'
                            : 'canceled'}{' '}
                          <a
                            className='underline'
                            href={`tel:+91 ${userData?.organiserPhone}`}
                          >
                            <b>
                              (Please Contact with Event manager before 1 day)
                              <span></span>
                            </b>
                          </a>
                        </span>
                      ) : (
                        'Canceled'
                      )}
                    </div>
                  </div>
                  <div className='flex p-4 gap-2 items-end'>
                    {remainingDate >= 1 ? (
                      <div className=''>
                        Your Event Date is <br />
                        <div>
                          <Moment format='D MMM YYYY'>
                            {userData?.bookingDate}
                          </Moment>{' '}
                          @{' '}
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
                          @{' '}
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
                <div className='sm:my-6 my-2 relative lg:ml-10 m-4 sm:p-4 p-2 lg:w-[100%] w-[80%] border shadow-xl border-violet-800 rounded-md'>
                  <div className='flex gap-2 py-2 items-center'>
                    {userData?.paymentStatus === 'canceled' ? (
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
                    ) : (
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
                    )}
                  </div>
                </div>
                <div className='sm:my-6 my-2 lg:ml-10 m-4 sm:p-4 p-2 lg:w-[100%] w-[80%] border shadow-xl border-violet-800 rounded-md'>
                  <div className=''>
                    <div>
                      <div>
                        <b>Need Our Help?</b>
                      </div>
                      <div className='flex justify-between w-full items-center'>
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
                {remainingDate <= -1 && (
                  <section>
                    <Rate
                      is_canceled={userData?.is_canceled}
                      organiser_Id={userData?.organiser_Id}
                    />
                  </section>
                )}
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
                            <div className='grid grid-cols-2'>
                              <div>GST (18%):</div>
                              <div className='flex justify-end'>{gst}/-</div>
                            </div>
                          </div>
                          <div className='grid grid-cols-2 mt-2'>
                            <div>Grand Total:</div>
                            <div className='flex justify-end'>
                              ₹{userData?.totalPrice}/-
                            </div>
                          </div>
                          <div className='grid grid-cols-2 mt-2'>
                            <div>Already Paid :</div>
                            <div className='flex justify-end'>
                              {userData?.totalPrice - userData?.balance}/-
                            </div>
                          </div>
                          <div className='grid grid-cols-2 mt-2 border-t-2 border-t-black'>
                            <div>Balance :</div>
                            <div className='flex justify-end'>
                              {userData?.balance}/-
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='flex justify-end mt-4'>
                        <div>
                          <Button
                            disabled={userData?.paymentStatus === 'canceled'}
                            variant='outlined'
                          >
                            Pay the Balance
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
