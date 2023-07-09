import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Moment from 'react-moment';
import { Button } from '@mui/material';
import { Dialog } from 'primereact/dialog';
import DraggableDialog from '../CustomComponents/ConfirmPopup/ConfirmPopup.tsx';
import DraggableDialogVerified from '../CustomComponents/ConfirmPopup/ConfirmPopupVerified/ConfirmPopupForValidation.tsx';

export default function SimpleDataTableBookings({
  id,
  path,
  users,
  logindata,
}) {
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
            field={`venueName`}
            header='Venue Name'
            body={(data, options) => <div>{data.venueName}</div>}
            className='fade-in text-black text-bold text-left'
            headerClassName={`text-lg text-black font-semibold text-left`}
            style={{ width: '20%' }}
          ></Column>
          <Column
            field='userName'
            header='Booking For'
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
            field='createdAt'
            body={(data, options) => (
              <div>
                <Moment format='DD-MM-YYYY'>{data?.createdAt}</Moment>
              </div>
            )}
            header='Requested Date'
            style={{ width: '20%' }}
          ></Column>

          <Column
            field='bookingDate'
            body={(data, options) => (
              <div>
                <Moment format='DD-MM-YYYY'>{data?.bookingDate}</Moment>
              </div>
            )}
            header='Booking Date'
            style={{ width: '20%' }}
          ></Column>

          <Column
            field='Status'
            body={(data, options) =>
              data?.paymentStatus === 'pending' ? (
                <div>
                  <div
                    className='bg-white hover:bg-yellow-400 border-yellow-400 border p-2 cursor-pointer text-black hover:text-white transform duration-300 rounded-xl'
                    color='error'
                  >
                    Booking Pending...
                  </div>
                </div>
              ) : data?.paymentStatus === 'confirmed' ? (
                <div>
                  <div className='bg-white hover:bg-blue-400 border-blue-400 border p-2 cursor-pointer text-black hover:text-white transform duration-300 rounded-xl'>
                    Booking Confirmed
                  </div>
                </div>
              ) : data?.paymentStatus === 'canceled' ? (
                <div>
                  <div className='bg-white hover:bg-red-400 border-red-400 border p-2 cursor-pointer text-black hover:text-white transform duration-300 rounded-xl'>
                    Booking Canceled
                  </div>
                </div>
              ) : (
                <div>
                  <div className='bg-white hover:bg-green-500 border-green-500 border p-2 cursor-pointer text-black hover:text-white transform duration-300 rounded-xl'>
                    Booking Completed
                  </div>
                </div>
              )
            }
            header='Status'
            style={{ width: '20%' }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
