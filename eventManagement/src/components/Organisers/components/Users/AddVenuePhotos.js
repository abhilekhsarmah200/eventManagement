import React, { useEffect, useContext, useState } from 'react';
import { LoginContext } from '../ContextProvider/Context';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FilesUploadComponent from './AddVenue';
import TextArea from '../CustomComponent/TextArea/TextArea';
import { Button } from '@mui/material';

export default function AddVenuePhotosOrganisers({
  logindata = { logindata },
}) {
  const history = useNavigate();
  const [details, setDetails] = useState([]);
  const [edit, setEdit] = useState(false);

  const htmlValue = logindata?.ValidUserOne?.details?.map(
    (item) => item?.htmlValue
  );
  console.log({ htmlValue });

  const updateOrganiserDetails = async (id) => {
    const res = await fetch(
      `http://localhost:8010/updateorganiser/${logindata?.ValidUserOne?._id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          details: details || htmlValue,
        }),
      }
    );

    const data = await res.json();
    if (res.status === 200) {
      toast.success(`Organiser Updated Successfully!!`, {
        position: 'top-center',
      });
      setTimeout(function () {
        window.location.reload();
        setEdit(true);
      }, 2000);
    }
  };

  console.log({ edit });

  return (
    <div>
      <div>
        {logindata?.ValidUserOne?.length > 0 ? (
          <>
            <div className='text-center mt-5'> Uploaded Photos:</div>
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
          <div className='text-center mt-5 font-bold'>
            {' '}
            Upload Venue Photos:
          </div>
        )}
      </div>

      <FilesUploadComponent id={logindata?.ValidUserOne?._id} />

      <div className='flex mb-4 md:w-[60%] w-[90%] mt-5 mx-auto gap-4 flex-col justify-start'>
        <div className='font-bold'>Add Your Details:</div>

        <div className='w-full bg-white  mx-auto'>
          {logindata?.ValidUserOne?.details?.map((item, index) => (
            <div>
              {edit === true ? (
                <TextArea
                  placeholder='Section Description'
                  value={item?.htmlValue || details}
                  onTextChange={(e) => {
                    setDetails(e);
                  }}
                />
              ) : (
                <div className='p-6'>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item?.htmlValue,
                    }}
                  ></span>
                </div>
              )}
            </div>
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
        {edit ? (
          <div className='flex justify-center'>
            <Button
              variant='outlined'
              className='btn'
              onClick={updateOrganiserDetails}
            >
              Submit
            </Button>
          </div>
        ) : (
          <div className='flex justify-center'>
            <Button
              variant='outlined'
              className='btn'
              onClick={() => setEdit(true)}
            >
              Edit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
