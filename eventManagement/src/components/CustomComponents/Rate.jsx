import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Avatar, Box, Button, CircularProgress } from '@mui/material';
import { Rating } from 'primereact/rating';
import { InputTextarea } from 'primereact/inputtextarea';

export default function Rate({ organiser_Id, is_canceled }) {
  //   console.log({ organiserId });

  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const [inpval, setInpval] = useState({
    star: 0,
    organiserId: '',
    comments: '',
  });

  const setVal = (e) => {
    // console.log(e.target.value);

    setInpval({ ...inpval, [e.target.name]: e.target.value });
  };

  const addUserdata = async (e) => {
    e.preventDefault();

    let token = localStorage.getItem('usersdatatoken');

    const url = 'http://localhost:8010/rating';

    const { star, organiserId, comments } = inpval;

    // console.log("user registration succesfully done");

    try {
      const res = await fetch('http://localhost:8010/rating', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          star,
          organiserId: organiser_Id,
          comments,
        }),
      });

      if (res.status === 422) {
        toast.error('Your Rating not uploaded', {
          position: 'top-center',
        });
      } else {
        toast.success('Your Rating updated successfully!!', {
          position: 'top-center',
        });
        window.location = '/';
        // setLoading(false);
      }
    } catch (error) {}
  };
  return (
    <div>
      {!is_canceled && (
        <section>
          <div className='sm:my-10 my-4 lg:ml-10 m-4 sm:p-4 p-2 lg:w-[100%] w-[80%] border shadow-xl border-violet-800 rounded-md'>
            <form>
              {/* {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '5vh',
                }}
              >
                Loading... &nbsp;
                <CircularProgress />
              </Box>
            ) : ( */}
              <>
                <div className='flex flex-col gap-4'>
                  <div className='form_input gap-4 flex flex-col items-center'>
                    <div>Rating:</div>
                    <Rating
                      cancel={false}
                      name='star'
                      value={inpval.star}
                      onChange={setVal}
                    />
                  </div>
                  <div>
                    <InputTextarea
                      type='text'
                      onChange={setVal}
                      value={inpval.comments}
                      name='comments'
                      className='w-full'
                      id='comments'
                      placeholder='Give Us Your Valuable Feedback'
                    />
                  </div>
                </div>
              </>
              {/* )} */}
              <Button className='btn' onClick={addUserdata}>
                Add Rating+
              </Button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}
