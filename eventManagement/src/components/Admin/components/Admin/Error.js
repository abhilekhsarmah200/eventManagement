import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../ContextProvider/Context';
import { ToastContainer, toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

const AdminError = () => {
  const history = useNavigate();
  const { logindata, setLoginData } = useContext(LoginContext);
  const [data, setData] = useState(false);

  const DashboardValid = async () => {
    let token = localStorage.getItem('admindatatoken');

    const res = await fetch('http://localhost:8010/validadmin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    const data = await res.json();

    if (data.status == 401 || !data) {
      toast.error(`please login first!`, {
        position: 'top-center',
      });
      history('/admin/login');
    } else {
      console.log('user verify');
      setLoginData(data);
      history('*');
    }
  };

  useEffect(() => {
    DashboardValid();
    setData(true);
  }, []);

  return (
    <>
      <div className='container'>
        <div
          style={{
            minHeight: '85vh',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            src='https://media0.giphy.com/media/kfS15Gnvf9UhkwafJn/giphy.gif?cid=6c09b9521fltv8bdxou06hvacgoxsl08cqhwut9oi2koarug&rid=giphy.gif&ct=g'
            alt='error'
            style={{ width: '100px', marginBottom: 20 }}
          />
          {/* <h1 className="mb-3">404 ERROR </h1> */}
          <h2 className='mb-3'>PAGE NOT FOUND</h2>
          <NavLink
            to='/admin/profile'
            className='btn btn-primary'
            style={{ fontSize: 18 }}
          >
            {' '}
            Back To Home Page{' '}
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminError;
