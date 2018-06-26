// get gravatar icon from email
var gravatar = require('gravatar');

//get Comments model
var Comments = require('../models/comments');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;
var Images = require('../models/images');

var Users = require('../models/users');
//var sequelizeInstance = myDatabase.sequelizeInstance;

// Read fromdatabase
/*sequelizeInstance.query('SELECT * FROM COMMENTS', { model : Comments}).then((comments) => {
    comments.forEach(item => {
        console.log(item.title);
        console.log(item.content);
    });
}).catch((err) => {
        return res.status(400).send({
            message: err
        }); 
    }); */


// list comments
 /* exports.list = function(req,res) {
    // List all comments and sort by date
    Comments.findAll({
        attributes: ['id','content','title','user_id']
    }).then((comments)=> {
Images.findAll({
    attributes:['id','imageName','title','user_id']
}).then((images) => {    // or Select * from Comments 
    
        res.render('comments', {
            title: 'Comments Page',
            comments : comments, //data : comments
            images: images,
            gravatar : gravatar.url(comments.user_id, { s : '80' , r:'x' , d:'retro'},true),
            urlPath : req.protocol + "://" + req.get("host") + req.url
        })
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
})}; */

exports.list = function(req,res) {
    // List all comments and sort by date
    sequelize.query('select c.id , c.title , c.content , u.email AS user_id from Comments c join Users u on c.user_id = u.id'
    , { model : Comments}).then((comments) => {
        
    // or Select * from Comments 

        res.render('comments', {
            title: 'Comments Page',
            comments : comments, //data : comments
            gravatar : gravatar.url(comments.user_id, { s : '80' , r:'x' , d:'retro'},true),
            urlPath : req.protocol + "://" + req.get("host") + req.url
        })
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
}; 


const comments = sequelize.query('select c.id , c.title , c.content , u.email AS user_id from Comments c join Users u on c.user_id = u.id'
, { model : Comments}).then((comments) => {    // or Select * from Comments 
    return comments
});

const images = Images.findAll({
    attributes: ['id','imageName','title','user_id']
}); 

/*
 Users.findAll({
   raw:true,    // use plain:true for one instance , raw for array 
}).then(data=> {
            console.log("you 666  " + JSON.stringify(data) + "\n" );
    })

Images.findAll().then(hello => {
  console.log("hello data of images!!! >>>  " + JSON.stringify(hello));
}) 
    
*/

/*

exports.list1 = function(req,res) {
Promise.all([comments,images]).then(responses=> {
    res.render('comments', {
        title: "Comments page",
        gravatar : gravatar.url(comments.user_id, { s : '80' , r:'x' , d:'retro'},true),
        comments: responses[0],
        images: responses[1],
        urlPath : req.protocol + "://" + req.get("host") + req.url
    })
    console.log(" COMPLETED RESULTS****");
    console.log(responses[0]);
    console.log(responses[1]);
}).catch(err => {
    console.log("ERROR RESULTSS **");
    console.log(err);
});
} 
*/

// create comments

exports.create = function(req,res) {
    console.log("creating comments")

    var commentData = {
        title: req.body.title,
        content : req.body.content,
        user_id: req.user.id,
    }

    /* Comments.create(commentData).then((newComment , created) => {
        if (!newComment) {
            return res.send(400, {
                message : "error"
            });
        }

        res.redirect('/comments');
    }) */ 

    Comments.findOrCreate({where : { title: commentData.title }, defaults: commentData }).spread((comment,created)=> {
        console.log(comment.get({plain:true}));

        console.log("created:" + created);
        if (created) {
            /* Users.findById(commentData.user_id).then(user=>{
                return user.increment('experience',{by:300*4})
            }) */
            res.redirect('/comments');
        } else {
            return res.send(400, {
                message:"unable to create comment, already exist"
            })
        }
    });
        
    };


exports.delete = function (req,res) {
    var record_num = req.params.comments_id;
    console.log("deleting comments" + record_num);
    Comments.destroy({where: { id: record_num } }).then( (deletedComment ) => {
        if(!deletedComment) {
            return res.send(400, {
                message: "error"
            });
        }

        res.status(200).send({message: "Deleted comments : " + record_num});
    })
}


Comments.findAll({
    attributes: ['title','content','user_id']
}).then((comments)=> {
    comments.forEach(item=> {
        console.log("ITEM TITLE IS THIS " + item.title);
        console.log( "ITEM CONTENT IS THIS" + item.content);
        console.log(" LASTLY " + item.user_id);
    });
});


//findAll or use sequelize.query to retrieve all the records 
/* exports.list1 = function(req,res) {
Comments.findAll({
    attributes: ['id','title','content','user_id']
}).then(function(comments) {
    res.render('comments', {
        title:'Comments Page',
        gravatar : gravatar.url(comments.user_id, { s : '80' , r:'x' , d:'retro'},true),
        comments: comments,
        urlPath : req.protocol + "://" + req.get("host") + req.url
    });
}).catch((err)=> {
    return res.status(400).send({
        message:err
    })
})
} */ 

/* Users.findAll({
    attributes:['name','email']
}).then((users) => {
    users.forEach(item=> {
        console.log("users name is this" + item.name);
        console.log("user email is this" + item.email);
    });
}); */

// comments authorization middleware
exports.hasAuthorization = function(req,res,next) {
    if (req.isAuthenticated())
        return next();
    res.redirect("/login");
        
};


/*exports.hasAuthorization = function (req,res,next) {
    if (req.IsAuthenticated())
      return next();
    res.redirect('/login');
};*/

                                                                                                        //call back function
/* LuckyDrawModel.findOrCreate({ where : { nric : luckyDrawData.nric }, defaults: luckyDrawData}).spread( (result,created) => {
    if (created) {
        return res.send(200, {message: "Registration successful!"});
    } else {
        return res.send(400, {
            message: "Unable to register!"
        })
    }
}).catch((err) => {
    return res.status(400).send({
        message: err
    });
}); */

