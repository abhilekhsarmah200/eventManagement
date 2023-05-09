import React from 'react';
import { NavLink } from 'react-router-dom';

const Error = () => {
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
          <NavLink to='/' className='btn btn-primary' style={{ fontSize: 18 }}>
            {' '}
            Back To Home Page{' '}
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Error;
