import { Button, Tooltip } from '@mui/material';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

export default function AddArtists({ artistsId, data, fname }) {
  console.log({ data });

  const handleAddArtists = async (id) => {
    const res = await fetch(
      `http://localhost:8010/updateArtistsToBooking/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artistsName: artistsId,
          artist: fname,
        }),
      }
    );

    const data = await res.json();
    if (res.status === 200) {
      toast.success(`Artists added successfully!!`, {
        position: 'top-center',
      });
      setTimeout(function () {
        // window.location.href = `/organiser/artistsRequest/${id}`;
        window.location.reload();
      }, 2000);
    }
  };

  const handleDisconnectArtists = async (id) => {
    const res = await fetch(
      `http://localhost:8010/updateArtistsToBooking/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artistsName: '643654594db3ac9a63fb4f1a',
          artist: '',
        }),
      }
    );

    const data = await res.json();
    if (res.status === 200) {
      toast.success(`Artists disconnected successfully!!`, {
        position: 'top-center',
      });
      setTimeout(function () {
        // window.location.href = `/organiser/artistsRequest/${id}`;
        window.location.reload();
      }, 2000);
    }
  };
  return (
    <div>
      <div className='flex flex-col gap-2'>
        {data?.artistsName === '643654594db3ac9a63fb4f1a' ? (
          <>
            <Button
              variant='outlined'
              onClick={() => handleAddArtists(data?._id)}
            >
              Connect
            </Button>
          </>
        ) : (
          <>
            <Tooltip
              title={
                data?.artist === ''
                  ? 'Not Connected Yet!!!'
                  : `Connected with ${data?.artist}`
              }
              placement='left'
            >
              <Button
                onClick={() => handleDisconnectArtists(data?._id)}
                variant='outlined'
              >
                DisConnect
              </Button>
            </Tooltip>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
