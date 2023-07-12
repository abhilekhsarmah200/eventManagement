import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function ArtistsList({ id, users, logindata }) {
  const [userData, setUserData] = useState([]);

  const viewDetails = async () => {
    const res = await fetch(`http://localhost:8010/getAllArtistsList`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    setUserData(data.reverse());
    console.log({ data });
  };

  useEffect(() => {
    viewDetails();
  }, []);

  const path = 'http://localhost:8010/public/images/';

  console.log({ users });
  return (
    <div>
      <div className='flex justify-center font-bold pt-4 md:text-2xl text-lg'>
        Artists List:
      </div>
      <div className='card m-6 rounded-lg border shadow-sm'>
        <DataTable
          headerClassName='bg-black'
          value={userData}
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
          {/* <Column
            field='eventName'
            header='Event Name'
            style={{ width: '20%' }}
          ></Column> */}
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
