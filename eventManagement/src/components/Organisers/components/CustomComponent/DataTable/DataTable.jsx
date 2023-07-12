import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Moment from 'react-moment';
import { Button } from '@mui/material';
import { Dialog } from 'primereact/dialog';
import DraggableDialog from '../ConfirmPopup/ConfirmPopup.tsx';
import DraggableDialogVerified from '../ConfirmPopup/ConfirmPopupVerified/ConfirmPopupForValidation.tsx';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddArtists from './AddArtists.jsx';
import DraggableDialogTable from './ConfirmPopupVerified/ConfirmPopupForValidation.tsx';

export default function SimpleDataTable({ path, logindata }) {
  const [organiserData, setOrganiserData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);

  const [artistsData, setArtistsData] = useState([]);
  const [organisersBookingList, setOrganisersBookingList] = useState([]);

  const { id } = useParams();

  const organiserId = localStorage.getItem('userId');

  const handleOpen = (id) => {
    if (id) {
      setVisible2(true);
    }
  };

  const getArtistsRequestByOrganisers = async () => {
    const res1 = await fetch(`/viewJoinedDataUsingOrganiser/${organiserId}`, {
      method: 'GET',
    });
    const data2 = await res1.json();
    console.log({ data2 });
    setOrganiserData(data2);
  };
  const ViewYourBookings = async (id) => {
    window.location = `/artists/show-artistsDetails/${id}`;
  };

  const artistsId = organiserData?.map((item) => item?.requestedBy);

  const ViewYourOrganisersBookings = async () => {
    const res = await fetch(
      `http://localhost:8010/getOrganiserBookingDetails/${id}`,
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

  useEffect(() => {
    getArtistsRequestByOrganisers();
    ViewYourOrganisersBookings();
  }, []);

  console.log({ organiserData });
  return (
    <div>
      <div className='card m-6 rounded-lg border shadow-sm'>
        <DataTable
          value={organiserData}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          responsiveLayout={'stack'}
        >
          <Column
            field={`artistsPhoto`}
            body={(data, options) => (
              <div>
                <img
                  src={
                    data?.artistsPhoto
                      ? `${path}${data?.artistsPhoto}`
                      : `https://cdn.questionpro.com/userimages/site_media/no-image.png`
                  }
                  className='h-20 w-20 rounded-full'
                />
              </div>
            )}
            header='Images'
            className='fade-in text-black text-bold text-left'
            headerClassName={`text-lg text-black font-semibold text-left`}
            style={{ width: '20%' }}
          ></Column>
          <Column
            field='artistsName'
            header='Artists Name'
            className='fade-in text-black text-bold text-left'
            headerClassName={`text-lg text-black font-semibold text-left`}
            style={{ width: '20%' }}
          ></Column>
          <Column
            field='eventName'
            header='Venue Name'
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
            field='viewArtists'
            body={(data, options) => (
              <Button
                variant='outlined'
                onClick={() => ViewYourBookings(data?.requestedBy)}
              >
                <i className='pi pi-eye' style={{ fontSize: '1.5rem' }}></i>
              </Button>
            )}
            header='View Artists'
            style={{ width: '15%' }}
          ></Column>

          <Column
            field='actions'
            body={(data, options) => (
              <div className='flex flex-col gap-2'>
                <>
                  <DraggableDialog
                    logindata={data?.requestedBy}
                    id={data?._id}
                    item={data}
                    organiserId={organiserId}
                  />
                  {data?.requestAccepted === false && (
                    <DraggableDialogVerified
                      logindata={data?.requestedBy}
                      id={data?._id}
                      item={data}
                      organiserId={organiserId}
                    />
                  )}
                </>
              </div>
            )}
            header='Actions'
            style={{ width: '20%' }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
