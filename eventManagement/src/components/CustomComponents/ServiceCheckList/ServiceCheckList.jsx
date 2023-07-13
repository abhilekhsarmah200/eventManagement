import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Moment from 'react-moment';
import { Tooltip } from '@mui/material';

export default function ServiceCheckList() {
  const { id } = useParams();

  const [bookingData, setBookingData] = useState([]);
  const [artistsData, setArtistsData] = useState('');
  const [visible, setVisible] = useState(false);

  const viewDetails = async () => {
    const res = await fetch(`http://localhost:8010/getBookingDetails/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    setBookingData(data);
    localStorage.setItem(
      'artistsId',
      data?.artistsName ? data?.artistsName : ''
    );
  };

  const artistId = localStorage.getItem('artistsId');

  const viewArtistsDetailsById = async () => {
    const res = await fetch(
      `http://localhost:8010/getOrganiserById/${artistId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();
    setTimeout(() => {
      setArtistsData(data);
    }, 1000);
  };

  console.log({ artistsData });

  useEffect(() => {
    viewDetails();
    viewArtistsDetailsById();
  }, []);

  const path = 'http://localhost:8010/public/images/';

  return (
    <div className='w-[90%] bg-slate-200 p-5 mx-auto my-14'>
      <div className='flex underline justify-center md:text-2xl text-lg font-bold'>
        Our Services For You:
      </div>
      <div className='flex flex-col gap-2 mt-5'>
        <>
          <div className='flex md:flex-row flex-col items-end md:justify-end justify-start'>
            <div className='font-semibold'>Booking Date: </div>
            <Moment format='DD-MM-YYYY'>{bookingData?.bookingDate}</Moment>
          </div>
          <div className='flex flex-col mx-auto justify-center sm:w-[60%] w-[80%]'>
            <div className='flex justify-between w-full'>
              <div className='font-semibold'>Event:</div>
              <div>{bookingData?.eventName}</div>
            </div>
            <div className='flex justify-between w-full'>
              <div className='font-semibold flex'>
                <Tooltip title={visible ? '' : `Show Food Items`}>
                  <div
                    onClick={() =>
                      visible ? setVisible(false) : setVisible(true)
                    }
                    className='underline cursor-pointer'
                  >
                    Food (Show Item List)
                  </div>
                </Tooltip>
                :
              </div>
              <div>{bookingData?.foodDishPrice}</div>
            </div>

            {visible && (
              <div className='p-3'>
                <div className='flex justify-center font-bold p-3'>
                  Catagory:
                  {bookingData?.foodList === 'Normal'
                    ? 'Normal'
                    : bookingData?.foodList === 'Premium'
                    ? 'Premium'
                    : 'Luxury'}
                </div>

                {bookingData?.foodList === 'Normal' ? (
                  <>
                    <ul className='flex flex-wrap gap-4 justify-between'>
                      <div>
                        <div className='underline'>Starter:</div>
                        <li>Gol gappa</li>
                        <li>Aloo tikiya</li>
                        <li>Matar tikiya</li>
                        <li>Chola bhatura</li>
                        <li>Chatney</li>
                        <li>Papad</li>
                      </div>
                      <div>
                        <div className='underline'>Main Course:</div>
                        <li>Pulao</li>
                        <li>Butter Chicken</li>
                        <li>Mutton Rogan Josh</li>
                        <li>Mix Veg</li>
                        <li>Garlic Naan</li>
                        <li>Puri</li>
                        <li>Butter Naan</li>
                        <li>Barbeque</li>
                      </div>
                      <div>
                        <div className='underline'>Dessert:</div>
                        <li>Gulab Jamun</li>
                        <li>Rasogolla</li>
                        <li>Pastry cake</li>
                        <li>Dahi</li>
                      </div>
                    </ul>
                  </>
                ) : bookingData?.foodList === 'Premium' ? (
                  <ul className='flex flex-wrap gap-4 justify-between'>
                    <div className='flex flex-wrap gap-6 justify-between'>
                      <div>
                        <div className='underline'>Starter:</div>
                        <li>Gol gappa</li>
                        <li>Aloo tikiya</li>
                        <li>Matar tikiya</li>
                        <li>Chola bhatura</li>
                        <li>Chatney</li>
                        <li>Papad</li>
                        <li>Dahi gujiya</li>
                        <li>Kadai dudh kesar</li>
                        <li>Aloo tawa chat</li>
                      </div>
                      <div>
                        <div className='underline'>Main Course:</div>
                        <li>Pulao</li>
                        <li>Butter Chicken</li>
                        <li>Mutton Rogan Josh</li>
                        <li>Biriyani</li>
                        <li>Paneer Butter Masala</li>
                        <li>Mix Veg</li>
                        <li>Puri</li>
                        <li>Butter Naan</li>
                        <li>Barbeque</li>
                      </div>
                      <div>
                        <div className='underline'>Dessert:</div>
                        <li>Gulab Jamun</li>
                        <li>Rasogolla</li>
                        <li>Pastry cake</li>
                        <li>Dahi</li>
                      </div>
                    </div>
                  </ul>
                ) : (
                  <ul className='flex flex-wrap gap-4 justify-between'>
                    <div className='flex flex-wrap gap-6 justify-between'>
                      <div>
                        <div className='underline'>Starter:</div>
                        <li>Gol gappa</li>
                        <li>Aloo tikiya</li>
                        <li>Matar tikiya</li>
                        <li>Chola bhatura</li>
                        <li>Chatney</li>
                        <li>Papad</li>
                        <li>Dahi gujiya</li>
                        <li>Kadai dudh kesar</li>
                        <li>Aloo tawa chat</li>
                        <li>Popcorn</li>
                        <li>American corn</li>
                        <li>Baira khichdi</li>
                        <li>Dhokla</li>
                        <li>Fruit chat</li>
                        <li>Malai paneer tikka</li>
                      </div>
                      <div>
                        <div className='underline'>Main Course:</div>
                        <li>Pulao</li>
                        <li>Butter Chicken</li>
                        <li>Mutton Rogan Josh</li>
                        <li>Veg Biriyani</li>
                        <li>Paneer Butter Masala</li>
                        <li>Mix Veg</li>
                        <li>Chicken Biriyani</li>
                        <li>Chicken Nuggets</li>
                        <li>Leg Piece</li>
                        <li>Garlic Naan</li>
                        <li>Puri</li>
                        <li>Butter Naan</li>
                        <li>Barbeque</li>
                      </div>
                      <div>
                        <div className='underline'>Dessert:</div>
                        <li>Gulab Jamun</li>
                        <li>Rasogolla</li>
                        <li>Pastry cake</li>
                        <li>Dahi</li>
                      </div>
                    </div>
                  </ul>
                )}
              </div>
            )}

            <div className='flex justify-between w-full'>
              <div className='font-semibold'>Requested Artists:</div>
              <div>
                {bookingData?.requiredArtist
                  ? bookingData?.requiredArtist
                  : 'Artists Not required'}
              </div>
            </div>
            <div className='font-semibold'>Linked Artists:</div>
            {artistsData === '' ? null : (
              <div>
                <div className='flex flex-col items-center px-4 pt-4 gap-2'>
                  <div>
                    <img
                      src={`${path}${artistsData?.photo}`}
                      alt='profile'
                      className='w-40 h-40 rounded-full'
                    />
                  </div>
                  <div>
                    {' '}
                    <span className='font-bold'> Name:</span>{' '}
                    {artistsData?.fname}
                  </div>
                  <div>
                    <span className='font-bold'> Skills:</span>{' '}
                    {artistsData?.artistsType?.map((item, index) =>
                      item.split(',').join(', ')
                    )}
                  </div>
                  <div>
                    {' '}
                    <span className='font-bold'> Email Id:</span>{' '}
                    {artistsData?.email}
                  </div>
                  <div>
                    {' '}
                    <span className='font-bold'> Phone No:</span>{' '}
                    {artistsData?.phone}
                  </div>
                  <div>
                    {' '}
                    <span className='font-bold'> Address:</span>{' '}
                    {artistsData?.area}, {artistsData?.city}(
                    {artistsData?.state})
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      </div>
    </div>
  );
}
