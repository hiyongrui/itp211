//addiotional controller newly created based , not sureif chatmsg need controller, if not how to get the user_id as email??

// get gravatar icon from email
var gravatar = require('gravatar');

//get Comments model
var ChatMsgs = require('../models/chatMsg');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;
// list comments
exports.list = function(req,res) {
    // List all comments and sort by date
    sequelize.query('select ch.id , ch.name , ch.message , u.email AS user_id from ChatMsgs ch join Users u on ch.user_id = u.id'
, { model : ChatMsgs}).then((chatMessages) => {
    
        res.render('chatMsg', {
           
            data: chatMessages,
           // gravatar : gravatar.url(chatMessages.user_id, { s : '80' , r:'x' , d:'retro'},true),
             url: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};




// comments authorization middleware
exports.hasAuthorization = function(req,res,next) {
    if (req.isAuthenticated())
        return next();
    res.redirect("/login");
        
};