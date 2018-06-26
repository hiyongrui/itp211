
var express = require("express");
var multer = require('multer');
var upload = multer({dest:'./public/uploads/', limits: {fileSize: 1500000, files:1}}); 
var img = express.Router();



var images = require('../server/controllers/images');
// import multer 


// Set up routes for images 
// http://localhost:3000/images-gallery/upload , why upload not working?
img.post('/', images.hasAuthorization, upload.single('image'), images.uploadImage);

// http://localhost:3000/images-gallery/
img.get('/', images.hasAuthorization , images.show );



module.exports = img;