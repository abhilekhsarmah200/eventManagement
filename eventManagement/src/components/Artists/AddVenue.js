import React, { Component } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';

export default class FilesUploadComponent extends Component {
  constructor(props) {
    super(props);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      imgCollection: '',
      userId: '',
    };
  }

  onFileChange(e) {
    this.setState({ imgCollection: e.target.files });
  }
  onSubmit(e) {
    e.preventDefault();
    var formData = new FormData();
    for (const key of Object.keys(this.state.imgCollection)) {
      formData.append('imgCollection', this.state.imgCollection[key]);
    }
    formData.append('userId', localStorage.getItem('organiserId'));

    axios
      .post('http://localhost:8080/uploadVenueImages', formData, {})
      .then((res) => {
        console.log(res.data);
        if (res.status == 201) {
          toast.success('Photos Added SuccessFully!!', {
            position: 'top-center',
          });
          setTimeout(function () {
            window.location.href = '/organiser/add_venue'; //will redirect to your blog page (an ex: blog.html)
          }, 2000);
        }
      });
    console.log(this.props.id);
  }

  getEmail(e) {
    e.preventDefault();
    axios.get('http://localhost:8080/organiservalid', {}).then((res) => {
      console.log(res.data);
    });
  }

  render() {
    return (
      <div className='container flex justify-center mt-5'>
        <div className=''>
          <form onSubmit={this.onSubmit}>
            <div className='flex flex-col gap-4'>
              <div>
                <Stack direction='row' alignItems='center' spacing={2}>
                  <Button variant='contained' component='label'>
                    Upload
                    <input
                      type='file'
                      name='imgCollection'
                      onChange={this.onFileChange}
                      multiple
                      hidden
                    />
                  </Button>
                  <IconButton
                    color='primary'
                    aria-label='upload picture'
                    component='label'
                  >
                    <input
                      type='file'
                      name='imgCollection'
                      onChange={this.onFileChange}
                      multiple
                      hidden
                    />
                    <PhotoCamera />
                  </IconButton>
                </Stack>
              </div>

              <div className='form-group'>
                <Button variant='outlined' type='submit'>
                  {' '}
                  Add Venues Photos
                </Button>
              </div>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    );
  }
}
