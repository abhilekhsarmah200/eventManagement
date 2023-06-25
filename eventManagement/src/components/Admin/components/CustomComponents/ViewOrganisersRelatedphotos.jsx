import { Box, Button, CircularProgress } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LoginContext } from '../ContextProvider/Context';
import SwipeableTextMobileStepper from './Carousel/Carousel.tsx';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ViewOrganisersRelatedphotos() {
  const [organisersData, setOrganisersData] = useState([]);

  const { id } = useParams();

  const [data, setData] = useState(false);

  const viewDetails = async () => {
    const res = await fetch(`http://localhost:8080/viewAllDetails/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    console.log({ organisersData });
    setOrganisersData(data);
  };

  useEffect(() => {
    viewDetails();
    setData(true);
  }, []);

  console.log({ organisersData });
  const path = 'http://localhost:8080/public/images/';

  return (
    <div className='px-10 py-4'>
      {organisersData ? (
        <div className='mt-5'>
          {organisersData?.map((data, index) => (
            <>
              <SwipeableTextMobileStepper
                images={data?.imgCollection}
                index={index}
              />
            </>
          ))}

          {/* {images?.length === 1 && <div>hello</div>}
        {images?.length === 2 && <div>ok</div>} */}
        </div>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          Loading... &nbsp;
          <CircularProgress />
        </Box>
      )}
    </div>
  );
}
