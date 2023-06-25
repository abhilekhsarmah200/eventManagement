import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../../ContextProvider/Context';
import { toast } from 'react-toastify';
import { Box, Button, CircularProgress } from '@mui/material';
import { RadioButton } from 'primereact/radiobutton';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import successfullPayment from '../../../assets/img/Payment+successful.png';

export default function Payment() {
  const { id } = useParams();
  const { logindata, setLoginData } = useContext(LoginContext);
  const [userData, setUserData] = useState([]);
  const [payment, setPayment] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [ingredient, setIngredient] = useState('20%');
  const [visible, setVisible] = useState(false);

  const history = useNavigate();

  let percentage = parseInt(ingredient);
  const payableAmount = (bookings?.totalPrice * percentage) / 100;
  const TotalPrice = bookings?.totalPrice;
  const totalBalance = TotalPrice - payableAmount;

  const DashboardValid = async () => {
    let token = localStorage.getItem('usersdatatoken');

    const res = await fetch('http://localhost:8010/validuser', {
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
      history('/login');
    } else {
      console.log('user verify');
      setLoginData(data);
      history(`/payment/${id}`);
    }
  };

  const payments = async (e) => {
    e.preventDefault();

    let token = localStorage.getItem('usersdatatoken');

    const formdata = new FormData();

    formdata.append('payAmount', payableAmount);
    formdata.append('bookingId', id);
    formdata.append('percentage', percentage);

    let res = await axios.post('http://localhost:8010/payment', formdata, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (res?.status === 422) {
      toast.error('Payment not successfully Done!!', {
        position: 'top-center',
      });
    } else if (res.status >= 200 && res.status <= 300) {
      toast.success('Paid Successfully 😃!', {
        position: 'top-center',
      });

      setTimeout(function () {
        setPayment(true);
      }, 2000);
      const response = await fetch(
        `http://localhost:8010/CalculateTotalBalanceByBookingId/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            balance: totalBalance,
            paymentStatus: 'confirmed',
          }),
        }
      );

      const data = await response.json();
      setTimeout(function () {
        history(`/viewBookingDetails/${id}`);
      }, 5000);
    }
  };

  const getBookingById = async () => {
    try {
      const res = await fetch(`http://localhost:8010/getBookingDetails/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setBookings(data);
      console.log({ data });
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    DashboardValid();
    getBookingById();
  }, []);

  const [val, setVal] = useState('');

  const onChange = (e) => {
    setVal(e.target.value);
  };

  const cc_format = (value) => {
    const v = value
      .replace(/\s+/g, '')
      .replace(/[^0-9]/gi, '')
      .substr(0, 16);
    const parts = [];

    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substr(i, 4));
    }

    return parts.length > 1 ? parts.join(' ') : value;
  };

  console.log({ percentage });

  return (
    <div className='lg:px-40 py-10 px-20 w-[80%] mx-auto flex flex-col gap-4 justify-center'>
      <div>How much are You want to pay?</div>
      <div className='card flex justify-center'>
        <div className='flex flex-wrap gap-3'>
          <div className='flex align-items-center'>
            <RadioButton
              inputId='ingredient1'
              name='percentage'
              value='20%'
              onChange={(e) => setIngredient(e.value)}
              checked={ingredient === '20%'}
            />
            <label htmlFor='ingredient1' className='ml-2'>
              20%
            </label>
          </div>
          <div className='flex align-items-center'>
            <RadioButton
              inputId='ingredient2'
              name='percentage'
              value='50%'
              onChange={(e) => setIngredient(e.value)}
              checked={ingredient === '50%'}
            />
            <label htmlFor='ingredient2' className='ml-2'>
              50%
            </label>
          </div>
          <div className='flex align-items-center'>
            <RadioButton
              inputId='ingredient3'
              name='percentage'
              value='80%'
              onChange={(e) => setIngredient(e.value)}
              checked={ingredient === '80%'}
            />
            <label htmlFor='ingredient3' className='ml-2'>
              80%
            </label>
          </div>
          <div className='flex align-items-center'>
            <RadioButton
              inputId='ingredient4'
              name='percentage'
              value='100%'
              onChange={(e) => setIngredient(e.value)}
              checked={ingredient === '100%'}
            />
            <label htmlFor='ingredient4' className='ml-2'>
              Full
            </label>
          </div>
        </div>
      </div>
      <div className=''>
        <div className='flex justify-between'>
          <div>Total : </div>
          <div>{TotalPrice}/-</div>
        </div>
        <div className='flex justify-between'>
          <div>You want to Pay ({ingredient}) :</div>{' '}
          <div>{payableAmount ? payableAmount : 0}/-</div>
        </div>
      </div>
      <form>
        <div className='w-80 mx-auto'>
          {ingredient === '100%' ? (
            <Button onClick={() => setVisible(true)} variant='outlined'>
              Pay Full Amount
            </Button>
          ) : (
            <Button onClick={() => setVisible(true)} variant='outlined'>
              Pay {payableAmount ? payableAmount : 0}/-
            </Button>
          )}
        </div>
      </form>
      <Dialog
        header='Please Pay Your advance'
        headerStyle={{ textAlign: 'center' }}
        closable={false}
        draggable={false}
        visible={visible}
        style={{ width: '60vw', height: '90vh' }}
        onHide={() => setVisible(false)}
      >
        {payment === true ? (
          <div className='relative h-[80vh]'>
            <div>
              <img src={successfullPayment} className='w-[60vw]' />
            </div>
            <div className='absolute bottom-0 right-0'>
              <div className='flex items-center gap-2'>
                <div>Please wait we redirecting you to Your booking...</div>
                <div>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-4 items-center justify-center'>
            <div className='flex flex-col w-[70%]'>
              <label className='form_input'>Card Number:</label>
              <InputText
                type='text'
                value={cc_format(val)}
                placeholder='_ _ _ _  _ _ _ _  _ _ _ _  _ _ _ _ '
                maxLength={19}
                onChange={onChange}
              />
            </div>
            <div className='flex w-[70%] gap-4'>
              <div className='flex flex-col w-full'>
                <label className='form_input'>Expiry Date:</label>
                <InputText type='text' placeholder='_ _ /_ _ ' maxLength={5} />
              </div>
              <div className='flex flex-col w-full'>
                <label className='form_input'>CVV:</label>
                <InputText type='text' placeholder='_ _ _' maxLength={3} />
              </div>
            </div>
            <Button onClick={payments} variant='outlined'>
              <a>Pay Now</a>
            </Button>
          </div>
        )}
      </Dialog>
    </div>
  );
}
