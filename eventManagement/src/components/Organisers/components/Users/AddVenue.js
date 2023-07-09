import React, { Component } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';

export default class FilesUploadComponent extends Component {
  constructor(props) {
    super(props);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      imgCollection: '',
      organiser_Id: '',
      profileImage: [],
    };
  }

  onFileChange(e) {
    const setProfile = e.target.files;
    const selectedFilesArray = Array.from(setProfile);
    const imageArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    this.setState({ imgCollection: e.target.files });
    this.setState({ profileImage: imageArray });
  }

  onSubmit(e) {
    e.preventDefault();
    var formData = new FormData();
    for (const key of Object.keys(this.state.imgCollection)) {
      formData.append('imgCollection', this.state.imgCollection[key]);
    }
    formData.append('organiser_Id', this.props.id);
    let organiserId = this.props.id;

    axios
      .post('http://localhost:8010/uploadVenueImages', formData, {})
      .then((res) => {
        console.log(res.data);
        if (res.status == 201) {
          toast.success('Photos Added SuccessFully!!', {
            position: 'top-center',
          });
          localStorage.setItem('photoavailable', true);
          localStorage.setItem('view', true);

          setTimeout(function () {
            window.location.href = `/organiser/view_venuePhotos/${organiserId}`; //will redirect to your blog page (an ex: blog.html)
          }, 2000);
        }
      });
    console.log(this.props.id);
  }

  render() {
    return (
      <div className='container flex flex-col items-center justify-center mt-5'>
        <div className='flex justify-center mb-4'>
          {this.state?.profileImage && (
            <div className='flex gap-4 flex-wrap'>
              {this.state?.profileImage?.map((img, index) => {
                return (
                  <div className='relative'>
                    <div>
                      <img src={img} className='w-auto h-40 rounded-md' />
                    </div>
                    <div className='absolute top-0 right-0 z-99'>
                      <div
                        onClick={() =>
                          this.setState({
                            profileImage: this.state.profileImage.filter(
                              (e) => e !== img
                            ),
                          })
                        }
                        className='text-red cursor-pointer'
                      >
                        <DeleteIcon style={{ color: 'red' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
                  Add Vanues Photos
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
