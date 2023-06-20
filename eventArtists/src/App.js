import Header from './components/Users/Header';
import Login from './components/Users/Login';
import Home from './components/Users/index';
import Register from './components/Users/Register';
import Dashboard from './components/Users/Dashboard';
import Error from './components/Users/Error';
import PasswordReset from './components/Users/PasswordReset';
import ForgotPassword from './components/Users/ForgotPassword';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import { LoginContext } from './components/ContextProvider/Context';
import 'react-toastify/dist/ReactToastify.css';
import './components/Users/mix.css';
import SideBar from './components/SideBar.tsx';
import AddVenue from './components/Users/AddVenue';
import AddWithVenues from './components/Users/AddWithVenues';
import './style/custom.css';
import ViewYourBookings from './components/Users/ViewYourBookings';

function App() {
  const [data, setData] = useState(false);

  const { logindata, setLoginData } = useContext(LoginContext);

  const history = useNavigate();

  const DashboardValid = async () => {
    let token = localStorage.getItem('artistsdatatoken');

    const res = await fetch('/artistsvalid', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    const data = await res.json();

    if (data.status == 401 || !data) {
      console.log('Artists not valid');
    } else {
      console.log('Artists verify');
      setLoginData(data);
    }
  };

  useEffect(() => {
    DashboardValid();
    setData(true);
  }, []);

  return (
    <>
      {data ? (
        <>
          <Header />

          <Routes>
            <Route path='/artists' exact element={<Home />} />
            <Route path='/artists/login' element={<Login />} />
            <Route path='/artists/register' element={<Register />} />
            <Route path='/artists/profile' element={<Dashboard />} />
            <Route path='/artists/password-reset' element={<PasswordReset />} />
            {/* <Route
              path='/organiserforgotpassword/:id/:token'
              element={<ForgotPassword />}
            /> */}
            <Route path='*' element={<Error />} />
            <Route path='/artists/join_venue' element={<AddWithVenues />} />
          </Routes>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          Loading... &nbsp;
          <CircularProgress />
        </Box>
      )}
    </>
  );
}

export default App;
