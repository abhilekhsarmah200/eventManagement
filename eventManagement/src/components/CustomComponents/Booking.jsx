import React, { useState, useContext, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { LoginContext } from '../ContextProvider/Context';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { MultiSelect } from 'primereact/multiselect';
import DatePickers from './DatePicker/DatePicker';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import axios from 'axios';

export default function Booking() {
  const [selectedCities, setSelectedCities] = useState(null);
  const [guest, setGuest] = useState('');
  const [date, setDate] = useState(null);
  const [datetime12h, setDateTime12h] = useState(null);
  const [selectedArtists, setSelectedArtists] = useState(null);
  const [organisersData, setOrganisersData] = useState([]);
  const { id } = useParams();
  const { logindata, setLoginData } = useContext(LoginContext);
  console.log({ guest });
  const history = useNavigate();
  const oldProducts = useRef([]);
  const [users, setUsers] = useState([]);
  const [copyOfUsers, setCopyOfUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log({ selectedArtists });

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

  console.log(organisersData?.venueName);

  const [inpval, setInpval] = useState({
    Name: '',
    bookingDate: datetime12h || '',
    eventName: '',
    requiredArtist: selectedArtists || '',
    foodList: selectedCities || '',
    totalPrice: '',
    guest: '',
    venueName: organisersData?.venueName || '',
  });

  const setVal = (e) => {
    // console.log(e.target.value);

    setInpval({ ...inpval, [e.target.name]: e.target.value });
  };

  const bookVenue = async (e) => {
    e.preventDefault();

    let token = localStorage.getItem('usersdatatoken');

    const formdata = new FormData();

    formdata.append('Name', inpval.Name);
    formdata.append('bookingDate', datetime12h);
    formdata.append('eventName', inpval.eventName);
    formdata.append('requiredArtist', JSON.stringify(selectedArtists));
    formdata.append('foodList', JSON.stringify(selectedCities));
    formdata.append('totalPrice', totalPrice);
    formdata.append('guest', inpval.guest);
    formdata.append('venueName', organisersData.venueName);

    let res;
    try {
      res = await axios.post('http://localhost:8010/bookEvents', formdata, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
    } catch (error) {
      toast.error('email is already taken', {
        position: 'top-center',
      });
    } finally {
      if (res?.status === 422) {
        toast.error('email is already taken', {
          position: 'top-center',
        });
      } else {
        toast.success('Booked Successfully done 😃!', {
          position: 'top-center',
        });
        setTimeout(function () {
          history(`/`);
        }, 2000);
      }
    }
  };

  const organiserById = async () => {
    try {
      const res = await fetch(`http://localhost:8080/getOrganiserById/${id}`, {
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
      history(`/bookvenue/${id}`);
    }
  };

  const totalPrice = selectedArtists
    ? parseInt(selectedCities?.name) * parseInt(inpval?.guest) +
        parseInt(selectedArtists?.price) || 0
    : parseInt(selectedCities?.name) * parseInt(inpval?.guest) || 0;

  useEffect(() => {
    DashboardValid();
    organiserById();
  }, []);
  return (
    <>
      <div className='flex md:flex-row flex-col flex-wrap'>
        <div className='flex flex-col gap-4 mt-5 items-start px-5 md:w-[60%]'>
          hello
        </div>
        <div className='flex flex-col gap-4 mt-5 items-end px-5 md:w-[40%]'>
          <section>
            <form>
              <div className='flex flex-col gap-4 mt-5 items-end'>
                <TextField
                  className='w-full'
                  value={inpval.Name}
                  onChange={setVal}
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
                    yearRange='2023:2050'
                  />
                  <label htmlFor='booking_date'>Booking Date</label>
                </span>
                <TextField
                  className='w-full'
                  value={inpval.eventName}
                  onChange={setVal}
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
                  className='w-full'
                  id='outlined-basic'
                  label='No of Guest'
                  variant='outlined'
                  onChange={setVal}
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
                    id='username'
                    className='w-full'
                    value={totalPrice}
                  />
                  <label htmlFor='username'>Total Price</label>
                </span>

                <div className='mx-auto'>
                  <Button
                    onClick={bookVenue}
                    className='lg:w-[20em]'
                    variant='outlined'
                  >
                    Book
                  </Button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
