import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { LoginContext } from '../ContextProvider/Context';
import DataTable from '../DataTable/DataTable';
import { Box, CircularProgress } from '@mui/material';
import SearchBox from './SearchBox/SearchBox';
import { useRef } from 'react';
import searchOrganisersDetails from '../../utils/searchOrganisersDetails.func';
import axios from 'axios';

export default function ViewUsers({ datas }) {
  const initialSearchProps = [
    { label: 'Area', name: 'area' },
    { label: 'Venue Name', name: 'venueName' },
    { label: 'Manager Name', name: 'fname' },
    { label: 'Venue Category', name: 'venueCategory' },
    { label: 'City', name: 'city' },
    { label: 'State', name: 'state' },
  ];
  const oldProducts = useRef([]);
  const [searchKey, setSearchKey] = useState('');
  const [search, setSearch] = useState(false);
  const [searchProps, setSearchProps] = useState();
  const [users, setUsers] = useState([]);
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
    let temp = [...users];
    const res = await axios('http://localhost:8010/getallorganisers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({ users }),
    })
      .then((res) => {
        temp = res.data;
        console.log({ temp });

        setUsers(temp);
        setCopyOfUsers(temp);
        setLoading(true);
        oldProducts.current = temp;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (searchKey === '') {
      setUsers(copyOfUsers);
    } else if (searchKey !== '') {
      let _searchProps = [];
      if (searchProps?.length > 0) {
        _searchProps = searchProps;
      } else {
        _searchProps = initialSearchProps;
      }
      _searchProps = _searchProps.map((item) => item.name);
      let result = searchOrganisersDetails(
        copyOfUsers,
        _searchProps,
        searchKey
      );
      setUsers(result);
      // console.log({ search, searchKey, result });
    }
  }, [search, searchProps]);
  const ids = users?.map((element, index) => element?._id);

  console.log({ users });

  useEffect(() => {
    UsersList();
  }, []);
  const path = 'http://localhost:8010/public/images/';
  return (
    <>
      <div className='flex justify-center align-center py-8'>
        <div className='Montserrat_font w-full md:w-3/6 lg:1/4 xl:1/5 px-2 py-1 flex flex-row justify-end content-center items-center'>
          <SearchBox
            onSearch={() => {
              setSearch(!search);
            }}
            onChange={(e) => {
              setSearchKey(e.target.value);
            }}
            search={true}
            initialSearchProps={initialSearchProps}
            searchProps={searchProps}
            setSearchProps={setSearchProps}
            placeholder='Search by Venue Name and Address'
          ></SearchBox>
        </div>
      </div>
      <div className='p-5 flex justify-center flex-col'>
        <div>
          {logindata ? (
            <div className='py-1'>
              <DataTable
                searchKey={searchKey}
                search={search}
                users={users}
                path={path}
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
