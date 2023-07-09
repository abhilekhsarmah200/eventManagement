import { Button, Dialog } from '@mui/material';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { useParams } from 'react-router-dom';
import AddArtists from '../DataTable/AddArtists';

export default function ShowArtistsDetails() {
  const { id } = useParams();

  const [artists, setArtists] = useState('');
  const [showBookingList, setShowBookingList] = useState(false);
  const [organisersBookingList, setOrganisersBookingList] = useState([]);

  const organiserId = localStorage.getItem('userId');

  const viewArtistsDetails = async () => {
    const res1 = await fetch(`/getOrganiserById/${id}`, {
      method: 'GET',
    });
    const data2 = await res1.json();
    console.log({ data2 });
    setArtists(data2);
  };

  const ViewYourOrganisersBookings = async () => {
    const res = await fetch(
      `http://localhost:8010/getOrganiserBookingDetails/${organiserId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();
    console.log({ data });
    setOrganisersBookingList(data);
    // setVisible(true);
  };

  const viewYourBookings = async () => {
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
    // setArtistsData(data);
  };

  useEffect(() => {
    viewArtistsDetails();
    ViewYourOrganisersBookings();
  }, []);

  const path = 'http://localhost:8010/public/images/';
  return (
    <div>
      <div className='card flex justify-center bg-white md:w-[80%] w-[90%] mx-auto py-5 m-5'>
        <>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col items-center px-4 pt-4 gap-2'>
              <div>
                <img
                  src={`${path}${artists.photo}`}
                  alt='profile'
                  className='w-40 h-40 rounded-full'
                />
              </div>
              <div>
                {' '}
                <span className='font-bold'> Name:</span> {artists?.fname}
              </div>
              <div>
                <span className='font-bold'> Skills:</span>{' '}
                {artists.artistsType?.map((item, index) =>
                  item.split(',').join(', ')
                )}
              </div>
              <div>
                {' '}
                <span className='font-bold'> Email Id:</span> {artists.email}
              </div>
              <div>
                {' '}
                <span className='font-bold'> Phone No:</span> {artists.phone}
              </div>
              <div>
                {' '}
                <span className='font-bold'> Address:</span> {artists.area},{' '}
                {artists.city}({artists.state})
              </div>
            </div>

            {showBookingList ? (
              <>
                {' '}
                <div>
                  <div className='my-5 font-bold flex justify-center'>
                    Booking List:
                  </div>
                  <div className='border border-purple-950 rounded-sm'>
                    <DataTable
                      value={organisersBookingList}
                      paginator
                      rows={5}
                      className=''
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      responsiveLayout={'stack'}
                    >
                      <Column
                        field='Booking Id:'
                        header='Booking Id:'
                        body={(data, options) => (
                          <div>{options?.rowIndex + 1}</div>
                        )}
                        style={{ width: '10%' }}
                      ></Column>
                      <Column
                        field='userName'
                        header='Booking By:'
                        style={{ width: '20%' }}
                      ></Column>
                      <Column
                        field='eventName'
                        header='Event Name:'
                        style={{ width: '15%' }}
                      ></Column>
                      <Column
                        field='guest'
                        header='Total Guest:'
                        style={{ width: '15%' }}
                      ></Column>
                      <Column
                        field='requiredArtist'
                        header='Artists Required:'
                        style={{ width: '20%' }}
                      ></Column>
                      <Column
                        field='bookingDate'
                        header='Booking Date:'
                        body={(data, options) => (
                          <Moment format='DD-MM-YYYY'>
                            {data?.bookingDate}
                          </Moment>
                        )}
                        style={{ width: '30%' }}
                      ></Column>
                      <Column
                        field='actions'
                        body={(data, options) => (
                          <AddArtists
                            artistsId={id}
                            fname={artists?.fname}
                            data={data}
                          />
                        )}
                        header='Actions'
                        style={{ width: '20%' }}
                      ></Column>
                    </DataTable>
                  </div>
                </div>
                <div className='flex justify-center'>
                  <Button
                    variant='outlined'
                    onClick={() => setShowBookingList(false)}
                  >
                    Close
                  </Button>
                </div>
              </>
            ) : (
              <div className='flex justify-center'>
                <Button
                  variant='outlined'
                  onClick={() => setShowBookingList(true)}
                >
                  View Booking List
                </Button>
              </div>
            )}
          </div>
        </>
      </div>
    </div>
  );
}
