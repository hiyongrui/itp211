var cardDetails = require('../models/cardDetails');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

exports.insertCard = function (req, res) {
    var cardData = {
        cardNumber: req.body.cardNumber,
        cardholder: req.body.cardholder,
        CVV: req.body.cvv,
        expiryDate: req.body.expiryDate,
        balance: 0,
        user_id: req.user.id
    }
    cardDetails.create(cardData).then((newRecord, created) => {
        if (!newRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('/insertCard');
    })
};

exports.list = function(req, res) {
    res.render('cardDetails', {
        title: "Insert Card",
        hostPath: req.protocol + "://" + req.get("host") + req.url,
        urlPath: req.protocol + "://" + req.get("host") + req.url
    });
}

exports.listCards = function(req, res) {
    cardDetails.findAll({
        attributes: ['cardNumber', 'cardholder', 'CVV', 'balance'],
        where: {
            user_id: req.user.id
        }
    }).then(function (listCard) {
        res.render('listCards', {
            title: "Cart List",
            cardList: listCard,
            hostPath: req.protocol + "://" + req.get("host") + req.url,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        })
    });
};

exports.addBalance = function(req,res) {
    var card_num = req.body.cardNumber;
    var balance  = req.body.balance;
    sequelize.query("SELECT balance FROM carddetails WHERE cardNumber ='" +card_num+"'", { type: sequelize.QueryTypes.SELECT})
    .then(userBal => {
        console.log(userBal);
        console.log(card_num);
        console.log(balance);
        userBalance = userBal[0].balance;
        intUserBalance = parseInt(userBalance);
        intBalance = parseInt(balance);
        intUserBalance = intUserBalance + intBalance;
        userBalance = intUserBalance.toString();
        var cardBalance = {
            balance: userBalance
        }
        cardDetails.update(cardBalance, { where: { cardNumber : card_num } }).then((updatedBal) => {
            if (!updatedBal) {
                return res.send(400, {
                    message: "error"
                });
            }
            res.redirect('/cardInfo');
        })
})
}