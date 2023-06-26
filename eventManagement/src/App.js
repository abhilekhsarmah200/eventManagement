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
import ViewDetailedOrganisers from './components/CustomComponents/ViewDetailedOrganisers';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Booking from './components/CustomComponents/Booking';
import BookingDetails from './components/CustomComponents/Booking/BookingDetails';
import ViewBookingDetails from './components/CustomComponents/Booking/ViewBookingDetails';
import Payment from './components/CustomComponents/Payment/Payment';
import HomeOrganisers from './components/Organisers/components/Users';
import DashboardOrganisers from './components/Organisers/components/Users/Dashboard';
import AddVenuePhotosOrganisers from './components/Organisers/components/Users/AddVenuePhotos';
import ViewVenueImagesOrganisers from './components/Organisers/components/Users/ViewVenueImages';
import ViewArtistsRequests from './components/Organisers/components/CustomComponent/ViewArtistsRequests/ViewArtistsRequests';
import ViewUsers from './components/CustomComponents/ViewUsers';
import AdminProfile from './components/Admin/components/Admin/AdminProfile';
import ViewUsersAdmin from './components/Admin/components/Admin/ViewUsers';
import AdminViewDetailedOrganisers from './components/Admin/components/Admin/ViewDetailedOrganisers';
import ArtistsDashboard from './components/Artists/Dashboard';
import AddWithVenues from './components/Artists/AddWithVenues';

function App() {
  const [data, setData] = useState(false);

  const { logindata, setLoginData } = useContext(LoginContext);

  const history = useNavigate();

  const DashboardValid = async () => {
    let token = localStorage.getItem('usersdatatoken');

    const res = await fetch('/validuser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    const data = await res.json();

    if (data.status == 401 || !data) {
      console.log('user not valid');
      history.push('/login');
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
  console.log({ logindata });

  return (
    <>
      {data ? (
        <>
          <Header logindatas={logindata} />

          <Routes>
            {logindata?.ValidUserOne?.role === 'USER' && (
              <>
                <Route
                  path='/view-users/:id'
                  element={<ViewDetailedOrganisers />}
                />
                <Route path='/bookvenue/:id' element={<Booking />} />
                <Route path='/view_bookings/:id' element={<BookingDetails />} />
                <Route
                  path='/viewBookingDetails/:id'
                  element={<ViewBookingDetails />}
                />
                <Route path='/payment/:id' element={<Payment />} />
              </>
            )}
            {logindata?.ValidUserOne?.role === 'ORGANISER' && (
              <>
                <Route
                  path='/organiser/profile'
                  element={<DashboardOrganisers />}
                />
                <Route
                  path='/organiser/add_venue'
                  element={<AddVenuePhotosOrganisers logindata={logindata} />}
                />
                <Route
                  path='/organiser/view_venuePhotos/:id'
                  element={<ViewVenueImagesOrganisers logindata={logindata} />}
                />
                <Route
                  path='/organiser/artistsRequest/:id'
                  element={<ViewArtistsRequests />}
                />
              </>
            )}
            {logindata?.ValidUserOne?.role === 'ADMIN' && (
              <>
                <Route
                  path='/admin/view-users'
                  element={<ViewUsersAdmin logindata={logindata} />}
                />
                <Route
                  path='/admin/view-bookings'
                  element={<BookingDetails />}
                />
                <Route
                  path='/admin/profile'
                  element={<AdminProfile logindata={logindata} />}
                />
                <Route
                  path='/admin/viewOrganiser/:id'
                  element={<AdminViewDetailedOrganisers />}
                />
              </>
            )}
            {logindata?.ValidUserOne?.role === 'ARTISTS' && (
              <>
                {/* <Route
                  path='/artists/view-users'
                  element={<ViewUsersAdmin logindata={logindata} />}
                /> */}
                <Route
                  path='/artists/join_venue'
                  element={<AddWithVenues logindata={logindata} />}
                />
                <Route
                  path='/artists/profile'
                  element={<ArtistsDashboard logindata={logindata} />}
                />
                <Route
                  path='/artists/viewOrganiser/:id'
                  element={<AdminViewDetailedOrganisers />}
                />
              </>
            )}

            <Route
              path='/'
              exact
              element={
                logindata && (
                  <Home
                    logindata={logindata}
                    logindataRole={logindata?.ValidUserOne?.role}
                  />
                )
              }
            />

            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='*' element={<Error />} />
            <Route path='/profile' element={<Dashboard />} />
            <Route path='/password-reset' element={<PasswordReset />} />
            <Route
              path='/forgotpassword/:id/:token'
              element={<ForgotPassword />}
            />
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
