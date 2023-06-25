import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import { Dropdown } from 'primereact/dropdown';

const RegisterOrganisers = () => {
  const [passShow, setPassShow] = useState(false);
  const [cpassShow, setCPassShow] = useState(false);
  const [profileImage, setProfileImage] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const history = useNavigate();

  const [selectedVenueCategory, setSelectedVenueCategory] = useState(null);
  const venueCategory = [{ name: 'Marriage Hall' }, { name: 'Banquet Halls' }];

  const [inpval, setInpval] = useState({
    fname: '',
    venueName: '',
    email: '',
    password: '',
    cpassword: '',
    phone: '',
    address: '',
    pinCode: '',
    photo: '',
    venueCategory: selectedVenueCategory || '',
    city: '',
    state: '',
    country: '',
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
    const url = 'http://localhost:8080/organiserOrganisers';
    const formdata = new FormData();

    formdata.append('myFile', inpval.photo);
    formdata.append('email', inpval.email);
    formdata.append('fname', inpval.fname);
    formdata.append('venueName', inpval.venueName);
    formdata.append('password', inpval.password);
    formdata.append('cpassword', inpval.cpassword);
    formdata.append('phone', inpval.phone);
    formdata.append('address', inpval.address);
    formdata.append('venueCategory', JSON.stringify(selectedVenueCategory));
    formdata.append('pinCode', inpval.pinCode);
    formdata.append('city', inpval.city);
    formdata.append('state', inpval.state);
    formdata.append('country', inpval.country);
    const {
      fname,
      venueName,
      email,
      password,
      cpassword,
      phone,
      address,
      venueCategory,
      pinCode,
      photo,
      city,
      state,
      country,
    } = inpval;
    let regx = /[a-zA-Z]/g;

    if (fname === '') {
      toast.warning('fname is required!', {
        position: 'top-center',
      });
    } else if (email === '') {
      toast.error('email is required!', {
        position: 'top-center',
      });
    } else if (venueName === '') {
      toast.error('Venue Name is required!', {
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
      toast.error('please provide 10 digit valid number', {
        position: 'top-center',
      });
    } else if (address === '') {
      toast.error('Address required', {
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
    } else if (pinCode === '') {
      toast.error('PIN Code required', {
        position: 'top-center',
      });
    } else if (profileImage.length === 0) {
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
            history('/organiser/login');
          }, 2000);
        }
      } catch (error) {}
    }
  };

  const path = 'http://localhost:8080/public/images/';

  return (
    <>
      <section>
        <div className='form_data'>
          <div className='form_heading'>
            <h1>Sign Up</h1>
            <p style={{ textAlign: 'center' }}>Thanks for joining us!!</p>
          </div>

          <form>
            <div className='flex justify-center mb-4'>
              {profileImage && (
                <div>
                  {profileImage?.map((img, index) => {
                    return <img src={img} className='w-auto h-40 rounded-md' />;
                  })}
                </div>
              )}
            </div>
            <div className='flex justify-center flex-col gap-4 items-center'>
              {profileImage.length === 0 ? <div>Upload Main Photo</div> : null}

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
              <label htmlFor='Venue'>Venue Category</label>

              <Dropdown
                value={selectedVenueCategory}
                onChange={(e) => {
                  setSelectedVenueCategory(e.value);
                }}
                options={venueCategory}
                optionLabel='name'
                placeholder='Select Venue Category'
                className='w-full md:w-14rem'
              />
            </div>

            <div className='form_input mt-4'>
              <label htmlFor='phone'>Mobile Number</label>
              <input
                type='text'
                onChange={setVal}
                value={inpval.phone}
                name='phone'
                id='phone'
                placeholder='Enter Your Mobile Number'
              />
            </div>
            <div className='form_input'>
              <label htmlFor='address'>Address</label>
              <input
                type='text'
                onChange={setVal}
                value={inpval.address}
                name='address'
                id='address'
                placeholder='Enter Your location Address'
              />
            </div>

            <div className='flex gap-2'>
              <div className='form_input'>
                <label htmlFor='city'>city</label>
                <input
                  type='text'
                  onChange={setVal}
                  value={inpval.city}
                  name='city'
                  id='city'
                  placeholder='Enter Your city'
                />
              </div>
              <div className='form_input'>
                <label htmlFor='state'>state</label>
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
                <label htmlFor='country'>country</label>
                <input
                  type='text'
                  onChange={setVal}
                  value={inpval.country}
                  name='country'
                  id='country'
                  placeholder='Enter Your country'
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

export default RegisterOrganisers;
