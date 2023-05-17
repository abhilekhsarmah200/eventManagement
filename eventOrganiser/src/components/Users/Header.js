import React, { useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import './header.css';
import { LoginContext } from '../ContextProvider/Context';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import logo from '../../assets/img/cover2.png';
import SideBar from '../SideBar.tsx';
import { useEffect } from 'react';
import { useState } from 'react';

const AdminHeader = () => {
  const { logindata, setLoginData } = useContext(LoginContext);

  const [images, setImages] = useState([]);

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
    let token = localStorage.getItem('organiserdatatoken');

    const res = await fetch('/organiserlogout', {
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
      console.log('organiser logout');
      localStorage.removeItem('organiserdatatoken');
      localStorage.removeItem('organiserdata');
      setLoginData(false);
      window.location = '/organiser/profile';
    } else {
      console.log('error');
    }
  };

  let organiserId = JSON.parse(localStorage.getItem('organiserdata'));

  console.log({ organiserId });

  const viewDetails = async () => {
    const res = await fetch(
      `http://localhost:8080/viewAllDetails/${organiserId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();
    console.log({ images });
    setImages(data);
  };

  useEffect(() => {
    viewDetails();
  }, []);

  const goProfile = () => {
    history('/organiser/profile');
  };

  const goError = () => {
    toast.error('please Login first to access!', {
      position: 'top-center',
      autoClose: 1000,
    });
    history('/organiser/login');
  };

  const data = images.map((item, index) => item);

  return (
    <>
      <header>
        <nav>
          <div className='flex justify-between p-5 border shadow-md items-center'>
            <div className='flex flex-col items-center'>
              <NavLink to='/organiser'>
                <img className='h-20' src={logo} />
              </NavLink>{' '}
              <SideBar images={data} />
            </div>
            <div className='avtar cursor-pointer'>
              {logindata.ValidUserOne ? (
                <Avatar
                  style={{
                    background: 'salmon',
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                  }}
                  onClick={handleClick}
                >
                  {logindata.ValidUserOne.fname[0].toUpperCase()}
                </Avatar>
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
