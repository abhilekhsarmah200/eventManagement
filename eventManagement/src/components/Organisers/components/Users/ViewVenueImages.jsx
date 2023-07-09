import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Button } from '@mui/material';
import SwipeableTextMobileStepper from '../Carousel/Carousel.tsx';
import DeleteIcon from '@mui/icons-material/Delete';
import TextArea from '../CustomComponent/TextArea/TextArea';

export default function ViewVenueImagesOrganisers({ logindata }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [details, setDetails] = useState([]);

  const history = useNavigate();

  let organiserId = JSON.parse(localStorage.getItem('organiserdata'));

  console.log({ logindata });

  const viewDetails = async () => {
    const res = await fetch(
      `http://localhost:8010/viewAllDetails/${logindata?.ValidUserOne?._id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();
    setImages(data);
  };

  console.log({ images });

  const updateOrganiserDetails = async (id) => {
    const res = await fetch(
      `http://localhost:8010/updateorganiser/${logindata?.ValidUserOne?._id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          details: details,
        }),
      }
    );

    const data = await res.json();
    if (res.status === 200) {
      toast.success(`Organiser Updated Successfully!!`, {
        position: 'top-center',
      });
      setTimeout(function () {
        window.location = `#`;
      }, 2000);
    }
  };

  const handleDelete = async (id) => {
    let res = [];
    try {
      setLoading(true);
      const text = 'Are you want to delete?';

      if (window.confirm(text) == true) {
        res = await fetch(
          `http://localhost:8010/deleteVenuesPhotosByOrganiserId/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.status === 200) {
          toast.success('VenuePhotos deleted successfully');
          localStorage.removeItem('photoavailable');
          localStorage.setItem('view', false);
          setTimeout(function () {
            window.location = '/organiser/add_venue';
          }, 2000);
        }
      } else {
        toast.error('VenuePhotos not deleted');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    viewDetails();
  }, []);
  return (
    <div className='mt-5'>
      {images?.map((data, index) => (
        <>
          <SwipeableTextMobileStepper
            images={data?.imgCollection}
            index={index}
          />
          <div className='flex mb-5 justify-center'>
            <Button
              variant='outlined'
              className='cursor-pointer'
              color='error'
              onClick={() => handleDelete(data._id)}
            >
              <DeleteIcon />
              Delete Venues Photos
            </Button>
          </div>

          <div className='flex mb-4 md:w-[60%] w-[90%] mt-5 mx-auto gap-4 flex-col justify-start'>
            <div>Add Your Details:</div>

            <div className='w-full mx-auto'>
              {logindata?.ValidUserOne?.details?.map((item, index) => (
                <TextArea
                  placeholder='Section Description'
                  value={item?.htmlValue || details}
                  onTextChange={(e) => {
                    setDetails(e);
                  }}
                />
              ))}

              {logindata?.ValidUserOne?.details?.length === 0 && (
                <TextArea
                  placeholder='Section Description'
                  value={details}
                  onTextChange={(e) => {
                    setDetails(e);
                  }}
                />
              )}
            </div>

            <div className='flex justify-center'>
              <Button
                variant='outlined'
                className='btn'
                onClick={updateOrganiserDetails}
              >
                Submit
              </Button>
            </div>
          </div>

          <ToastContainer />
        </>
      ))}

      {/* {images?.length === 1 && <div>hello</div>}
      {images?.length === 2 && <div>ok</div>} */}
    </div>
  );
}
