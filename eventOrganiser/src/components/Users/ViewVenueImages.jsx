import React, { useEffect, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../ContextProvider/Context';
import { ToastContainer, toast } from 'react-toastify';
import { Button } from '@mui/material';
import SwipeableTextMobileStepper from '../Carousel/Carousel.tsx';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ViewVenueImages() {
  const { logindata, setLoginData } = useContext(LoginContext);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const history = useNavigate();

  let organiserId = JSON.parse(localStorage.getItem('organiserdata'));

  console.log({ organiserId });

  const viewDetails = async () => {
    const res = await fetch(
      `http://localhost:8080/viewAllDetails/${organiserId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();
    console.log({ images });
    setImages(data);
  };

  console.log({ logindata });
  const HomeValid = async () => {
    let token = localStorage.getItem('organiserdatatoken');

    const res = await fetch('/organiservalid', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    const data = await res.json();

    if (data.status == 401 || !data) {
      toast.error('login first!!', {
        position: 'top-center',
      });
      window.location = '/organiser/login';
    } else {
      console.log('user verify');
      setLoginData(data);
      history(`/organiser/view_venuePhotos/${organiserId}`);
    }
  };

  const handleDelete = async (id) => {
    let res = [];
    try {
      setLoading(true);
      const text = 'Are you want to delete?';

      if (window.confirm(text) == true) {
        res = await fetch(
          `http://localhost:8080/deleteVenuesPhotosByOrganiserId/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.status === 200) {
          toast.success('VenuePhotos deleted successfully');
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
    HomeValid();
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
          <ToastContainer />
        </>
      ))}

      {/* {images?.length === 1 && <div>hello</div>}
      {images?.length === 2 && <div>ok</div>} */}
    </div>
  );
}
