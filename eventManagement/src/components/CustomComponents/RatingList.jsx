import React from 'react';
import { Rating } from 'primereact/rating';
import { useEffect } from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';

export default function RatingList({ ratings }) {
  const [usersData, setUsersData] = useState([]);
  const organiserById = async () => {
    try {
      const res = await fetch(
        `http://localhost:8010/getUserById/${ratings?.postedBy}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await res.json();
      setUsersData(data);
    } catch (error) {
      console.log({ error });
    }
  };

  console.log({ usersData });

  useEffect(() => {
    organiserById();
  }, []);

  const path = 'http://localhost:8010/public/images/';

  return (
    <div className='p-4'>
      <div className='p-4'>
        <div className='float-left'>
          {usersData?.map((item, index) => (
            <div key={index} className='uppercase'>
              <Avatar
                style={{
                  background: 'salmon',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                }}
              >
                {item?.fname?.[0]?.toUpperCase()}
              </Avatar>
            </div>
          ))}
          <div className='float-right'>
            <div className='flex gap-2'>
              <span className='w-full flex gap-2'>
                <div className=''>
                  {usersData?.map((item, index) => (
                    <div key={index} className='uppercase'>
                      {item?.fname}
                    </div>
                  ))}
                </div>
              </span>
            </div>
            <div className='flex gap-2'>
              <div className='w-40 flex gap-2'>
                <Rating
                  readOnly
                  tooltipOptions={{ position: 'top' }}
                  value={ratings?.star}
                  cancel={false}
                />
              </div>
            </div>
            <div className='flex gap-2'>
              <span className='w-full flex gap-2'>
                <div className=''>&nbsp;{ratings?.comments}</div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
