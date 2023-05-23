import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Avatar, Box, Button, CircularProgress } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { toast } from 'react-toastify';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate, NavLink } from 'react-router-dom';
import ViewDetailedOrganisers from '../Admin/ViewDetailedOrganisers';
import CustomizedDialogs from '../DialogBox/DialogBox.tsx';

export default function SmallDevicesTable() {
  const history = useNavigate();

  const [loading, setLoading] = useState(false);
  const [organisersData, setOrganisersData] = useState('');

  const handleDelete = async (id) => {
    let token = localStorage.getItem('admindatatoken');

    let res = [];
    try {
      setLoading(true);
      const text = 'Are you want to delete?';

      if (window.confirm(text) == true) {
        res = await fetch(`http://localhost:8080/deleteorganiser/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        toast.success('User deleted successfully');
        setTimeout(function () {
          window.location = '/admin/view-users';
        }, 2000);
      } else {
        toast.error('User not deleted');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getUserById = async (id) => {
    history(`/admin/view-users/${id}`);
  };

  console.log({ organisersData });
  const [inpval, setInpval] = useState({
    validUser: false,
  });

  const setVal = (e) => {
    setInpval({ ...inpval, [e.target.name]: e.target.value });
  };
  const handleVerified = async (id) => {
    const res = await fetch(`http://localhost:8080/updateorganiser/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        validUser: true,
      }),
    });

    const data = await res.json();
    if (res.status === 200) {
      toast.success(`Organiser Verified Successfully`, {
        position: 'top-center',
      });
      setTimeout(function () {
        window.location = `/admin/view-users`;
      }, 2000);
    }
  };

  return <div>SmallDevicesTable</div>;
}
