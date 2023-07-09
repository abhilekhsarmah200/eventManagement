import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Moment from 'react-moment';
import { Button } from '@mui/material';
import { Dialog } from 'primereact/dialog';

export default function SimpleDataTableBookings({ id, users, logindata }) {
  const [organiserData, setOrganiserData] = useState([]);
  const [visible, setVisible] = useState(false);

  const [artistsData, setArtistsData] = useState([]);

  const organiserId = localStorage.getItem('organiserId');

  const getArtistsRequestByOrganisers = async () => {
    const res1 = await fetch(`/viewJoinedDataUsingOrganiser/${organiserId}`, {
      method: 'GET',
    });
    const data2 = await res1.json();
    console.log({ data2 });
    setOrganiserData(data2);
  };
  const ViewYourBookings = async (id) => {
    const res = await fetch(
      `http://localhost:8010/viewJoinedDataUsingArtistsId/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();
    setArtistsData(data);
    setVisible(true);
  };
  useEffect(() => {
    ViewYourBookings();
    getArtistsRequestByOrganisers();
  }, []);

  const path = 'http://localhost:8010/public/images/';

  console.log({ users });
  return (
    <div>
      <div className='card m-6 rounded-lg border shadow-sm'>
        <DataTable
          value={users}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          responsiveLayout={'stack'}
        >
          <Column
            field={`photo`}
            header='Artist Profile'
            body={(data, options) => (
              <div>
                <img
                  src={`${path}${data?.photo}`}
                  className='h-20 w-20 rounded-full shadow-sm'
                />
              </div>
            )}
            className='fade-in text-black text-bold text-left'
            headerClassName={`text-lg text-black font-semibold text-left`}
            style={{ width: '20%' }}
          ></Column>
          <Column
            field={`fname`}
            header='Artist Name'
            body={(data, options) => <div>{data.fname}</div>}
            className='fade-in text-black text-bold text-left'
            headerClassName={`text-lg text-black font-semibold text-left`}
            style={{ width: '20%' }}
          ></Column>
          <Column
            field='artistsType'
            header='Expertise'
            className='fade-in text-black text-bold text-left'
            headerClassName={`text-lg text-black font-semibold text-left`}
            style={{ width: '20%' }}
          ></Column>
          <Column
            field='eventName'
            header='Event Name'
            style={{ width: '20%' }}
          ></Column>
          <Column
            field='phone'
            body={(data, options) => <div>+91 {data?.phone}</div>}
            header='Phone Number'
            style={{ width: '20%' }}
          ></Column>

          <Column
            field='email'
            body={(data, options) => <div>{data?.email}</div>}
            header='Email'
            style={{ width: '20%' }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
