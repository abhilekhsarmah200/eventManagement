import React, { useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import './header.css';
import { LoginContext } from '../ContextProvider/Context';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Box, CircularProgress } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

const AdminHeader = ({ loading }) => {
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
    let token = localStorage.getItem('admindatatoken');

    const res = await fetch('/adminlogout', {
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
      console.log('admin logout');
      localStorage.removeItem('admindatatoken');
      setLoginData(false);
      history('/admin/dashboard');
    } else {
      console.log('error');
    }
  };

  const goProfile = () => {
    history('/admin/profile');
  };

  const goError = () => {
    toast.error('please Login first to access!', {
      position: 'top-center',
      autoClose: 1000,
    });
    history('/admin/login');
  };

  return (
    <>
      <header>
        <nav>
          <div className='flex justify-between p-5 border shadow-md items-center'>
            <NavLink to='/admin/dashboard'>
              <h1 style={{ color: '#2d3748' }}>Admin Dashboard</h1>
            </NavLink>
            <div className='avtar cursor-pointer'>
              {logindata ? (
                <>
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
                    <>
                      <>
                        <Avatar
                          style={{ background: 'blue' }}
                          onClick={handleClick}
                        />
                      </>
                    </>
                  )}
                </>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  loading...
                </Box>
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
                    Admin Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      logoutuser();
                      handleClose();
                    }}
                  >
                    Admin Logout
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
