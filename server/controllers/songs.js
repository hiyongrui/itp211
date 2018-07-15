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

var songsAndPlaylist = require('../models/songAndPlaylist'); //add duplicate song and playlist

// set image file types
var IMAGE_TYPES = ['image/jpeg' , 'image/jpg' , 'image/png'];

var Songlike = require('../models/songlike');

// List songs
exports.show = function (req,res) {
    var user_num = req.user.id;                           //previously u.email ,    u.name AS user_id
    sequelize.query('select s.id , s.title , s.songName , s.songImage, s.songLikeNo, s.user_id , u.name as createdAt from Songs s join Users u on s.user_id = u.id' , 
        { model : Songs}).then((songs) => {
    Playlists.findAll({ where: {user_id: user_num} }).then((playlists) => {
        Songlike.findAll( { where: {user_id: user_num} }).then(songlikeuser => {
        res.render('songs' , {
            title:'Songs Page',
            songs: songs,
            playlists:playlists,
            songlikeuser: songlikeuser,
            user: req.user,
            gravatar: gravatar.url(songs.user_id, { s: '80', r:'x' , d:'retro'},true),
            urlPath : req.protocol + "://" + req.get("host") + req.url 
        });
    })
    })
    }).catch((err) => {
            return res.status(400).send({
                message: err
        });
    });
};


//add song to playlist
exports.addSong = function(req,res) {
    var addToPlayList = {
        playlist_id: req.body.playlist_id,
        song_id: req.body.song_id,
        user_id: req.user.id
    }
    console.log("addtoPlaylistbefore>>> " + JSON.stringify(addToPlayList));
    songsAndPlaylist.create(addToPlayList).then((addSong,created)=> {
        console.log("addtoPlaylistafter>>> " + JSON.stringify(addToPlayList));
        if (!addSong) {
            return res.send(400, {
                message:"error"
            })
        }
        res.redirect('songs');
    })
}

exports.likeSong = function(req,res) {
    var likesong_id = req.body.likesong_id;
    var addToSongLike = {
        song_id: req.body.likesong_id,
        user_id: req.user.id
    }
    console.log("like song >>>> " + likesong_id);
    Songs.findById(likesong_id).then((song) => {
        Songlike.create(addToSongLike).then(songLikeUser => {
        song.songLikeNo += 50;
        song.save();
        console.log("successfully update song like ");
        res.redirect('songs');
        })
    })
};

exports.unlikeSong = function(req,res) {
    var likesong_id = req.body.likesong_id;
    console.log("unlike song >>> " + likesong_id);
    Songs.findById(likesong_id).then(song=> {
        Songlike.destroy({where: {song_id: likesong_id, user_id: req.user.id}});
        song.songLikeNo -= 50;
        song.save();
        console.log("sucecssfully unlike song ");
        res.redirect("songs");
    })
};

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
    var srcForImage;
    var dest;
    var destForImage;
    var targetPath;
    var targetName;
    //console.log(req);
    
    console.log("\n cancer");
    console.log(req.files);
    console.log(req.files["song"]);
    var tempPathArray = [];
    var originalNameArray = [];
    var mimeTypeArray = [];
    var files = [];
    var fileKeys = Object.keys(req.files);
    fileKeys.forEach(function(key) {
        files.push(req.files[key]);
        console.log("hey key \n " + key);
        console.log("below is the req files key  ");
        console.log(req.files[key]);
        console.log("incoming originalname ----- ");
        console.log(req.files[key][0]["originalname"]);
        originalNameArray.push(req.files[key][0]["originalname"]);
        tempPathArray.push(req.files[key][0]["path"]);
        mimeTypeArray.push(req.files[key][0]["mimetype"]);
    })
    console.log("\n wot \n" + JSON.stringify(files));
    
   console.log("\n file path " + fileKeys);
    console.log(originalNameArray);

    console.log("temp patharray  >>> " + tempPathArray);

    //var tempPath = req.file.path;
    var tempPath = tempPathArray[0];
    var tempPathForImage = tempPathArray[1];

    console.log("temp path for song >> " + tempPath);
    console.log("temp path for image >> " + tempPathForImage);

    // get the mime type of file
    //var type = mime.lookup(req.files["song"]["mimetype"]);
    //var type = mime.lookup(mimeTypeArray[0]);
    //console.log("type of mime >>>> " + type);
    // get file extension
    //var extension = req.files["song"].path.split(/[. ]+/).pop();

    // check support file types
    /*
    if (VIDEO_TYPES.indexOf(type) == -1) {
        return res.status(415).send('Supported video formats: mp4 , mp3 , webm , ogg , ogv');
    }  */

      
    // Set new path to songs
    //targetPath = './public/songs/' + req.files['song'].originalname;
    targetPath = './public/songs/' + originalNameArray[0]; 
    console.log("target path >>> " + targetPath);
    targetPathForImage = './public/images/' + originalNameArray[1];
    console.log("target path for image >> " + targetPathForImage);
    //console.log("upload multer >>>>>>> " + req.files['song'].originalname);
    //console.log("req file " + JSON.stringify(req.files['song']));

    // using read stream API to read file
    src = fs.createReadStream(tempPath);
    srcForImage = fs.createReadStream(tempPathForImage);

    // using write stream API to write file
    dest = fs.createWriteStream(targetPath);
    src.pipe(dest);
    destForImage = fs.createWriteStream(targetPathForImage);
    srcForImage.pipe(destForImage);


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
            //songName: req.files["song"].originalname,
            songName: originalNameArray[0],
            songImage: originalNameArray[1],
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

        // remove from temp folder , if one of the array use tempPathArray[0]
        /*
         fs.unlink(tempPath , function (err) {
            if (err) {
                return res.status(500).send({
                    message: error
                });
            } 
     

            // Redirect to gallery's page
            //res.redirect('songs');

        });
         */
        function deleteFiles(tempPathArray, callback) {
            var i = tempPathArray.length;
            tempPathArray.forEach(function(filepath) {
                fs.unlink(filepath, function(err) {
                    i--;
                    if (err) {
                        callback(err);
                        return;
                    } else if (i <= 0) {
                        callback(null);
                    }
                })
            })
        }
        deleteFiles(tempPathArray, function(err) {
            if (err) {
                console.log("hey error nice temp path >>> " + err);
            } else {
                console.log("all files removed :)))) ");
            }
        })

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




