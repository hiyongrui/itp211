//get Playlist model
var Playlists = require('../models/playlists');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

var Users = require('../models/users');

exports.list = function(req,res) {
    // List all comments and sort by date
    var user_num = req.user.id;
    Playlists.findAll( { where: {user_id: user_num} } ).then( playlists => { //findAll,where clause return one row only thats why must usersProfile[0]
        console.log("playlist data>>>  " + JSON.stringify(playlists));
        res.render('playlists', {
            playlists: playlists,
            urlPath : req.protocol + "://" + req.get("host") + req.url
        })
    }).catch((err) => {
        return res.status(400).send({
            message: err
        })
    })
}; 

exports.viewOnePlaylist = function(req,res) {  
    var playlist_num = req.params.id; // or var user_num = req.params.id;  or req.params.user;
    console.log("params playlist>>> " + playlist_num); // or use findone to return an object , then dont need use usersProfile[0];
    Playlists.findOne( { where: {playlist_id: playlist_num} } ).then( onePlayList => { //findAll,where clause return one row only thats why must usersProfile[0]
    console.log(" one playlist>>> " + onePlayList);
    res.render('viewplaylist', {
        onePlayList: onePlayList,
        hostpath: req.protocol + "://" + req.get("host")
    })
}).catch((err) => {
    return res.status(400).send({
        message: err
    })
})
}

exports.create = function(req,res) {
    console.log("creating playlists")

    var playlistData = {
        title: req.body.title,
        content: req.body.content,
        user_id: req.user.id
    }

    /* Comments.create(commentData).then((newComment , created) => {
        if (!newComment) {
            return res.send(400, {
                message : "error"
            });
        }

        res.redirect('/comments');
    }) */ 

    Playlists.findOrCreate({where : { title: playlistData.title }, defaults: playlistData }).spread((playlist,created)=> {
        console.log(playlist.get({plain:true}));

        console.log("created:" + created);
        if (created) {
            /* Users.findById(commentData.user_id).then(user=>{
                return user.increment('experience',{by:300*4})
            }) */
            res.redirect('/playlists');
        } else {
            return res.send(400, {
                message:"unable to create playlist, already exist"
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




// comments authorization middleware
exports.hasAuthorization = function(req,res,next) {
    if (req.isAuthenticated())
        return next();
    res.redirect("/login");
        
};


