import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Avatar, Box, Button, CircularProgress } from '@mui/material';
import { Rating } from 'primereact/rating';
import { InputTextarea } from 'primereact/inputtextarea';

export default function Rate({ organiser_Id, userData }) {
  const { id } = useParams();
  const [organiserData, setOrganiserData] = useState();
  const [edited, setEdited] = useState(false);

  const [inpval, setInpval] = useState({
    star: 0,
    organiserId: '',
    comments: '',
  });

  const setVal = (e) => {
    // console.log(e.target.value);

    setInpval({ ...inpval, [e.target.name]: e.target.value });
  };

  const getUserOrganiserData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8010/getOrganiserById/${organiser_Id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await res.json();
      setOrganiserData(data);
      console.log({ data });
    } catch (error) {
      console.log({ error });
    }
  };

  const getUserRatingData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8010/getRatings/64a288a974da438f8153a197`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await res.json();
      // setOrganiserData(data);
      console.log('Rating:', data);
    } catch (error) {
      console.log({ error });
    }
  };

  console.log({ organiserData });

  const addUserdata = async (e) => {
    e.preventDefault();

    let token = localStorage.getItem('usersdatatoken');

    const { star, organiserId, comments } = inpval;

    // console.log("user registration succesfully done");

    try {
      const data = await fetch('http://localhost:8010/rating', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          star,
          organiserId: organiser_Id,
          comments,
          BookingId: id,
        }),
      });

      let res = await data.json();
      console.log({ res });

      if (res.status === 422) {
        toast.error('Your Rating not uploaded', {
          position: 'top-center',
        });
      } else {
        toast.success('Thanks for your rating!!', {
          position: 'top-center',
        });
        const res2 = await fetch(
          `http://localhost:8010/CalculateTotalBalanceByBookingId/${id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ratedBy: res?.updateRating?._id,
            }),
          }
        );
        setTimeout(function () {
          window.location = `/viewBookingDetails/${id}`;
        }, 2000);
        // setLoading(false);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getUserOrganiserData();
    getUserRatingData();
  }, []);

  return (
    <div>
      <section>
        <div className='sm:my-10 my-4 bg-white lg:ml-10 m-4 sm:p-4 p-2 lg:w-[100%] w-[80%] border shadow-xl border-violet-800 rounded-md'>
          <form>
            {/* {organiserData?.ratings?.length === 0 || edited === true ? ( */}
            <>
              <div>
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
              </div>

              <Button className='btn' onClick={addUserdata}>
                Add Rating+
              </Button>
            </>
            {/* ) : (
              <>
                {organiserData?.ratings?.map((item, index) => (
                  <div key={index}>
                    <div className='flex flex-col gap-4'>
                      <div className='form_input gap-4 flex flex-col items-center'>
                        <div>Rating:</div>
                        <Rating
                          cancel={false}
                          name='star'
                          value={item?.star}
                          readOnly
                          onChange={setVal}
                        />
                      </div>
                      <div>
                        <InputTextarea
                          type='text'
                          onChange={setVal}
                          value={item?.comments}
                          readOnly
                          name='comments'
                          className='w-full'
                          id='comments'
                          placeholder='Give Us Your Valuable Feedback'
                        />
                      </div>
                    </div>
                    <div className='flex justify-end p-2'>
                      <Button
                        variant='outlined'
                        onClick={() => setEdited(true)}
                      >
                        Edit Your Rating
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )} */}
          </form>
        </div>
      </section>
    </div>
  );
}
