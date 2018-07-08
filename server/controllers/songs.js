// Import modules
var fs = require('fs');
var mime = require('mime');

// get gravatar icon from email
var gravatar = require('gravatar');

// set video file types    audio/mpeg = mp3 :)
var VIDEO_TYPES = ['video/mp4' , 'audio/mpeg' , 'video/webm' , 'video/ogg' , 'video/ogv'];

// get song model
var Songs = require('../models/songs');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

var Users = require('../models/users');

var Playlists = require('../models/playlists');

// List songs
exports.show = function (req,res) {
    var user_num = req.user.id;
    sequelize.query('select s.id , s.title , s.songName , u.email AS user_id from Songs s join Users u on s.user_id = u.id' , 
        { model : Songs}).then((songs) => {
    Playlists.findAll( { where: {user_id: user_num} } ).then((playlists) => {
        res.render('songs' , {
            title:'Songs Page',
            songs: songs,
            playlists:playlists,
            user: req.user,
            gravatar: gravatar.url(songs.user_id, { s: '80', r:'x' , d:'retro'},true),
            urlPath : req.protocol + "://" + req.get("host") + req.url 
        });
    })
    }).catch((err) => {
            return res.status(400).send({
                message: err
        });
    });
};

exports.addSong = function(req,res) {
    var addToPlayList = {
        playlist_id: req.body.playlist_id,
        song_id: req.body.song_id,
        user_id: req.user.id
    }
    Playlists.create(addToPlayList).then((addSong,created)=> {
        if (!addSong) {
            return res.send(400, {
                message:"error"
            })
        }
        res.redirect('songs');
    })
}

exports.footer = function(req,res) {
    sequelize.query('select * from Songs' , {model : Songs}).then((songs)=> {
        res.render('../partials/footer' , {
            songs: songs
        })
    })
}

// Create songs
exports.uploadSong = function (req,res) {
    var src;
    var dest;
    var targetPath;
    var targetName;
    console.log(req);
    var tempPath = req.file.path;

    // get the mime type of file
    var type = mime.lookup(req.file.mimetype);

    // get file extension
    var extension = req.file.path.split(/[. ]+/).pop();

    // check support file types
    if (VIDEO_TYPES.indexOf(type) == -1) {
        return res.status(415).send('Supported video formats: mp4 , mp3 , webm , ogg , ogv');
    }

    // Set new path to images
    targetPath = './public/songs/' + req.file.originalname;

    // using read stream API to read file
    src = fs.createReadStream(tempPath);

    // using write stream API to write file
    dest = fs.createWriteStream(targetPath);
    src.pipe(dest);

    //Show error
    src.on('error' , function(error) {
        if (error) {
            return res.status(500).send({
                message: error
            });
        }
    });

    // Save file process
    src.on('end', function () {

        // Create a new instance of the Video model with request body
        var songData = {
            title: req.body.title,
            songName: req.file.originalname,
            user_id: req.user.id
        }

        // Save to database
        Songs.create(songData).then((newSong,created) => {
            if (!newSong) {
                return res.send(400, {
                    message: "error"
                });
            };
            Users.findById(songData.user_id).then(user=>{
                return user.increment('experience',{by:300*9}) //2700 exp
            })

            res.redirect('songs');
        })

        // remove from temp folder
        fs.unlink(tempPath , function (err) {
            if (err) {
                return res.status(500).send({
                    message: error
                });
            }

            // Redirect to gallery's page
            //res.redirect('songs');

        });
    });
};

exports.delete = function (req,res) {
    var song_num = req.params.songs_id;
    console.log("deleting songs" + song_num);
    Songs.destroy({where: { id: song_num } }).then( (deletedSong ) => {
        if(!deletedSong) {
            return res.send(400, {
                message: "error"
            });
        }

        res.status(200).send({message: "Deleted songs : " + song_num});
    })
}

// Songs authorization middleware
exports.hasAuthorization = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};




