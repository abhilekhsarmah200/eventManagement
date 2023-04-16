import CircularProgress from '@mui/material/CircularProgress';
import AdminProfile from './components/Admin/AdminProfile';
import Admin from './components/Admin';
import AdminLogin from './components/Admin/Login';
import Box from '@mui/material/Box';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import { LoginContext } from './components/ContextProvider/Context';
import 'react-toastify/dist/ReactToastify.css';
import AdminRegister from './components/Admin/Register';
import AdminHeader from './components/Admin/Header';
import AdminError from './components/Admin/Error';

function App() {
  const [data, setData] = useState(false);

  // const { logindata, setLoginData } = useContext(LoginContext);
  const { loginAdmindata, setLoginAdminData } = useContext(LoginContext);

  const history = useNavigate();

  console.log({ loginAdmindata });

  const DashboardAdminValid = async () => {
    let token = localStorage.getItem('admindatatoken');

    const res2 = await fetch('/validadmin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    console.log({ data });

    const data2 = await res2.json();

    if (data2.status == 401 || !data) {
      console.log('admin not valid');
    } else {
      console.log('admin verify');
      setLoginAdminData(data);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      // DashboardValid();
      DashboardAdminValid();
      setData(true);
    }, 2000);
  }, []);

  return (
    <>
      {data ? (
        <>
          <AdminHeader />
          <>
            <Routes>
              <Route
                path='/admin/dashboard'
                element={data ? <Admin /> : <AdminLogin />}
              />
              <Route path='/admin/profile' element={<AdminProfile />} />
              <Route path='/admin/register' element={<AdminRegister />} />
              <Route path='/admin/login' element={<AdminLogin />} />
              <Route path='*' element={<AdminError />} />
            </Routes>
          </>
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
