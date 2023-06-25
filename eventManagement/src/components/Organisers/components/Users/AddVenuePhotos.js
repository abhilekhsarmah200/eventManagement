import React, { useEffect, useContext, useState } from 'react';
import { LoginContext } from '../ContextProvider/Context';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FilesUploadComponent from './AddVenue';

export default function AddVenuePhotosOrganisers({
  logindata = { logindata },
}) {
  const history = useNavigate();

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
