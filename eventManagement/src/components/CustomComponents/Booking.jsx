import React, { useState, useContext, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { LoginContext } from '../ContextProvider/Context';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import PhotosCarousel from './Booking/PhotosCarousel.tsx';
import RatingList from './RatingList';
import RelatedVenues from '../RelatedVenues/RelatedVenues';
import Rate from './Rate';

export default function Booking() {
  const [selectedCities, setSelectedCities] = useState('');
  const [guest, setGuest] = useState('');
  const [venueData, setVenueData] = useState([]);
  const [datetime12h, setDateTime12h] = useState('');
  const [selectedArtists, setSelectedArtists] = useState('');
  const [organisersData, setOrganisersData] = useState([]);
  const [bookings, setBookings] = useState(null);
  const { id } = useParams();
  const { logindata, setLoginData } = useContext(LoginContext);
  console.log({ guest });
  const history = useNavigate();
  const oldProducts = useRef([]);
  const [users, setUsers] = useState([]);
  const [copyOfUsers, setCopyOfUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  console.log({ organisersData });

  const artists = [
    { id: 1, name: 'DJ', price: '5000' },
    { id: 2, name: 'PhotoGraphy', price: '8000' },
    { id: 3, name: 'VideoGraphy', price: '10000' },
    { id: 4, name: 'DJ & PhotoGraphy', price: '13000' },
    { id: 5, name: 'DJ & VideoGraphy', price: '15000' },
    { id: 6, name: 'PhotoGraphy & VideoGraphy', price: '18000' },
    { id: 7, name: 'DJ, PhotoGraphy & VideoGraphy', price: '23000' },
  ];
  const cities = [
    { name: '300/-', code: 'Normal' },
    { name: '500/-', code: 'Premium' },
    { name: '900/-', code: 'Luxury' },
    { name: '1200/-', code: 'Delux' },
  ];

  const date = new Date();

  let currentYear = String(date.getFullYear());

  const errorImages = [
    {
      imgCollection: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png',
      ],
    },
  ];

  const [inpval, setInpval] = useState({
    organiser_Id: id || '',
    Name: '',
    bookingDate: datetime12h || '',
    eventName: '',
    requiredArtist: selectedArtists?.name || '',
    requiredArtistPrice: selectedArtists?.price || '',
    foodList: selectedCities?.code || '',
    foodDishPrice: selectedCities?.name || '',
    totalPrice: '',
    guest: '',
    venueName: organisersData?.venueName || '',
    organiserPhone: organisersData?.phone || '',
    organiserPhoto: organisersData?.photo || '',
  });

  const setVal = (e) => {
    // console.log(e.target.value);

    setInpval({ ...inpval, [e.target.name]: e.target.value });
  };

  const bookVenue = async (e) => {
    e.preventDefault();

    let token = localStorage.getItem('usersdatatoken');

    let data = await fetch('http://localhost:8010/bookEvents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        organiser_Id: id,
        userName: inpval.Name,
        bookingDate: datetime12h,
        eventName: inpval.eventName,
        requiredArtist: selectedArtists?.name,
        requiredArtistPrice: selectedArtists?.price,
        foodList: selectedCities.code,
        foodDishPrice: selectedCities.name,
        totalPrice: totalPrice,
        balance: totalPrice,
        guest: inpval.guest,
        paymentStatus: 'pending',
        venueName: organisersData.venueName,
        organiserPhone: organisersData.phone,
        organiserPhoto: organisersData.photo,
      }),
    });

    const res = await data.json();
    console.log({ res });

    if (res?.status === 422) {
      toast.error(`${res.message}`, {
        position: 'top-center',
      });
    } else {
      toast.success('Booking pending... Please Pay your Advance', {
        position: 'top-center',
      });
      setBookings(res);
      setVisible(true);
      window.onpopstate = (e) => {};
    }
  };
  console.log({ bookings });
  const organiserById = async () => {
    try {
      const res = await fetch(`http://localhost:8010/getOrganiserById/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setOrganisersData(data);
      console.log({ data });
    } catch (error) {
      console.log({ error });
    }
  };

  const VenueImagesById = async () => {
    try {
      const res = await fetch(`http://localhost:8010/viewAllDetails/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setVenueData(data);
      console.log({ data });
    } catch (error) {
      console.log({ error });
    }
  };

  console.log(organisersData?.pinCode);

  // const getOrganiserByPinCode = async () => {
  //   try {
  //     const res = await fetch(
  //       `http://localhost:8080/getOrganiserBypinCode/${organisersData?.pinCode}`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );
  //     const data = await res.json();
  //     // setVenueData(data);
  //     console.log({ data });
  //   } catch (error) {
  //     console.log({ error });
  //   }
  // };

  const totalPrice = selectedArtists
    ? parseInt(selectedCities?.name) * parseInt(inpval?.guest) +
        parseInt(selectedArtists?.price) || 0
    : parseInt(selectedCities?.name) * parseInt(inpval?.guest) || 0;

  useEffect(() => {
    VenueImagesById();
    organiserById();
    // getOrganiserByPinCode();
  }, []);

  let bookingId = bookings?.res?._id;
  console.log({ bookingId });
  return (
    <>
      <section>
        <div className='flex md:flex-row justify-evenly flex-col'>
          <div className='mt-5 items-start px-5 md:w-[60%] mx-auto'>
            <>
              {venueData?.length === 0 ? (
                <div className='mt-5 items-start px-5 md:w-[60%] mx-auto'>
                  <div style={{ color: '#482967', fontWeight: 'bolder' }}>
                    Event Photos:
                  </div>
                  {errorImages.map((data, index) => (
                    <PhotosCarousel
                      error={true}
                      images={data?.imgCollection}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className='mt-5 items-start px-5 md:w-[60%] mx-auto'>
                  <div style={{ color: '#482967', fontWeight: 'bolder' }}>
                    Event Photos:
                  </div>
                  {venueData?.map((data, index) => (
                    <PhotosCarousel
                      images={data?.imgCollection}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </>
            {organisersData?.details?.length === 0 ? null : (
              <div className='border rounded-b-xl rounded-t-xl border-x-0 mt-4 shadow-xl bg-white border-purple-950 p-4'>
                {organisersData?.details?.map((item, index) => (
                  <>
                    <div className='font-bold text-12 text-blue-500'>
                      {'Details :'}
                    </div>
                    <span
                      className='text-black Montserrat_font text-12 '
                      dangerouslySetInnerHTML={{
                        __html: item?.htmlValue,
                      }}
                    ></span>
                  </>
                ))}
              </div>
            )}
          </div>

          <div className='flex flex-col gap-4 mt-5 items-end px-5 md:w-[40%]'>
            <section>
              <form>
                <div className='flex flex-col gap-6 mt-5 items-end'>
                  <TextField
                    className='w-full bg-white'
                    value={inpval.Name}
                    onChange={setVal}
                    required
                    id='outlined-basic'
                    label='Name'
                    name='Name'
                    variant='outlined'
                  />
                  <span className='p-float-label w-[100%]'>
                    <Calendar
                      inputId='booking_date'
                      value={datetime12h}
                      onChange={(e) => setDateTime12h(e.value)}
                      showIcon
                      name='bookingDate'
                      yearNavigator={true}
                      minDate={new Date()}
                      dateFormat='dd/mm/yy'
                      yearRange={`${currentYear}:${currentYear}`}
                    />
                    <label htmlFor='booking_date'>Booking Date</label>
                  </span>
                  <TextField
                    className='w-full bg-white'
                    value={inpval.eventName}
                    onChange={setVal}
                    required
                    id='outlined-basic'
                    label='Event Name'
                    name='eventName'
                    variant='outlined'
                  />
                  <Dropdown
                    value={selectedCities}
                    onChange={(e) => setSelectedCities(e.value)}
                    options={cities}
                    optionLabel='name'
                    placeholder='Select Dishes Price'
                    className='w-full md:w-14rem'
                  />
                  <TextField
                    className='w-full bg-white'
                    id='outlined-basic'
                    label='No of Guest'
                    variant='outlined'
                    onChange={setVal}
                    required
                    value={inpval.guest}
                    name='guest'
                  />
                  <Dropdown
                    value={selectedArtists}
                    onChange={(e) => {
                      setSelectedArtists(e.value);
                    }}
                    options={artists}
                    optionLabel='name'
                    placeholder='Select Required Artists'
                    className='w-full md:w-14rem'
                  />
                  <span className='p-float-label w-full'>
                    <InputText
                      readOnly
                      tooltip={`${
                        selectedArtists
                          ? `${selectedArtists?.name} price added, ₹: ${selectedArtists?.price}/-`
                          : ''
                      }`}
                      tooltipOptions={{ position: 'top' }}
                      id='totalPrice'
                      className='w-full'
                      value={totalPrice}
                    />
                    <label htmlFor='totalPrice'>Total Price</label>
                  </span>

                  <div className='mx-auto bg-white'>
                    <Button
                      onClick={bookVenue}
                      className='lg:w-[20em]'
                      variant='outlined'
                    >
                      Book
                    </Button>
                  </div>
                  <Dialog
                    header='Please Pay Your advance'
                    headerStyle={{ textAlign: 'center' }}
                    closable={false}
                    draggable={false}
                    visible={visible}
                    style={{ width: '50vw' }}
                    onHide={() => setVisible(false)}
                  >
                    <div className='flex flex-col gap-4 items-center justify-center'>
                      <div>
                        <p className='text-xs'>
                          <i className='pi pi-exclamation-circle text-red-500'></i>
                          Please don't click on back and Refresh!!
                        </p>
                      </div>
                      <Button variant='outlined'>
                        <a href={`/payment/${bookingId}`}>Pay Advance</a>
                      </Button>
                    </div>
                  </Dialog>
                </div>
              </form>
            </section>
          </div>
        </div>
      </section>
      <section>
        <div id='ratings'>
          <RelatedVenues city={organisersData?.city} />
        </div>
      </section>
      <section>
        <>
          {organisersData?.ratings?.length === 0 ? null : (
            <div className='flex bg-white justify-center pt-2 mx-10 mb-5 border shadow-xl rounded-lg md:w-[30rem] w-[23rem] flex-col mt-8 md:text-12 text-10'>
              <div
                style={{ color: '#482967', fontWeight: 'bolder' }}
                className='flex justify-center'
              >
                Ratings and reviews:
              </div>
              {organisersData?.ratings?.map((item, index) => (
                <RatingList ratings={item} />
              ))}
            </div>
          )}
        </>
      </section>
    </>
  );
}
