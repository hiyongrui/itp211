var Product = require('../models/sampleProduct');
var Cart = require('../models/cart');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

var fs = require('fs');
var mime = require('mime');
var gravatar = require('gravatar');
var IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
var Images = require('../models/images');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

exports.insert = function (req, res) {
    var src;
    var dest
    var targetPath;
    var targetName;
    var tempPath = req.file.path;
    console.log(req.file);
    var type = mime.lookup(req.file.mimetype);
    var extension = req.file.path.split(/[. ] +/).pop();
    if (IMAGE_TYPES.indexOf(type) == -1) {
        return res.status(415).send('Supported image formats: jpeg, jpg, jpe, png.');

    }
    targetPath = './public/images/' + req.file.originalname;
    src = fs.createReadStream(tempPath);
    dest = fs.createWriteStream(targetPath);
    src.pipe(dest);

src.on('error', function (err) {
    if (err) {
        return res.status(500).send({
            message: error
        });
    }
});

    src.on('end', function () {
        var imageData = {
            productId: req.body.productId,
            productName: req.body.productName,
            sellerName: req.body.sellerName,
            pricing: req.body.pricing,
            imageName: req.file.originalname,
            user_id: req.user.id
        }

        Product.create(imageData).then((newImage, created) => {
            if (!newImage) {
                return res.send(400, {
                    message: "error"

                });
            }
            //res.redirect('images-gallery');
            res.redirect('products')
        })
        fs.unlink(tempPath, function (err) {
            if (err) {
                return res.status(500).send('Something bad happened here');
            }
            //res.redirect('sampleProduct');
        });
    });
};

// exports.insert = function (req, res) {
//     var productData = {
//         productId: req.body.productId,
//         productName: req.body.productName,
//         sellerName: req.body.sellerName,
//         pricing: req.body.pricing,
//     }
//     Product.create(productData).then((newRecord, created) => {
//         if (!newRecord) {
//             return res.send(400, {
//                 message: "error"
//             });
//         }
//         res.redirect('/products');
//     })
// };
exports.list = function (req, res) {
    Product.findAll({
        attributes: ['id', 'productId', 'productName', 'sellerName', 'pricing', 'imageName']
    }).then(function (products) {
        console.log(">>>>>> IMAGE NAME IMAGE NAME" +products.imageName);
        res.render('sampleProduct', {
            title: "Product List",
            itemList: products,
            gravatar: gravatar.url(products.user_id, { s: '80', r: 'x', d: 'retro' }, true),
            hostPath: req.protocol + "://" + req.get("host") + req.url,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
    });
    });
  
};
// exports.list = function (req, res) {
//     Product.findAll({
//         attributes: ['id', 'productId', 'productName', 'sellerName', 'pricing']
//     }).then(function (products) {
//         res.render('sampleProduct', {
//             title: "Product List",
//             itemList: products,
//             hostPath: req.protocol + "://" + req.get("host") + req.url,
//             urlPath: req.protocol + "://" + req.get("host") + req.url
//         });
//     }).catch((err) => {
//         return res.status(400).send({
//             message: err
//         });
//     });
// };

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