// get gravatar icon from email
var gravatar = require('gravatar');
var Users = require('../models/users');
//get Comments model
//get Comments model
var Comments = require('../models/comments');

var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;



// list users
 exports.list = function(req,res) {
    // List all users and sort by date
    sequelize.query('select u.id , u.name , u.email , u.experience , u.userImage , u.level , u.role from Users u', 
    { model : Users}).then((users) => {
    sequelize.query('select c.id , c.title , c.content , c.user_id from Comments c' ,
    {model: Comments}).then((comments) => {
        res.render('users', {
            title: 'users Page',
            users: users,
            comments: comments,
            gravatar : gravatar.url(users.user_id, { s : '80' , r:'x' , d:'retro'},true),
            urlPath : req.protocol + "://" + req.get("host") + req.url
        })
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
  })}; 

  
var experiencelevel = [];
var totalexp = 0;
function getCommentsCount() {
    return Comments.findAndCount({
        where: {user_id:2}
    }).then(numberofcomments=> {
        return numberofcomments.count;
    })
}

/*
getCommentsCount().then(data=> {
    console.log(" GAY IS " + data);
    experiencelevel.push(data);
    totalexp = data * 500;
    Users.findById('2').then(userexp => {
        console.log("WAAAAT" + userexp.experience);
        userexp.experience += totalexp;
        console.log(" FINAL EXP IS : " + userexp.experience);
    })    
    console.log(totalexp + "NILOL");
}) */
/*
var ret = [];

const comments = Comments.findAndCount({
    attributes: ['user_id'],
    where : {user_id: 3},
    raw:true
}).then(comments => {
   ret.push(comments.count);
   console.log("hongkan66"  + ret);
})



Users.findById(3).then(user5s=> {
    return user5s.increment('experience', {by:200*5})
})

/* exports.exp = function(req,res) {
    Comments.findAll({
        attributes: ['id','title','content','user_id'],
        where: {user_id: 2}
    }).then((comments) => {
         Users.findAll({
        attributes: ['id','name','email', 'experience'*'100' ]
    }).then((users) => {
        res.render('users', {
            title: 'users Page',
            users: users,
            comments: comments,
            gravatar : gravatar.url(users.user_id, { s : '80' , r:'x' , d:'retro'},true),
            urlPath : req.protocol + "://" + req.get("host") + req.url
    })
    })
})}
*/

//console.log("NIHAOs " + experiencelevel);


exports.hasAuthorization = function(req,res,next) {
    if (req.isAuthenticated())
        return next();
    res.redirect("/login");
        
};
