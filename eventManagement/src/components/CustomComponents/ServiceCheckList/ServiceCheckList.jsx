import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Moment from 'react-moment';
import { Tooltip } from '@mui/material';

export default function ServiceCheckList() {
  const { id } = useParams();

  const [bookingData, setBookingData] = useState([]);
  const [artistsData, setArtistsData] = useState([]);
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
    localStorage.setItem('artistsId', data?.artistsName);
  };

  const artistId = localStorage.getItem('artistsId');

  const viewArtistsDetailsById = async () => {
    const res = await fetch(
      `http://localhost:8010/viewArtistsDetailsforBooking/${artistId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();
    setArtistsData(data);
  };

  console.log({ artistsData });

  useEffect(() => {
    viewDetails();
    viewArtistsDetailsById();
  }, []);
  return (
    <div className='w-[90%] bg-slate-200 p-5 mx-auto my-14'>
      <div className='flex underline justify-center md:text-2xl text-lg font-bold'>
        Our Services For You:
      </div>
      <div className='flex flex-col gap-2 mt-5'>
        {artistsData?.map((item, index) => (
          <>
            <div className='flex md:flex-row flex-col items-end md:justify-end justify-start'>
              <div className='font-semibold'>Booking Date: </div>
              <Moment format='DD-MM-YYYY'>{item?.bookingDate}</Moment>
            </div>
            <div className='flex flex-col mx-auto justify-center sm:w-[60%] w-[80%]'>
              <div className='flex justify-between w-full'>
                <div className='font-semibold'>Event:</div>
                <div>{item?.eventName}</div>
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
                      Food ({item?.foodList})
                    </div>
                  </Tooltip>
                  :
                </div>
                <div>{item?.foodDishPrice}</div>
              </div>
              {visible && (
                <div className='p-3'>
                  <ul className='flex justify-between'>
                    <div>
                      <li>Gol gappa</li>
                      {/* <li>
                      • • Matar tikiya • Paneer tikiva • Kele ki tikiya •
                      Sabudane ki tikiya • Nariyal paneer tikiya • Papdi chaat •
                      Mini raai kachori • Dahi gujiya • Kalkati dahi gujiya •
                      Dilli khomcha • Sizzler • Shakarkand chat • Paneer childa
                     • Hyderabadi childa • Matka kulcha • Matar
                      chat • Kanji vada • Dhokla • Pav bhaji •  •
                      Kadi kachori • Bhel puri • Paneer tikka • Pudina paneer
                      tikka • Malai paneer tikka • Palak patta chaat • Paneer
                      roll • Fruit chat • Fresh fruit stall • Aloo tawa chat •
                      Matar tawa chat • French fries chat • Kalmi bada • Kadai
                      dudh • Kadai dudh kesar • Chuski • Popcorn • American corn
                      • Baira khichdi • Pudina aloo • Barbeque counter
                    </li> */}
                      <li>Aloo tikiya</li>
                      <li>Matar tikiya</li>
                      <li>Chola bhatura</li>
                      <li>Chatney</li>
                      <li>Papad</li>
                    </div>
                    <div>
                      <li>Pualo</li>
                      <li>Butter Chicken</li>
                      <li>Mutton Rogan Josh</li>
                      <li></li>
                    </div>
                  </ul>
                </div>
              )}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
