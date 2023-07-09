import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Moment from 'react-moment';
import { Box, Button, CircularProgress, Tooltip } from '@mui/material';
import { Dialog } from 'primereact/dialog';
import DraggableDialog from '../CustomComponents/ConfirmPopup/ConfirmPopup.tsx';
import DraggableDialogVerified from '../CustomComponents/ConfirmPopup/ConfirmPopupVerified/ConfirmPopupForValidation.tsx';
import { useNavigate } from 'react-router-dom';
import ImageIcon from '@mui/icons-material/Image';
import CustomizedDialogs from '../DialogBox/DialogBox.tsx';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function SimpleDataTableOrganisers({
  id,
  path,
  users,
  logindata,
}) {
  const history = useNavigate();
  const [loading, setLoading] = useState(false);

  const getUserById = async (id) => {
    // let token = localStorage.getItem('admindatatoken');

    history(`/admin/viewOrganiser/${id}`);
  };

  console.log({ users });
  const [inpval, setInpval] = useState({
    organiserValid: false,
  });

  const setVal = (e) => {
    // console.log(e.target.value);

    setInpval({ ...inpval, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <div className='card m-6 rounded-lg border shadow-sm'>
        <DataTable
          value={users}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          responsiveLayout={'stack'}
        >
          <Column
            field={`photo`}
            header='Image'
            body={(data, options) => (
              <>
                {data?.photo ? (
                  <div className='flex justify-center'>
                    <img
                      src={`${path}${data?.photo}`}
                      className='h-28 w-40 rounded-xl shadow-2xl'
                      alt=''
                    />
                  </div>
                ) : (
                  <div className='flex justify-center'>
                    <ImageIcon style={{ fontSize: '3rem', color: 'grey' }} />
                  </div>
                )}
              </>
            )}
            className='fade-in text-black text-bold text-left'
            headerClassName={`text-lg text-black font-semibold text-left`}
            style={{ width: '20%' }}
          ></Column>
          <Column
            field={`venueName`}
            header='Venue Name'
            body={(data, options) => <div>{data?.venueName}</div>}
            className='fade-in text-black text-bold text-left'
            headerClassName={`text-lg text-black font-semibold text-left`}
            style={{ width: '20%' }}
          ></Column>
          <Column
            field='fname'
            header='Manager Name'
            body={(data, options) => (
              <div className='break-words'>{data?.fname}</div>
            )}
            style={{ width: '20%' }}
          ></Column>
          <Column
            field='email'
            header='Email'
            body={(data, options) => (
              <div style={{ wordBreak: 'break-all' }}>{data?.email}</div>
            )}
            style={{ width: '20%' }}
          ></Column>
          <Column
            field='phone'
            body={(data, options) => <div>+91 {data?.phone}</div>}
            header='Mobile'
            style={{ width: '20%' }}
          ></Column>

          <Column
            body={(data, options) => (
              <div>
                {data?.area + ', ' + data?.city + '(' + data?.state + ')'}
              </div>
            )}
            header='Address'
            style={{ width: '20%' }}
          ></Column>
          <Column
            field='pinCode'
            body={(data, options) => <div>{data?.pinCode}</div>}
            header='PIN Code'
            style={{ width: '20%' }}
          ></Column>

          <Column
            field='Actions'
            body={(data, options) => (
              <div className='flex'>
                {data?.organiserValid === false ? (
                  <div className='flex'>
                    <Tooltip title='verify user'>
                      {loading ? (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          Loading... &nbsp;
                          <CircularProgress />
                        </Box>
                      ) : (
                        <DraggableDialogVerified id={data._id} />
                      )}
                    </Tooltip>
                  </div>
                ) : (
                  <div className='flex'>
                    <Tooltip title='view'>
                      <Button
                        variant='outlined'
                        className='cursor-pointer'
                        color='success'
                        onClick={() => getUserById(data._id)}
                      >
                        <VisibilityIcon />
                      </Button>
                    </Tooltip>
                  </div>
                )}
                <div className='text-4xl px-1'>/</div>
                <DraggableDialog id={data._id} />
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
