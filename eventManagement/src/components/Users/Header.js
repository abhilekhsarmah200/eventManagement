import React, { useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import './header.css';
import { LoginContext } from '../ContextProvider/Context';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import logo from '../../assets/img/cover.png';

const AdminHeader = () => {
  const { logindata, setLoginData } = useContext(LoginContext);

  const history = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutuser = async () => {
    let token = localStorage.getItem('usersdatatoken');

    const res = await fetch('/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    const data = await res.json();
    console.log(data);

    if (data.status == 201) {
      console.log('use logout');
      localStorage.removeItem('usersdatatoken');
      setLoginData(false);
      history('/');
    } else {
      console.log('error');
    }
  };

  const goProfile = () => {
    history('/profile');
  };

  const goError = () => {
    toast.error('please Login first to access!', {
      position: 'top-center',
      autoClose: 1000,
    });
    history('/login');
  };
  const path = 'http://localhost:8010/public/images/';

  return (
    <>
      <header>
        <nav style={{ background: '#472967' }}>
          <div className='flex justify-between p-5 border shadow-md items-center'>
            <NavLink to='/'>
              <img className='h-20' src={logo} />
              <h1 className='text-white'>Event Partners</h1>
            </NavLink>
            <div className='avtar'>
              {logindata ? (
                <div className='cursor-pointer' onClick={handleClick}>
                  <img
                    src={`${path}${logindata.ValidUserOne.photo}`}
                    className='w-14 h-14 rounded-full shadow-md'
                    alt=''
                  />
                </div>
              ) : (
                <Avatar style={{ background: 'blue' }} onClick={handleClick} />
              )}
            </div>

            <Menu
              id='basic-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {logindata.ValidUserOne ? (
                <>
                  <MenuItem
                    onClick={() => {
                      goProfile();
                      handleClose();
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      logoutuser();
                      handleClose();
                    }}
                  >
                    Logout
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem
                    onClick={() => {
                      goError();
                      handleClose();
                    }}
                  >
                    Profile
                  </MenuItem>
                </>
              )}
            </Menu>
          </div>
        </nav>
      </header>
    </>
  );
};

export default AdminHeader;
