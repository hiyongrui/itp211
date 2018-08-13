// Import modules
var fs = require('fs');
var Songs = require('../models/songs');

//get Playlist model
var Playlists = require('../models/playlists');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

var Users = require('../models/users');

var songAndPlaylist = require('../models/songAndPlaylist');
exports.list = function(req,res) {
    // List all comments and sort by date
    var user_num = req.user.id;  //select * where clause , distinct for unique playlist
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
    Playlists.findOne( { where: {id: playlist_num} } ).then( onePlayList => { //findAll,where clause return one row only thats why must usersProfile[0]
    //sequelize.query('select * from Playlists where id = ' + playlist_num).then(onePlayList => {
    sequelize.query('select * from songsandplaylists sp inner join Songs s on sp.song_id = s.id where playlist_id = :status', {replacements: {status:playlist_num}, type:sequelize.QueryTypes.SELECT} ).then(allSongsToThisPlaylist => {
    //songAndPlaylist.findAll({where: {playlist_id:playlist_num} }).then( allSongsToThisPlaylist => {
    console.log(" one playlist>>> " + JSON.stringify(onePlayList));
    console.log("all the songs number wrong>>>>>>>>>>>> " + JSON.stringify(allSongsToThisPlaylist));
    res.render('viewplaylist', {
        onePlayList: onePlayList,
        allSongs: allSongsToThisPlaylist,
        hostpath: req.protocol + "://" + req.get("host")
    })
})
}).catch((err) => {
    return res.status(400).send({
        message: err
    })
})
}

exports.create = function(req,res) {
    console.log("creating playlists");

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


// Create songs in playlist
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
        var playlistParams = req.params.id;
       
        console.log("playlist params>>>>> " + playlistParams);
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
            
            sequelize.query('select max(id) maxSongId from Songs', {type: sequelize.QueryTypes.SELECT} ).then(maxSong=> {
                console.log("max song id >>>>>>>>>>>>> " + JSON.stringify(maxSong));
                console.log(maxSong[0]);
                var maxSongId = maxSong[0].maxSongId;
                var addData = {
                    playlist_id: playlistParams,
                    song_id: maxSongId,
                    user_id: req.user.id
                }
                songAndPlaylist.create(addData);
            })

            res.redirect('/playlists/' + playlistParams);
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


