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

function App() {
  const [data, setData] = useState(false);

  const { logindata, setLoginData } = useContext(LoginContext);

  const history = useNavigate();

  const DashboardValid = async () => {
    let token = localStorage.getItem('organisersdatatoken');

    const res = await fetch('/validorganiser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    const data = await res.json();

    if (data.status == 401 || !data) {
      console.log('user not valid');
    } else {
      console.log('user verify');
      setLoginData(data);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      DashboardValid();
      setData(true);
    }, 2000);
  }, []);

  return (
    <>
      {data ? (
        <>
          <Header />

          <Routes>
            <Route path='/organiser' exact element={<Home />} />
            <Route path='/organiser/login' element={<Login />} />
            <Route path='/organiser/register' element={<Register />} />
            <Route
              path='/organiser/profile'
              element={data ? <Dashboard data={data} /> : <Login />}
            />
            <Route
              path='/organiser/password-reset'
              element={<PasswordReset data={data} />}
            />
            <Route
              path='/organiserforgotpassword/:id/:token'
              element={<ForgotPassword />}
            />
            <Route path='*' element={<Error />} />
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
