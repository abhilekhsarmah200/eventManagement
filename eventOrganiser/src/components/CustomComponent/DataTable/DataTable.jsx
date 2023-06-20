import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Moment from 'react-moment';
import { Button } from '@mui/material';
import { Dialog } from 'primereact/dialog';
import DraggableDialog from '../ConfirmPopup/ConfirmPopup.tsx';
import DraggableDialogVerified from '../ConfirmPopup/ConfirmPopupVerified/ConfirmPopupForValidation.tsx';

export default function SimpleDataTable({ id, path, logindata }) {
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
      `http://localhost:8080/viewJoinedDataUsingArtistsId/${id}`,
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

  console.log({ organiserData });
  return (
    <div>
      <div className='card m-6 rounded-lg border shadow-sm'>
        <DataTable
          value={organiserData}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: '50rem' }}
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
              <div className='card flex justify-content-center'>
                <Button
                  variant='outlined'
                  onClick={() => ViewYourBookings(data?.requestedBy)}
                >
                  <i className='pi pi-eye' style={{ fontSize: '1.5rem' }}></i>
                </Button>

                <Dialog
                  showHeader={false}
                  visible={visible}
                  style={{ width: '50vw' }}
                  contentStyle={{ borderRadius: '5px' }}
                  onHide={() => setVisible(false)}
                  closeOnEscape
                >
                  <>
                    {artistsData?.map((item, index) => (
                      <div className='flex flex-col items-center px-4 pt-4 gap-2'>
                        <div>
                          <img
                            src={`${path}${item?.requestedBy?.photo}`}
                            alt='profile'
                            className='w-40 h-40 rounded-full'
                          />
                        </div>
                        <div>
                          {' '}
                          <span className='font-bold'> Name:</span>{' '}
                          {item?.artistsName}
                        </div>
                        <div>
                          <span className='font-bold'> Skills:</span>{' '}
                          {item?.requestedBy?.artistsType?.map((item, index) =>
                            item.split(',').join(', ')
                          )}
                        </div>
                        <div>
                          {' '}
                          <span className='font-bold'> Email Id:</span>{' '}
                          {item?.requestedBy?.email}
                        </div>
                        <div>
                          {' '}
                          <span className='font-bold'> Phone No:</span>{' '}
                          {item?.requestedBy?.phone}
                        </div>
                        <div>
                          {' '}
                          <span className='font-bold'> Address:</span>{' '}
                          {item?.requestedBy?.address}
                        </div>
                      </div>
                    ))}
                    <div className='flex justify-end'>
                      <Button
                        variant='outlined'
                        color='error'
                        onClick={() => setVisible(false)}
                      >
                        Close
                      </Button>
                    </div>
                  </>
                </Dialog>
              </div>
            )}
            header='View Artists'
            style={{ width: '20%' }}
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
