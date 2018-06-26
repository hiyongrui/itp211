// get gravatar icon from email
var gravatar = require('gravatar');
var passport = require('passport');

var Comments = require('../models/comments');

var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

var Users = require('../models/users');
var Songs = require('../models/songs');

exports.list = function(req,res) {
    var user_num = req.user.id;

    Songs.findAll({
        where: {user_id: user_num}
    }).then(songs=> {
        res.render('sendfooter', {
            user: req.user ,songs: songs
        })
    })
}

// Profile GET
exports.profile = function(req, res) {
    //validate(req,res);
    //req.session.isChanged = true;
    var user_num = req.user.id
    // List all Users and sort by Date
   Comments.findAll({
       where: {user_id: user_num}
   }).then( comments=> {
       Songs.findAll({
           where: {user_id: user_num}
       }).then(songs=> {
              res.render('profile',
     { title: 'Profile Page', user : req.user, avatar: gravatar.url(req.user.email ,  {s: '100', r: 'x', d: 'retro'}, true) 
        , comments: comments , songs:songs });
        })
       })
 
    //req.session.save();
};


//view other people profile , not your own one. page is /users
exports.viewprofile = function(req,res) {  
        var user_num = req.params.id; // or var user_num = req.params.id;  or req.params.user;
    console.log("params data >>> " + user_num);
    Comments.findAll({
        where: { user_id: user_num }
    }).then(comments=> {
    Users.findById(user_num).then( usersProfile => {
        res.render('viewprofile', {
            title: "profile page of others ppl",
            usersProfile: usersProfile,
            comments: comments,
            hostpath: req.protocol + "://" + req.get("host")
        })
    })
    }).catch((err) => {
        return res.status(400).send({
            message: err
        })
    })
}

// Logout function
exports.logout = function () {
    req.logout();
    res.redirect('/');
};

// check if user is logged in
exports.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};
