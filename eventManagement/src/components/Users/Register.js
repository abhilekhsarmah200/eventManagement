import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import { Dropdown } from 'primereact/dropdown';

const Register = () => {
  const [passShow, setPassShow] = useState(false);
  const [cpassShow, setCPassShow] = useState(false);
  const [profileImage, setProfileImage] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const users = [
    // { id: 1, name: 'ADMIN' },
    { id: 2, name: 'USER' },
    { id: 2, name: 'ORGANISER' },
    { id: 3, name: 'ARTISTS' },
  ];
  console.log({ selectedRole });

  const [inpval, setInpval] = useState({
    fname: '',
    venueName: '',
    email: '',
    password: '',
    cpassword: '',
    phone: '',
    area: '',
    role: selectedRole?.name || '',
    pinCode: '',
    photo: '',
    city: '',
    state: '',
    country: '',
    organiserValid: false || '',
  });

  const setVal = (e) => {
    // console.log(e.target.value);

    setInpval({ ...inpval, [e.target.name]: e.target.value });
  };

  const setImage = (e) => {
    const setProfile = e.target.files;
    const selectedFilesArray = Array.from(setProfile);
    const imageArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    setInpval({ ...inpval, photo: e.target.files[0] });
    setProfileImage(imageArray);
  };

  const re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

  const addUserdata = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:8010/register';
    const formdata = new FormData();

    formdata.append('myFile', inpval.photo);
    formdata.append('email', inpval.email);
    formdata.append('fname', inpval.fname);
    formdata.append('password', inpval.password);
    formdata.append('cpassword', inpval.cpassword);
    formdata.append('phone', inpval.phone);
    formdata.append('area', inpval.area);
    formdata.append('pinCode', inpval.pinCode);
    formdata.append('city', inpval.city);
    formdata.append('state', inpval.state);
    formdata.append('country', inpval.country);
    formdata.append('role', selectedRole.name);
    if (selectedRole?.name === 'ORGANISER') {
      formdata.append('venueName', inpval.venueName);
      formdata.append('organiserValid', false);
    }
    const {
      fname,
      venueName,
      email,
      password,
      cpassword,
      phone,
      area,
      pinCode,
      photo,
      city,
      state,
      country,
    } = inpval;

    if (fname === '') {
      toast.warning('fname is required!', {
        position: 'top-center',
      });
    } else if (selectedRole?.name === 'ORGANISER' && venueName === '') {
      toast.error('venueName is required!', {
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
    } else if (phone.length > 10) {
      toast.error('please provide a 10 digit number', {
        position: 'top-center',
      });
    } else if (area === '') {
      toast.error('Area required', {
        position: 'top-center',
      });
    } else if (pinCode === '') {
      toast.error('PIN Code required', {
        position: 'top-center',
      });
    } else if (city === '') {
      toast.error('city required', {
        position: 'top-center',
      });
    } else if (state === '') {
      toast.error('state required', {
        position: 'top-center',
      });
    } else if (country === '') {
      toast.error('country required', {
        position: 'top-center',
      });
    } else if (photo.length === 0) {
      toast.error('Photo is required', {
        position: 'top-center',
      });
    } else {
      // console.log("user registration succesfully done");

      try {
        let res = await axios.post(url, formdata);
        if (res.status === 422) {
          toast.error('email is already taken', {
            position: 'top-center',
          });
        } else {
          toast.success('Registration Successfully done 😃!', {
            position: 'top-center',
          });
          setTimeout(function () {
            window.location = '/login';
          }, 2000);
        }
      } catch (error) {}
    }
  };

  return (
    <>
      <section>
        <div className='form_data'>
          <div className='form_heading'>
            <h1>Sign Up</h1>
            <p style={{ textAlign: 'center' }}>
              We are glad that you will be using Event Partners to Book for{' '}
              <br />
              your Parties,Marriage event!! We hope that you will get like it.
            </p>
          </div>

          <form>
            {selectedRole === null ? null : (
              <>
                <div className='flex justify-center mb-4'>
                  {profileImage && (
                    <div>
                      {profileImage?.map((img, index) => {
                        return (
                          <img
                            src={img}
                            className={
                              selectedRole?.name === 'ORGANISER'
                                ? 'w-60 h-40 rounded-lg'
                                : 'w-40 h-40 rounded-full'
                            }
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className='flex justify-center'>
                  <Stack direction='row' alignItems='center' spacing={2}>
                    <Button variant='contained' component='label'>
                      Upload
                      <input
                        onChange={setImage}
                        hidden
                        accept='image/*'
                        multiple
                        type='file'
                      />
                    </Button>
                    <IconButton
                      color='primary'
                      aria-label='upload picture'
                      component='label'
                    >
                      <input
                        onChange={setImage}
                        hidden
                        accept='image/*'
                        type='file'
                      />
                      <PhotoCamera />
                    </IconButton>
                  </Stack>
                </div>
              </>
            )}
            <Dropdown
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.value);
              }}
              options={users}
              optionLabel='name'
              placeholder='Select Users Role'
              className='w-full md:w-14rem mt-10'
            />
            {selectedRole === null ? null : (
              <div className='mt-2'>
                <div className='form_input'>
                  <label htmlFor='fname'>
                    {selectedRole?.name === 'ORGANISER'
                      ? 'Manager Name'
                      : selectedRole?.name === 'ARTISTS'
                      ? 'Artists Name'
                      : 'Name'}
                  </label>
                  <input
                    type='text'
                    onChange={setVal}
                    value={inpval.fname}
                    name='fname'
                    id='fname'
                    placeholder='Enter Your Name'
                  />
                </div>
                {selectedRole?.name === 'ORGANISER' && (
                  <div className='form_input'>
                    <label htmlFor='venueName'>Venue Name</label>
                    <input
                      type='text'
                      onChange={setVal}
                      value={inpval.venueName}
                      name='venueName'
                      id='venueName'
                      placeholder='Enter Your Venue Name'
                    />
                  </div>
                )}
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
                <div className='flex gap-3'>
                  <div className='form_input'>
                    <label htmlFor='area'>Area Location</label>
                    <input
                      type='text'
                      onChange={setVal}
                      value={inpval.area}
                      name='area'
                      id='area'
                      placeholder='Enter Your Area location'
                    />
                  </div>
                  <div className='form_input'>
                    <label htmlFor='city'>City</label>
                    <input
                      type='text'
                      onChange={setVal}
                      value={inpval.city}
                      name='city'
                      id='city'
                      placeholder='Enter Your City'
                    />
                  </div>
                </div>
                <div className='flex gap-3'>
                  <div className='form_input'>
                    <label htmlFor='state'>State</label>
                    <input
                      type='text'
                      onChange={setVal}
                      value={inpval.state}
                      name='state'
                      id='state'
                      placeholder='Enter Your state'
                    />
                  </div>
                  <div className='form_input'>
                    <label htmlFor='country'>Country</label>
                    <input
                      type='text'
                      onChange={setVal}
                      value={inpval.country}
                      name='country'
                      id='country'
                      placeholder='Country'
                    />
                  </div>
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
              </div>
            )}
            <p>
              Already have an account? <NavLink to='/login'>Log In</NavLink>
            </p>
          </form>
          <ToastContainer />
        </div>
      </section>
    </>
  );
};

export default Register;
