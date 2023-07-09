import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import Moment from 'react-moment';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function BasicTableOrganiser({ users }) {
  // const [organisersData, setOrganisersData] = useState();
  // const history = useNavigate();

  // let id = props?.users?.map((item) => item.organiser_Id);

  // const vewBookingById = async (id) => {
  //   history(`/viewBookingDetails/${id}`);
  // };

  // useEffect(() => {
  //   // organiserById();
  // }, []);

  const path = 'http://localhost:8080/public/images/';

  return (
    <div>
      <div className='my-5 font-bold flex justify-center'>Booking List:</div>
      <div className='border border-purple-950 rounded-sm'>
        <DataTable
          value={users}
          paginator
          rows={5}
          className=''
          rowsPerPageOptions={[5, 10, 25, 50]}
          responsiveLayout={'stack'}
        >
          <Column
            field='Booking Id:'
            header='Booking Id:'
            body={(data, options) => <div>{options?.rowIndex + 1}</div>}
            style={{ width: '10%' }}
          ></Column>
          <Column
            field='userName'
            header='Booking By:'
            style={{ width: '20%' }}
          ></Column>
          <Column
            field='eventName'
            header='Event Name:'
            style={{ width: '15%' }}
          ></Column>
          <Column
            field='guest'
            header='Total Guest:'
            style={{ width: '15%' }}
          ></Column>
          <Column
            field='requiredArtist'
            header='Artists Required:'
            style={{ width: '20%' }}
          ></Column>
          <Column
            field='bookingDate'
            header='Booking Date:'
            body={(data, options) => (
              <Moment format='DD-MM-YYYY'>{data?.bookingDate}</Moment>
            )}
            style={{ width: '30%' }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
