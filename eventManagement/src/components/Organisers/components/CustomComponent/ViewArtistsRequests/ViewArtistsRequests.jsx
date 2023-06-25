import React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../../ContextProvider/Context';
import { useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import { Avatar, Box, Button, CircularProgress } from '@mui/material';
import { Dialog } from 'primereact/dialog';
import Moment from 'react-moment';
import SimpleDataTable from '../DataTable/DataTable';

export default function ViewArtistsRequests() {
  const { logindata, setLoginData } = useContext(LoginContext);
  console.log({ logindata });

  const [data, setData] = useState(false);

  const { id } = useParams();

  const history = useNavigate();
  let organiserId = localStorage.getItem('organiserId');

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
      setTimeout(function () {
        history('/organiser/login');
      }, 2000);
    } else {
      console.log('user verify');
      setLoginData(data);
      history(`/organiser/artistsRequest/${organiserId}`);
    }
  };

  useEffect(() => {
    DashboardValid();
    setData(true);
  }, []);
  const path = 'http://localhost:8080/public/images/';

  const photo = (rowData) => {
    <div>
      <img src={`${path}${rowData?.photo}`} />
    </div>;
  };

  return (
    <div>
      <SimpleDataTable logindata={logindata?.ValidUserOne?._id} path={path} />
    </div>
  );
}
