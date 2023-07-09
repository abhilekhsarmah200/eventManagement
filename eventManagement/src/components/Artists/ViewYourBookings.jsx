import React, { useEffect, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../ContextProvider/Context';
import { ToastContainer, toast } from 'react-toastify';
import { Card } from 'primereact/card';
import { Button, CircularProgress } from '@mui/material';
import DraggableDialog from './ConfirmPopup/ConfirmPopup.tsx';
import Moment from 'react-moment';
import DraggableDialogImage from './ConfirmPopup/ConfirmImagePopup/ConfirmImagePopup.tsx';

export default function ViewYourBookings(props) {
  const [data, setData] = useState(false);
  const [organiserData, setOrganiserData] = useState(null);

  let organiserId = props?.logindata?.ValidUserOne?.organiserId;

  console.log(props?.logindata?.ValidUserOne?._id);
  const history = useNavigate();

  const ViewYourBookings = async () => {
    const res = await fetch(
      `http://localhost:8010/viewJoinedDataUsingArtistsId/${props?.logindata?.ValidUserOne?._id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();
    setOrganiserData(data);
  };

  useEffect(() => {
    setData(true);
    setTimeout(function () {
      ViewYourBookings();
    }, 3000);
  }, []);

  console.log({ organiserData });

  const header = (
    <>
      {organiserData?.length === null ? (
        <div>
          You are not connected with any organisation{' '}
          <a href='/artists/join_venue' className='underline'>
            Please join a organisation
          </a>
        </div>
      ) : (
        <>
          <div className='flex flex-col gap-4'>
            {organiserData
              ?.map((item, index) => (
                <div key={index}>
                  {' '}
                  <div>You'r Now Connected With:</div>
                  {item?.requestAccepted === true ? (
                    <div className='uppercase text-center font-bold mt-2'>
                      {item?.eventName}
                    </div>
                  ) : (
                    <div className='mt-2 text-center'>
                      your request is pending with{' '}
                      <span className='uppercase font-bold'>
                        {item?.eventName}
                      </span>
                      ...
                    </div>
                  )}
                  <div className='flex mt-2 justify-center'>
                    <DraggableDialogImage path={props?.path} item={item} />
                  </div>
                </div>
              ))
              .slice(0, 1)}
          </div>
        </>
      )}
    </>
  );

  const footer = (
    <div className='flex mt-5 flex-wrap justify-end gap-2'>
      {organiserData
        ?.map((item, index) => (
          <>
            <DraggableDialog
              logindata={props?.logindata}
              id={item?._id}
              item={item}
            />
          </>
        ))
        .slice(0, 1)}
    </div>
  );

  return (
    <div>
      {organiserData ? (
        <div className='card my-10 flex justify-center'>
          <Card
            footer={footer}
            header={header}
            className='md:w-[25rem] border rounded-xl shadow-xl p-5'
          >
            <>
              {organiserData
                ?.map((item, index) => (
                  <>
                    <div className='flex flex-col gap-2' key={index}>
                      {' '}
                      <div>
                        <div className='text-right mt-2'>
                          Requested At:{' '}
                          <Moment format='D MMM YYYY'>{item?.createdAt}</Moment>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col gap-2' key={index}>
                      {' '}
                      <div>
                        <div className='text-right mt-2'>
                          {item?.details?.map((item, index) => (
                            <div key={index}>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: item?.htmlValue,
                                }}
                              ></span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ))
                .slice(0, 1)}
            </>
          </Card>
        </div>
      ) : (
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
      )}
      <ToastContainer />
    </div>
  );
}
