import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { LoginContext } from '../ContextProvider/Context';
import DataTable from '../DataTable/DataTable';
import { Box, CircularProgress } from '@mui/material';
import SearchBox from '../CustomComponents/SearchBox/SearchBox';
import { useRef } from 'react';
import searchOrganisersDetails from '../../utils/searchOrganisersDetails.func';
import axios from 'axios';
import { Carousel } from 'primereact/carousel';
import { Button } from '@mui/material';
import { ReadMoreMore, AdvReadMoreMore } from 'read-more-more';

export default function RelatedVenues({ datas, city }) {
  const initialSearchProps = [{ label: 'City', name: 'city' }];
  const oldProducts = useRef([]);
  const [searchKey, setSearchKey] = useState('');
  const [search, setSearch] = useState(false);
  const [searchProps, setSearchProps] = useState();
  const [products, setProducts] = useState([]);
  const [copyOfUsers, setCopyOfUsers] = useState([]);
  const { logindata, setLoginData } = useContext(LoginContext);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const history = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const UsersList = async () => {
    let temp = [...products];
    const res = await axios('http://localhost:8010/getallorganisers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({ products }),
    })
      .then((res) => {
        temp = res.data;
        console.log({ temp });

        setProducts(temp.slice(0, 10));
        setCopyOfUsers(temp);
        setLoading(true);
        oldProducts.current = temp;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const responsiveOptions = [
    {
      breakpoint: '1199px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  useEffect(() => {
    if (searchKey === '') {
      setProducts(copyOfUsers);
    } else if (searchKey !== '') {
      let _searchProps = [];
      if (searchProps?.length > 0) {
        _searchProps = searchProps;
      } else {
        _searchProps = initialSearchProps;
      }
      _searchProps = 'city';
      let result = searchOrganisersDetails(
        copyOfUsers,
        _searchProps,
        searchKey
      );
      setProducts(result);
      // console.log({ search, searchKey, result });
    }
  }, [search, searchProps]);
  const ids = products?.map((element, index) => element?._id);

  //   console.log({ randomProducts });

  const productTemplate = (product) => {
    console.log({ product });
    return (
      <div className='h-full'>
        <div className='border-1 bg-gray-300 shadow-md surface-border rounded-lg border-round m-2 text-center py-5 px-3'>
          <div className='mb-3'>
            <a href={`/bookvenue/${product._id}`}>
              <img
                src={`${path}${product?.photo}`}
                className='h-60 mx-auto rounded-lg shadow-2'
              />
            </a>
          </div>
        </div>
        <div className='bg-white h-full m-2 shadow-md surface-border rounded-lg border-round text-left py-5 px-3'>
          <div className='text-14 font-bold uppercase'>
            {product?.venueName}
          </div>
          <div className='text-10 ml-4'>
            {product?.area}, {product?.city}({product?.state})
          </div>
          <div className='text-10'>
            {product?.details?.map((item, index) => (
              <div key={index}>
                <ReadMoreMore
                  linesToShow={1}
                  transDuration={1}
                  btnStyles={{ float: 'right', color: '#5ABC49' }}
                  checkFor={
                    product?.values?.values?.type == 'document' ? 10 : 10
                  }
                  readMoreText='...Read more'
                  readLessText='...Read less'
                  text={item?.textValue}
                ></ReadMoreMore>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  console.log({ products });

  useEffect(() => {
    UsersList();
  }, []);
  const path = 'http://localhost:8080/public/images/';
  return (
    <>
      <div
        className='mx-10 mt-8 md:text-12 text-10'
        style={{ color: '#482967', fontWeight: 'bolder' }}
      >
        Related Venues:
      </div>
      <div className='flex justify-center align-center py-3'>
        <div className='Montserrat_font w-full md:w-3/6 lg:1/4 xl:1/5 px-2 py-1 flex flex-row justify-end content-center items-center'>
          <SearchBox
            onSearch={() => {
              setSearch(!search);
            }}
            onChange={(e) => {
              setSearchKey(e.target.value);
            }}
            initialSearchProps={initialSearchProps}
            searchProps={searchProps}
            setSearchProps={setSearchProps}
            placeholder='Search Venue By City'
          ></SearchBox>
        </div>
      </div>
      <div className='p-5 flex justify-center flex-col'>
        <div>
          {logindata ? (
            <div className='card'>
              <Carousel
                value={products}
                numVisible={3}
                numScroll={3}
                responsiveOptions={responsiveOptions}
                itemTemplate={productTemplate}
              />
            </div>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              Loading... &nbsp;
              <CircularProgress />
            </Box>
          )}
        </div>

        <ToastContainer autoClose={2000} />
      </div>
    </>
  );
}
