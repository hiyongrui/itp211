var StudentModel = require("../models/studentModel")
var Product = require('../models/sampleProduct');
var Cart = require('../models/cart');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

var fs = require('fs');
var mime = require('mime');
var gravatar = require('gravatar');

// set image file types
var IMAGE_TYPES = ['image/jpeg' , 'image/jpg' , 'image/png'];

var Images = require('../models/images');

var Songs = require('../models/songs');

/* 
Images.findAll({
    attributes: ['id','title','content','user_id'],
    include: { model : Comments}
}).then(function(images,comments) {
    res.render('images-gallery', {
        title:'Comments Page',
        images: images,
        comments: comments
    });

})  */



// Image upload
exports.insert = function (req, res) {
    var src;    
    var dest;
    var targetPath;
    var targetName;
    var tempPath = req.file.path;
    console.log("SMLJ IS REQ FILE " + req.file);

    //get mime type of file
    var type = mime.lookup(req.file.mimetype);

    //get file extension
    var extension = req.file.path.split(/[. ]+/).pop();

    // check support file types
    if (IMAGE_TYPES.indexOf(type) == -1) {
        return res.status(415).send('Supported image formats: jpeg, jpg, jpe, png');
    }

    // set new path to images
    targetPath = './public/images/' + req.file.originalname;

    // using read stream API to read file;
    src = fs.createReadStream(tempPath);

    // using write stream API to write file
    dest = fs.createWriteStream(targetPath);
    src.pipe(dest);   //copy data from tempPath to targetPath aka ./public/images/ + name of file

    // Show error  , #listen for error event
    src.on('error', function (err) {
        if (err) {
            return res.status(500).send({
                message: error
            });     
        }
    });

    // save file process   , #listen for stream completion event
    src.on('end',function () {
        //create a new instance of the Images model with request body   
        var productData = {
            productId: req.body.productId,
            productName: req.body.productName,
            sellerName: req.body.sellerName,
            pricing: req.body.pricing,
            imageName: req.body.imageName,
            title: req.body.title,
            imageName: req.file.originalname,
            user_id: req.user.id
        }             
        //save to database
        Product.create(productData).then((newRecord, created) => {
            if (!newRecord) {
                return res.send(400, {
                    message: "error"
                });
            }
            res.redirect('/products');
        })
        // remove from temp folder
        fs.unlink(tempPath, function (err) {
            if (err) {
                return res.status(500).send('Something bad happened here');
            }
            // Redirect to gallery's page
            //res.redirect('images-gallery');
        });
    });
};

// Images authorisation middleware
exports.hasAuthorization = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

exports.list = function (req, res) {
    Product.findAll({
        attributes: ['id', 'productId', 'productName', 'sellerName', 'pricing', 'imageName']
    }).then(function (products) {
        res.render('sampleProduct', {
            title: "Product List",
            itemList: products,
            hostPath: req.protocol + "://" + req.get("host") + req.url,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

exports.delete = function (req, res) {
    var record_num = req.params.id;
    console.log("deleting " + record_num);
    Product.destroy({ where: { productId: record_num } }).then((deletedRecord) => {
        Cart.destroy({ where: { productId: record_num } }).then((deletedCart) => {
        if (!deletedRecord && !deletedCart) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Deleted student record:" + record_num });
    });
});
};