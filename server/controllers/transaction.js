var transaction = require('../models/transaction');
var transactionHistory = require('../models/transactionHistory')
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
        transaction.create(transactionData).then((newRecord, created) => {
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
                res.redirect('/cart');
            })
        })
    }).catch(function(err) {
        console.log(err);
    });

};
