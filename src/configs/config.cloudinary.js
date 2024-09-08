const cloudinary = require('cloudinary').v2;
const {cloudinaryConfig: {cloud_name, api_key, api_secret}} = require('./config')

// return https url setting secure: true
cloudinary.config({
    cloud_name: cloud_name ||'penguincdn',
    // secure: true,
    api_key: api_key,
    api_secret: api_secret
})

// log the configuration
// console.log(cloudinary.config())
module.exports = cloudinary
