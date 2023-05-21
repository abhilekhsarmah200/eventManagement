import React, { useEffect, useContext, useState } from 'react';
import { LoginContext } from '../ContextProvider/Context';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FilesUploadComponent from './AddVenue';

export default function AddVenuePhotos() {
  const [data, setData] = useState(false);

  const { logindata, setLoginData } = useContext(LoginContext);

  const [organisersIds, setOrganisersIds] = useState([]);

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
      history('/organiser/add_venue');
    }
  };

  localStorage.setItem('organiserId', logindata?.ValidUserOne?._id);

  let compaireOrganiserId = localStorage.getItem('organiserId');

  useEffect(() => {
    // setTimeout(() => {
    DashboardValid();

    setData(true);
    // }, 2000);
  }, []);
  return (
    <div>
      <div>
        {logindata?.ValidUserOne?.length > 0 ? (
          <>
            <div> Uploaded Photos:</div>
            <div className='flex justify-center gap-6 flex-wrap'>
              {logindata?.ValidUserOne?.map((item, index) => (
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
          <div> Upload Venue Photos:</div>
        )}
      </div>

      <FilesUploadComponent id={logindata?.ValidUserOne?._id} />
    </div>
  );
}
