var Cart = require('../models/cart');
var User = require('../models/users');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

exports.insert = function (req, res) {
    user_id = req.user.id;
    var cartData = {
        productId: req.body.productId,
        productName: req.body.productName,
        sellerName: req.body.sellerName,
        pricing: req.body.pricing,
        user_id: req.user.id,

    }
    Cart.create(cartData).then((newRecord, created) => {
        if (!newRecord) {
            return res.send(400, {
                message: "error"
            });
        }

        sequelize.query("SELECT count(*) itemCount FROM carts WHERE user_id ='" +user_id+"'", { type: sequelize.QueryTypes.SELECT})
        .then(itemsCount => {
            console.log("Number of cart items" +itemsCount[0].itemCount);
            var cartItemCount = {
                cartItemCount: itemsCount[0].itemCount
            }
            User.update(cartItemCount, { where: { id: user_id } }).then((newRecord, created) => {
                if (!newRecord) {
                    return res.send(400, {
                        message: "error"
                    });
                }
            })
            res.redirect('/products');
        
        })
    });
    };

exports.list = function (req, res) {
    Cart.findAll({
        attributes: ['id', 'product_id', 'product_name', 'product_type', 'product_condition', 'product_price', 'product_image', 'seller_name'],
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

exports.updateCartCount = function (req, res) {
    var user_id = req.user.id;
    sequelize.query("SELECT count(*) itemCount FROM carts WHERE user_id ='" +user_id+"'", { type: sequelize.QueryTypes.SELECT})
    .then(itemsCount => {
        console.log("Number of cart items for delete" +itemsCount[0].itemCount);
        var cartItemCount = {
            cartItemCount: itemsCount[0].itemCount
        }
        User.update(cartItemCount, { where: { id: user_id } }).then((newRecord, created) => {
            if (!newRecord) {
                return res.send(400, {
                    message: "error"
                });
            }
            res.redirect('/cart');
        })
    });
}

exports.newCartItem = function(req, res) {
    var product_id = req.params.id;
    var user_id = req.user.id;
    sequelize.query('SELECT * FROM products WHERE id = "' +product_id+ '"', { type: sequelize.QueryTypes.SELECT })
    .then(productData => {
        var cartData = {
            product_id: product_id,
            product_name: productData[0].productListingName,
            product_type: productData[0].productListingType,
            product_condition: productData[0].productListingCondition,
            product_price: productData[0].pricing,
            product_image: productData[0].imageName,
            seller_name: productData[0].user_id,
            user_id: user_id
        }
        Cart.create(cartData).then((newRecord, created) => {
            if (!newRecord) {
                return res.send(400, {
                    message: "error"
                });
            }
            sequelize.query("SELECT count(*) itemCount FROM carts WHERE user_id ='" +user_id+"'", { type: sequelize.QueryTypes.SELECT})
            .then(itemsCount => {
                console.log("Number of cart items" +itemsCount[0].itemCount);
                var cartItemCount = {
                    cartItemCount: itemsCount[0].itemCount
                }
                User.update(cartItemCount, { where: { id: user_id } }).then((newRecord, created) => {
                    if (!newRecord) {
                        return res.send(400, {
                            message: "error"
                        });
                    }
                })
                res.redirect('/products/'+product_id);
            
            });
        });
    });
};

