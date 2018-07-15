var Transaction = require('../models/transaction');
var TransactionHistory = require('../models/transactionHistory')
var Cart = require('../models/cart');
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

        var transactionData = {
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
        attributes: ['id', 'productId', 'productName', 'pricing'],
        where: {
            user_id: req.user.id,
            transactionId: orderNum
        }
    }).then(function (transactionDetails) {
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
