import React, { useEffect, useContext, useState } from 'react';
import { LoginContext } from '../ContextProvider/Context';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FilesUploadComponent from './AddVenue';

export default function AddVanuePhotos() {
  const [data, setData] = useState(false);

  const { logindata, setLoginData } = useContext(LoginContext);

  const [photosData, setPhotosData] = useState('');

  const history = useNavigate();

  const DashboardValid = async () => {
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
      history('/organiser/add_vanue');
    }
  };

  localStorage.setItem('organiserId', logindata?.ValidUserOne?._id);

  const vanuePhotosValid = async () => {
    const res = await fetch('/vanuephotos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (data.status == 401 || !data) {
      toast.error('No Photos available', {
        position: 'top-center',
      });
    } else {
      console.log('photos available');
      setPhotosData(data);
      //   history('/organiser');
    }
  };

  let compaireOrganiserId = localStorage.getItem('organiserId');

  let organiserId = photosData?.users?.map((item, index) => item?.userId);

  console.log({ organiserId });
  console.log({ photosData });

  useEffect(() => {
    // setTimeout(() => {
    DashboardValid();
    vanuePhotosValid();
    setData(true);
    // }, 2000);
  }, []);
  return (
    <div>
      <>
        {photosData?.users?.length > 0 ? (
          <>
            <div> Uploaded Photos:</div>
            <div className='flex justify-center gap-6 flex-wrap'>
              {photosData?.users?.map((item, index) => (
                <>
                  {item.imgCollection?.map((imgs, ind) => (
                    <img
                      className='h-32 w-40 mt-4 shadow-md border rounded-lg'
                      src={imgs}
                    />
                  ))}
                </>
              ))}
            </div>
          </>
        ) : (
          <div> Upload Vanue Photos:</div>
        )}
      </>

      <FilesUploadComponent id={logindata?.ValidUserOne?._id} />
    </div>
  );
}
