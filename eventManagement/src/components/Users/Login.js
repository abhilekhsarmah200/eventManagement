import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import './mix.css';
import { Dropdown } from 'primereact/dropdown';

const Login = () => {
  const [passShow, setPassShow] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const users = [
    { id: 1, name: 'ADMIN' },
    { id: 2, name: 'USER' },
    { id: 2, name: 'ORGANISER' },
    { id: 3, name: 'ARTISTS' },
  ];

  const [inpval, setInpval] = useState({
    email: '',
    password: '',
    role: selectedRole?.name || '',
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

  const loginuser = async (e) => {
    e.preventDefault();

    const { email, password, role } = inpval;

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

      const data = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role: selectedRole?.name,
        }),
      });

      const res = await data.json();
      //  console.log(res);

      if (res.status === 201) {
        localStorage.setItem('usersdatatoken', res.result.token);

        localStorage.setItem('userId', res.result.userValid._id);

        window.location = '/';
        setInpval({ ...inpval, email: '', password: '' });
      } else {
        toast.error(`${res?.message}`, {
          position: 'top-center',
        });
      }
    }
  };

  return (
    <>
      <section>
        <div className='form_data bg-white'>
          <div className='form_heading'>
            <h1>Welcome Back, Log In</h1>
            <p>Hi, we are you glad you are back. Please login.</p>
          </div>

          <form>
            <div className='font-bold'>Role</div>
            <Dropdown
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.value);
              }}
              options={users}
              optionLabel='name'
              placeholder='Select Users Role'
              className='w-full md:w-14rem mt-2'
            />

            <div className='form_input'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                value={inpval.email}
                onChange={setVal}
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
                  onChange={setVal}
                  value={inpval.password}
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

            <button className='btn' onClick={loginuser}>
              Login
            </button>
            <p>
              Don't have an Account? <NavLink to='/register'>Sign Up</NavLink>{' '}
            </p>
            <p style={{ color: 'black', fontWeight: 'bold' }}>
              Forgot Password <NavLink to='/password-reset'>Click Here</NavLink>{' '}
            </p>
          </form>
          <ToastContainer />
        </div>
      </section>
    </>
  );
};

export default Login;
