var Cart = require('../models/cart');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

exports.insert = function (req, res) {
    var cartData = {
        productId: req.body.productId,
        productName: req.body.productName,
        sellerName: req.body.sellerName,
        pricing: req.body.pricing,
        user_id: req.user.id
    }
    Cart.create(cartData).then((newRecord, created) => {
        if (!newRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('/products');
    })
};

exports.list = function (req, res) {
    Cart.findAll({
        attributes: ['id', 'productId', 'productName', 'sellerName', 'pricing'],
        where: {
            user_id: req.user.id
        }
    }).then(function (cartItems) {
        
        res.render('cart', {
            title: "Cart List",
            cartItemList: cartItems,
            hostPath: req.protocol + "://" + req.get("host") + req.url,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

exports.cartDelete = function (req, res) {
    var record_num = req.params.id;
    console.log("deleting " + record_num);
    Cart.destroy({ where: { id: record_num } }).then((deletedRecord) => {
        if (!deletedRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Deleted student record:" + record_num });
    });
}