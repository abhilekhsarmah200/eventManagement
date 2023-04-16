import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Register = () => {
  const [passShow, setPassShow] = useState(false);
  const [cpassShow, setCPassShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [inpval, setInpval] = useState({
    fname: '',
    email: '',
    password: '',
    cpassword: '',
    phone: '',
  });

  const setVal = (e) => {
    // console.log(e.target.value);
    const { name, value } = e.target;

    setInpval(() => {
      return {
        ...inpval,
        [name]: value,
      };
    });
  };

  const re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

  const addUserdata = async (e) => {
    e.preventDefault();

    const { fname, email, password, cpassword, phone, address, pinCode } =
      inpval;

    if (fname === '') {
      toast.warning('fname is required!', {
        position: 'top-center',
      });
    } else if (email === '') {
      toast.error('email is required!', {
        position: 'top-center',
      });
    } else if (!email.includes('@')) {
      toast.warning('includes @ in your email!', {
        position: 'top-center',
      });
    } else if (password === '') {
      toast.error('password is required!', {
        position: 'top-center',
      });
    } else if (password.length < 6) {
      toast.error('password must be 6 char!', {
        position: 'top-center',
      });
    } else if (cpassword === '') {
      toast.error('cpassword is required!', {
        position: 'top-center',
      });
    } else if (cpassword.length < 6) {
      toast.error('confirm password must be 6 char!', {
        position: 'top-center',
      });
    } else if (password !== cpassword) {
      toast.error('pass and Cpass are not matching!', {
        position: 'top-center',
      });
    } else if (phone === '') {
      toast.error('mobile number required', {
        position: 'top-center',
      });
    } else if (phone.length < 10) {
      toast.error('please provide a valid number', {
        position: 'top-center',
      });
    } else if (address === '') {
      toast.error('Address required', {
        position: 'top-center',
      });
    } else if (pinCode === '') {
      toast.error('PIN Code required', {
        position: 'top-center',
      });
    } else {
      // console.log("user registration succesfully done");

      const data = await fetch('/organiserregister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fname,
          email,
          password,
          cpassword,
          phone,
          address,
          pinCode,
        }),
      });

      const res = await data.json();
      // console.log(res.status);

      if (res.status === 201) {
        toast.success('Registration Successfully done 😃!', {
          position: 'top-center',
        });
        window.location = '/organiser/login';
        setInpval({
          ...inpval,
          fname: '',
          email: '',
          password: '',
          cpassword: '',
          phone: '',
          address: '',
          pinCode: '',
        });
      } else {
        toast.error('This Email is Already Exist', {
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
            <h1>Sign Up</h1>
            <p style={{ textAlign: 'center' }}>Thanks for joining us!!</p>
          </div>

          <form>
            <div className='form_input'>
              <label htmlFor='fname'>Manager Name</label>
              <input
                type='text'
                onChange={setVal}
                value={inpval.fname}
                name='fname'
                id='fname'
                placeholder='Enter Your Name'
              />
            </div>
            <div className='form_input'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                onChange={setVal}
                value={inpval.email}
                name='email'
                id='email'
                placeholder='Enter Your Email Address'
              />
            </div>
            <div className='form_input'>
              <label htmlFor='password'>Password</label>
              <div className='two'>
                <input
                  type={!passShow ? 'password' : 'text'}
                  value={inpval.password}
                  onChange={setVal}
                  name='password'
                  id='password'
                  placeholder='Enter Your password'
                />
                <div
                  className='showpass'
                  onClick={() => setPassShow(!passShow)}
                >
                  {!passShow ? 'Show' : 'Hide'}
                </div>
              </div>
            </div>

            <div className='form_input'>
              <label htmlFor='password'>Confirm Password</label>
              <div className='two'>
                <input
                  type={!cpassShow ? 'password' : 'text'}
                  value={inpval.cpassword}
                  onChange={setVal}
                  name='cpassword'
                  id='cpassword'
                  placeholder='Confirm password'
                />
                <div
                  className='showpass'
                  onClick={() => setCPassShow(!cpassShow)}
                >
                  {!cpassShow ? 'Show' : 'Hide'}
                </div>
              </div>
            </div>

            <div className='form_input'>
              <label htmlFor='phone'>Mobile Number</label>
              <input
                type='tel'
                onChange={setVal}
                value={inpval.phone}
                name='phone'
                id='phone'
                pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
                placeholder='Enter Your Mobile Number'
              />
            </div>

            <div className='form_input'>
              <label htmlFor='address'>Location Address</label>
              <input
                type='text'
                onChange={setVal}
                value={inpval.address}
                name='address'
                id='address'
                placeholder='Enter Your location Address'
              />
            </div>

            <div className='form_input'>
              <label htmlFor='pinCode'>PIN Code</label>
              <input
                type='text'
                onChange={setVal}
                value={inpval.pinCode}
                name='pinCode'
                id='pinCode'
                placeholder='PIN Code'
              />
            </div>

            <button className='btn' onClick={addUserdata}>
              Sign Up
            </button>
            <p>
              Already have an account?{' '}
              <NavLink to='/organiser/login'>Log In</NavLink>
            </p>
          </form>
          <ToastContainer />
        </div>
      </section>
    </>
  );
};

export default Register;
