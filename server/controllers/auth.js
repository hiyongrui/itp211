
var Comments = require('../models/comments');

var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

var Users = require('../models/users');
var Songs = require('../models/songs');

var Products = require("../models/sampleProduct");

// Signin GET
exports.signin = function(req, res) {
    // List all Users and sort by Date
    res.render('login', { title: 'Login Page', message: req.flash('loginMessage') });
};
// Signup GET
exports.signup = function(req, res) {
    // List all Users and sort by Date
    res.render('signup', { title: 'Signup Page', message: req.flash('signupMessage') });

};

/*
var userExperience = 2000;
 function validate(req,res) {
Users.findById(2).then((users) => {
    if (users.experience > userExperience) {
        //users.experience = users.experience - 123;
        users.experience = users.experience - userExperience;
        users.level += 1;
        console.log(" WILLTHISWORK " + users.experience);
        users.save();
    }
})
} */

/*
Users.findById(2).then(user => {
    user.status ="online";
    user.save();
}) */

// Profile GET
exports.profile = function(req, res) {
    //validate(req,res);
    //req.session.isChanged = true;
    var user_num = req.user.id
    // List all Users and sort by Date
  
    Songs.findAll({ where: {user_id: user_num} }).then(songs=> {
        Products.findAll({ where: {user_id: user_num} }).then(products => {
            console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG!!!!");
            console.log(req.user);
            console.log(JSON.stringify(songs,null,2));
            console.log(JSON.stringify(products));
            res.render('profile', {
                title: 'Profile Page', 
                user : req.user, 
                songs:songs,
                products: products
            });
        });
    })   
    //req.session.save();
};


//view other people profile , not your own one. page is /users
exports.viewprofile = function(req,res) {  
        var user_num = req.params.name; // or var user_num = req.params.id;  or req.params.user;
    console.log("params data >>> " + user_num); // or use findone to return an object , then dont need use usersProfile[0];
    Users.findOne( { where: {name: user_num} } ).then( usersProfile => { //findAll,where clause return one row only thats why must usersProfile[0]
        sequelize.query("select * from Products where user_id = :productsOfThisUser", 
        {replacements: {productsOfThisUser: usersProfile.id}, type: sequelize.QueryTypes.SELECT }).then(usersProducts => {
        console.log("users profile > > " + JSON.stringify(usersProfile));
        console.log("products of this user >>> \n " + JSON.stringify(usersProducts));
        res.render('viewprofile', {
            title: "profile page of others ppl",
            usersProfile: usersProfile, //put usersProfile[0] if use findAll , then ejs dont need use [0] also.. and online timing will work.
            hostpath: req.protocol + "://" + req.get("host"),
            usersProducts: usersProducts
        })
    });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        })
    })
}


exports.profileSettings = function(req,res) {  /* kamali profile settings */
    var user_num = req.user.id;
    res.render('profileSetting', {
        title: "Profile settings!!",
        user:req.user
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
