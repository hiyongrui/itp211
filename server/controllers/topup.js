var TopUp = require('../models/wallet');
var User = require('../models/users');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

exports.list = function(req, res) {
    User.findAll({
        attributes: ['coin'],
        where: {
            id: req.user.id
        }
    }).then(function (balance) {
        res.render('wallet', {
            title: "Your Wallet",
            data: balance,
            hostPath: req.protocol + "://" + req.get("host") + req.url,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });

    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

exports.coinPaymentList = function(req, res) {
    res.render('topUpPayment', {
        title: "Top Up Payment",
        hostPath: req.protocol + "://" + req.get("host") + req.url,
        urlPath: req.protocol + "://" + req.get("host") + req.url
    });
};

exports.payment = function(req, res) {
    var user_id = req.user.id;
    sequelize.query("SELECT coin FROM users WHERE id ='" +user_id+"'", { type: sequelize.QueryTypes.SELECT})
    .then(userBal => {
        currentBalance = userBal[0].coin;
        console.log("Current Balance: " +currentBalance);
        var value = req.body.value;
        value = parseInt(value);
        currentBalance = currentBalance + value;
        console.log("New Balance: " +currentBalance);
        var newBalance = {
            coin: currentBalance
        }
        User.update(newBalance, { where: { id: user_id } }).then((updatedRecord) => {
            if (!updatedRecord) {
                return res.send(400, {
                    message: "error"
                });
            }
            var today = new Date();
            var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
            console.log(date);
            var topUpData = {
                topupDate: date,
                coinAmt: req.body.value,
                price: req.body.value,
                user_id: user_id
            }
            TopUp.create(topUpData).then((newRecord, created) => {
                if (!newRecord) {
                    return res.send(400, {
                        message: "error"
                    });
                }
                res.redirect('/wallet')
            });
        });
    });
};

/*
exports.topUp = function(req, res) {
    var user_id = req.user.id;
    var topUpData = {
        coinAmt: req.body.coinAmt,
        price: req.body.price,
        user_id: req.user.id
    }
    TopUp.create(topUpData).then((newRecord, created) => {
        if (!newRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('/topup')
    })
};
*/

exports.topupHistory = function(req, res) {
    var user_id = req.user.id;
    sequelize.query("SELECT topupDate, coinAmt, price FROM wallets WHERE user_id ='" +user_id+"'", { type: sequelize.QueryTypes.SELECT})
    .then(data => {
        console.log("Data of top up history" +data)
        console.log("Data of top up coin amt" +Object.keys(data).length); 
        res.send(data);
    });
};