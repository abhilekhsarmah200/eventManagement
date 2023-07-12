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
import AdminBookingDetails from './components/Admin/Booking/BookingDetails';
import ViewArtistsList from './components/Admin/components/CustomComponents/ViewArtistsList';
import BookingDetailsOrganiser from './components/Organisers/components/Booking/BookingDetails';
import { Dialog } from 'primereact/dialog';
import ShowArtistsDetails from './components/Organisers/components/CustomComponent/ShowArtistsDetails/ShowArtistsDetails';
import ServiceCheckList from './components/CustomComponents/ServiceCheckList/ServiceCheckList';
import ArtistsList from './components/Artists/ArtistsList/ArtistsList';

function App() {
  const [data, setData] = useState(false);
  const [visible, setVisible] = useState(false);

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
      setVisible(true);
      history.push('/login');
    } else {
      console.log('user verify');
      setLoginData(data);
    }
  };

  const photoavailable = localStorage.getItem('photoavailable');
  useEffect(() => {
    DashboardValid();
    setData(true);
  }, []);
  console.log({ photoavailable });

  return (
    <>
      <div className='backgroundImage'></div>

      {data ? (
        <div>
          <Header logindatas={logindata} />

          <Routes>
            {logindata?.ValidUserOne?.role === 'USER' && (
              <>
                <Route
                  path='/view-users/:id'
                  element={<ViewDetailedOrganisers />}
                />
                <Route path='/bookvenue/:id' element={<Booking />} />
                <Route
                  path='/service-checklist/:id'
                  element={<ServiceCheckList />}
                />
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
                  path='/artists/show-artistsDetails/:id'
                  element={<ShowArtistsDetails logindata={logindata} />}
                />
                <Route
                  path='/organiser/profile'
                  element={<DashboardOrganisers />}
                />
                <Route
                  path={'/organiser/add_venue'}
                  element={
                    photoavailable === 'true' ? (
                      <ViewVenueImagesOrganisers logindata={logindata} />
                    ) : (
                      <AddVenuePhotosOrganisers logindata={logindata} />
                    )
                  }
                />

                <Route
                  path='/organiser/view_venuePhotos/:id'
                  element={<ViewVenueImagesOrganisers logindata={logindata} />}
                />

                <Route
                  path='/organiser/artistsRequest/:id'
                  element={<ViewArtistsRequests logindata={logindata} />}
                />
                <Route
                  path='/organiser/view-bookings'
                  element={<BookingDetailsOrganiser logindata={logindata} />}
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
                  element={<AdminBookingDetails logindata={logindata} />}
                />
                <Route
                  path='/admin/artists_list'
                  element={<ViewArtistsList logindata={logindata} />}
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
                <Route path='/artists/viewArtists' element={<ArtistsList />} />
              </>
            )}

            <Route
              path='/'
              exact
              element={
                logindata ? (
                  <Home
                    logindata={logindata}
                    logindataRole={logindata?.ValidUserOne?.role}
                  />
                ) : (
                  <Login />
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
        </div>
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
      {window.location.pathname === '/login' ||
      window.location.pathname === '/register' ||
      window.location.pathname === '/password-reset' ? null : (
        <div>
          <Dialog
            header='Header'
            showHeader={false}
            visible={visible}
            className='Dialog md:w-[60vw] w-[90vw]'
            onHide={() => setVisible(false)}
            contentClassName='login'
          >
            <div className='flex justify-center pt-5'>
              <a href='/login' className='text-white underline'>
                Please Login Again!!
              </a>
            </div>
          </Dialog>
        </div>
      )}
    </>
  );
}

export default App;
