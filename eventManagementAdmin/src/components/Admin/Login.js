import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

const AdminLogin = () => {
  const [passShow, setPassShow] = useState(false);

  const [inpval, setInpval] = useState({
    email: '',
    password: '',
  });

  const history = useNavigate();

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

  const loginadmin = async (e) => {
    e.preventDefault();

    const { email, password } = inpval;

    if (email === '') {
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
    } else {
      // console.log("user login succesfully done");

      const data = await fetch('/adminlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const res = await data.json();
      //  console.log(res);

      if (res.status === 201) {
        localStorage.setItem('admindatatoken', res.result.token);
        toast.success('Login SuccessFully', {
          position: 'top-center',
        });
        setTimeout(function () {
          window.location.href = '/admin/dashboard'; //will redirect to your blog page (an ex: blog.html)
        }, 2000);

        setInpval({ ...inpval, email: '', password: '' });
      } else {
        toast.error('Email/Password is wrong', {
          position: 'top-center',
        });
      }
    }
  };

  return (
    <div className='flex justify-center p-2 mt-10'>
      <section>
        <div
          className='border p-20 rounded-lg'
          style={{ boxShadow: '0 0 15px -10px #2d3748' }}
        >
          <div className='form_heading'>
            <h1 className='text-2xl text-center'>Log In Admin to Access</h1>
          </div>

          <form className='mt-5 flex flex-col gap-4'>
            <div>
              <TextField
                id='outlined-basic'
                type='email'
                value={inpval.email}
                onChange={setVal}
                name='email'
                className='w-[20rem]'
                placeholder='Enter Your Email Address'
                label='Email'
                variant='outlined'
              />
            </div>
            <div className='form_input'>
              <FormControl variant='outlined'>
                <InputLabel htmlFor='outlined-adornment-password'>
                  Password
                </InputLabel>
                <OutlinedInput
                  id='outlined-adornment-password'
                  type={passShow ? 'text' : 'password'}
                  onChange={setVal}
                  value={inpval.password}
                  className='w-[20rem]'
                  name='password'
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={() => setPassShow(!passShow)}
                        edge='end'
                      >
                        {passShow ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label='Password'
                />
              </FormControl>
            </div>
            <div className='flex justify-end'>
              <Button
                variant='outlined'
                className='w-[10rem]'
                type='submit'
                onClick={loginadmin}
              >
                Login
              </Button>
            </div>
            {/* <p>
              Don't have an Account?{' '}
              <NavLink to='/admin/register'>Sign Up</NavLink>{' '}
            </p> */}
            {/* <p style={{ color: 'black', fontWeight: 'bold' }}>
              Forgot Password <NavLink to='/password-reset'>Click Here</NavLink>{' '}
            </p> */}
          </form>
          <ToastContainer />
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
