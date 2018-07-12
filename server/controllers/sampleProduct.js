var Product = require('../models/sampleProduct');
var Cart = require('../models/cart');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

exports.insert = function (req, res) {
    var productData = {
        productId: req.body.productId,
        productName: req.body.productName,
        sellerName: req.body.sellerName,
        pricing: req.body.pricing,
    }
    Product.create(productData).then((newRecord, created) => {
        if (!newRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('/products');
    })
};

exports.list = function (req, res) {
    Product.findAll({
        attributes: ['id', 'productId', 'productName', 'sellerName', 'pricing']
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