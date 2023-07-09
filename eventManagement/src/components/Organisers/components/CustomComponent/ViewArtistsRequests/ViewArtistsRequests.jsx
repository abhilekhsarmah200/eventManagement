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

export default function ViewArtistsRequests({ logindata }) {
  console.log({ logindata });

  const path = 'http://localhost:8010/public/images/';

  return (
    <div>
      <SimpleDataTable logindata={logindata?.ValidUserOne?._id} path={path} />
    </div>
  );
}
