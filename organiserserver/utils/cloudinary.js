const cloudinary = require('cloudinary').v2;
// Configuration
cloudinary.config({
  cloud_name: 'df93yquxh',
  api_key: '511875883177546',
  api_secret: 'GMN1oEUdZMsCr5aApFtzgdIZRO4',
});

// Upload

const res = cloudinary.uploader.upload(
  'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg',
  { public_id: 'olympic_flag' }
);

res
  .then((data) => {
    console.log(data);
    console.log(data.secure_url);
  })
  .catch((err) => {
    console.log(err);
  });

// Generate
const url = cloudinary.url('olympic_flag', {
  width: 100,
  height: 150,
  Crop: 'fill',
});

// The output url
console.log(url);

module.exports = cloudinary;
