var Transaction = require('../models/transaction');
var TransactionHistory = require('../models/transactionHistory')
var Cart = require('../models/cart');
var User = require('../models/users');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

exports.transaction = function (req, res) { // Checkout button

    // Get last inserted id
    sequelize.query("SELECT max(id) as 'maxId'  FROM transactions", { type: sequelize.QueryTypes.SELECT})
    .then(currentId => {
        console.log(currentId[0].maxId);
        currId = currentId[0].maxId;
        // Create new transaction id
        currId = currId + 1;
        var dateToday = new Date()
        var purchaseDate = dateToday.getFullYear()+'/'+(dateToday.getMonth()+1)+'/'+dateToday.getDate();

        var transactionData = {
            order_date: purchaseDate,
            cartPricing : req.body.cartPricing,
            transactionId : currId,
            user_id: req.user.id
        }
        // Create new transaction
        Transaction.create(transactionData).then((newRecord, created) => {
            if (!newRecord) {
                return res.send(400, {
                    message: "error"
                });
            }
            console.log("new record pricing new record pricing" +newRecord.id);
            
            var appendId = {
                transactionId : currId
            }
            // Give items to be purchased a transaction id
            Cart.update(appendId, { where: { transactionId : null } }).then((updatedRecord) => {
                if (!updatedRecord) {
                    return res.send(400, {
                        message: "error"
                    });
                }
                console.log(">>>>>>>>>>"+updatedRecord.transactionId);
                // Insert cart items into purchase history
                sequelize.query("INSERT INTO transactionhistories select * from Carts");
            

                res.redirect('/transactions');
                exports.deleteCart();
                });
            });
        
    
    }).catch(function(err) {
        console.log(err);
    });

    
};
exports.deleteCart = function(req, res,) {
    console.log("user id gbefore deleting card " + req.user.id);
    Cart.destroy({where: { user_id: req.user.id} }).then((deletedRecord) => {
        if (!deletedRecord) {
            return res.send(400, {
                message: "error"
            });    
    }
    res.status(200).send({ message: "Deleted student record: "});

})
};

exports.listOrders = function (req, res) {
    Transaction.findAll({
        attributes: ['id', 'transactionId', 'cartPricing'],
        where: {
            user_id: req.user.id
        }
    }).then(function (transactionNum) {
        res.render('orderHistory', {
            title: "Order History",
            transactionNum: transactionNum,
            hostPath: req.protocol + "://" + req.get("host") + req.url,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
        
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
    
};

exports.listOrderDetails = function (req, res) {
    var orderNum = req.params.transactionId;
    console.log("rodernumodrudernumordeenumordernumodernum"+orderNum);
    TransactionHistory.findAll({
        attributes: ['id', 'product_id', 'product_name', 'product_type', 'product_condition', 'product_price', 'product_image', 'seller_name', 'transactionId', 'product_status'],
        where: {
            user_id: req.user.id,
            transactionId: orderNum
        }
    }).then(function (transactionDetails) {
        console.log("trans detail " + JSON.stringify(transactionDetails));
        res.render('orderDetails', {
            title: "Order Details",
            transactionDetails: transactionDetails,
            hostPath: req.protocol + "://" + req.get("host") + req.url,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });

}

exports.updateCartCount = function (req, res) {
    var user_id = req.user.id;
    var toZero = {
        cartItemCount: req.body.newCartCount
    }
        User.update(toZero, { where: { id: req.user.id } }).then((newRecord, created) => {
            if (!newRecord) {
                return res.send(400, {
                    message: "error"
                });
            }
            res.redirect('/payment');
        })
};

exports.deductAmt = function(req, res) {
    var user_id = req.user.id;
    var total_price = req.body.cartPricing;
    sequelize.query('SELECT coin FROM users WHERE id="'+req.user.id+'"', { type: sequelize.QueryTypes.SELECT })
    .then(userBalance => {
        var currBalance = userBalance[0].coin;
        if (currBalance > total_price) {
            currBalance = currBalance;
            currBalance = parseInt(currBalance);
            newUserBalance = currBalance - total_price;
            newUserBalance = parseInt(newUserBalance);
            console.log("user balance new: " +newUserBalance);
            var paymentData = {
                coin: newUserBalance
            }
            User.update(paymentData, { where: { id: user_id } }).then((updatedRecord) => {
                if (!updatedRecord) {
                    return res.send(400, {
                        message: "error"
                    });
                }
                res.redirect('/payment');
            });
        }
    });
};

exports.sendPayment = function (req, res) {
    var transaction_id = req.params.id;
    var seller_id = req.body.seller_id;
    var product_price = req.body.product_price;
    var row_id = req.body.row_id;
    var setStatus = {
        product_status: true
    }
    TransactionHistory.update(setStatus, { where: { id: row_id } }).then((updatedRecord) => {
        if (!updatedRecord) {
            return res.send(400, {
                message: "error"
            });
        }
    });
    sequelize.query('SELECT coin FROM users WHERE id = "'+seller_id+'"', {type: sequelize.QueryTypes.SELECT})
    .then(data => {
        currBalance = data[0].coin;
        newBalance = currBalance + product_price;
        var newBalance = {
            coin: newBalance
        }
        User.update(newBalance, { where: { id: seller_id } }).then((updatedRecord) => {
            if (!updatedRecord) {
                return res.send(400, {
                    message: "error"
                });
            }
            res.redirect('/transactions/'+transaction_id);
        })
    })
}

