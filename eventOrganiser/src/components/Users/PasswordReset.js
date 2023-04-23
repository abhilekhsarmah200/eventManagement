import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const PasswordReset = ({ data }) => {
  const [email, setEmail] = useState('');

  const [message, setMessage] = useState('');

  const setVal = (e) => {
    setEmail(e.target.value);
  };

  const sendLink = async (e) => {
    e.preventDefault();

    if (email === '') {
      toast.error('email is required!', {
        position: 'top-center',
      });
    } else if (!email.includes('@')) {
      toast.warning('includes @ in your email!', {
        position: 'top-center',
      });
    } else {
      const res = await fetch('/organisersendpasswordlink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.status == 201) {
        setEmail('');
        toast.success(
          'pasword reset link send Succsfully in Your Email, Please Check!!',
          {
            position: 'top-center',
            autoClose: 3000,
          }
        );
        // setMessage(true);
      } else {
        toast.error('Invalid User', {
          position: 'top-center',
        });
      }
    }
  };

  return (
    <>
      <section>
        <div className='form_data'>
          <div className='form_heading'>
            <h1>Enter Your Email</h1>
          </div>

          {message ? (
            <ToastContainer
              className=''
              style={{ color: 'green', fontWeight: 'bold' }}
              autoClose={1000}
            ></ToastContainer>
          ) : (
            ''
          )}

          <form>
            <div className='form_input'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                value={email}
                onChange={setVal}
                name='email'
                id='email'
                placeholder='Enter Your Email Address'
              />
            </div>

            <button className='btn' onClick={sendLink}>
              Send
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default PasswordReset;
