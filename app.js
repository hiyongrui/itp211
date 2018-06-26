// Import basic modules
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const COOKIE_SECRET = 'keyboard cat??' // at first dh

// import multer 666
var multer = require('multer');  //                               15 mb now i added another 0 to it cos of the song "exit premise" 6mb..
var upload = multer({dest:'./public/uploads/', limits: {fileSize: 15000000, files:1}});   //1.5 megabyte file size limit , file only can 1

var footer = require('./server/controllers/footer');


// Import home controller
var index = require('./server/controllers/index');
// Import login controller
var auth = require('./server/controllers/auth');

// Import comments controller @@@
var comments = require('./server/controllers/comments');

var users = require('./server/controllers/users');
// Import videos controller @@@
var videos = require('./server/controllers/videos');

//Import song controller :)
var songs = require('./server/controllers/songs');

// upload profile image when you sign up 
var uploader = require('./server/controllers/userUpload');

// import image controller @@@@@
//var images = require('./server/controllers/images');
var imageRouter = require('./routes/imagerouter');

var chatMessages = require('./server/controllers/chatMsg');

var studentsController = require("./server/controllers/studentsController"); //from p5db

var Users = require('./server/models/users');
// Modules to store session
var myDatabase = require('./server/controllers/database');
var expressSession = require('express-session');
var SessionStore = require('express-session-sequelize')(expressSession.Store);
var sequelizeSessionStore = new SessionStore({
    db: myDatabase.sequelize,
});
// Import Passport and Warning flash modules
var passport = require('passport');
var flash = require('connect-flash');

var app = express();
var serverPort = 3000;
var httpServer = require('http').Server(app);
 
// view engine setup
app.set('views', path.join(__dirname, 'server/views/pages')); //ejs templates found in /views/pages folder
app.set('view engine', 'ejs');        

// Passport configuration
require('./server/config/passport')(passport);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
}));

// Setup public directory
app.use(express.static(path.join(__dirname, 'public'))); // #express.static function expects the absolute file path to folder
// http://localhost:3000/javascripts/bootstrap.min.js
// if app.use('/downloads') then http://localhost:3000/downloads/javascripts/bootstrap.min.js cos of mountpoint

// required for passport
// secret for session
// https://stackoverflow.com/questions/32025173/nodejs-access-sessions-inside-socket
var sessionMiddleware = expressSession({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  });

  app.use(sessionMiddleware);
  

/*
var sessionMiddleware = expressSession({ //was app.use(expressSession)... 
    //key:'user_sid',
    secret: COOKIE_SECRET, //sometextgohere wtf password is this???
    store: sequelizeSessionStore, // remove this if wan to be able to restart node app and user hav to sign in again
    resave: false,
    saveUninitialized: false
}); 

app.use(sessionMiddleware); 
*/

// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
// flash messages
app.use(flash());


app.use(function(req, res, next) { // from stackoverflow, simple middleware , provided req.user is populated
    res.locals.user = req.user; // user variable available to all templates but must declare right after passport.session middleware, before any routes
    if (req.user) {
        req.session.useridhehe = req.user.id;
        res.cookie('userid', req.user.id);
    }
    //req.session.nameID = req.user.id
    console.log("BELOW IS SESSION AND COOKIES!!!!!!!  \n")
    console.log("SESSION LOL >>>>>>>>  " + JSON.stringify(req.session) + "\n")
    console.log("COOKIE LOL >>>>>>>>>  " + JSON.stringify(req.cookies) + "\n\n")
    console.log("WATS TIS \n " + JSON.stringify(req.cookies.user_sid) );
  
    //console.log(" \n HEY " + JSON.stringify(req.cookies.cookiename.passport.user))
    //console.log("\n I GOT THIS " + JSON.stringify(req.session.passport.user));
    //console.log("USER MISSING OR NO? " + req.session.passport.user);
    console.log("Jesus " + req.sessionID);
    console.log(" HELP " + req.isAuthenticated());
    next();
  });

  /*
  app.use(function(req,res,next) {
    if (req.session.isChanged == true) {
        res.clearCookie('user_sid');
        req.session.save();
    }
    next();
})
*/

  var obj = [ [1,2000], [2, 5000] , [3, 6000] , [4,8000] ];
  var userExperience = 5000;
  objLength = Object.keys(obj).length;

app.use(function(req,res,next) {
    if (req.isAuthenticated()) {
    id = req.user.id;
    Users.findById(id).then((users)=> {
         /* users.status = "online";
         users.save(); */
         for (i=0; i< objLength;i++) {
            console.log("HEY" + obj[i][0]);
            if (users.level == obj[i][0]) {
                users.expNeeded = obj[i+1][1] - users.experience;
                users.save();
                //currentUser.level += 1;
                console.log("???" +obj[i][0]); 
                console.log(users.experience);
                if (users.experience > obj[i][1]) { //user level 2 > level2
                    console.log(users.experience);
                    users.level +=1;
                    users.experience = users.experience - obj[i][1];
                    users.coin += 50;
                    console.log(users.experience);
                    users.save();
                }}
            }//})
        })}//}
    next();
})

var rank = [ [2,"silver"] , [3,"gold"] , [4,"master"] , [5,"god"] ];
rankLength = Object.keys(rank).length;

app.use(function(req,res,next) {
    if (req.isAuthenticated()) {
    id = req.user.id;
    Users.findById(id).then((users=> {
        for (i=0; i<rankLength; i++) {
            if (users.level == rank[i][0]) {
                users.rank = rank[i][1];
                users.save();
            }
        }
    }))
    }
    next();
})

app.get('/helloworld', function(req,res) {
    res.render('helloworld');
});

app.get('/footer', footer.list);

app.get('/header', function(req,res) {
    res.render('header', {
        user: req.user
    })
});

// Application Routes
// Index Route
app.get('/', index.show);
app.get('/login', auth.signin);
app.post('/login', passport.authenticate('local-login', {
    //Success go to Profile Page / Fail go to login page
    successRedirect: '/profile', //was messages XD
    failureRedirect: '/login',
    failureFlash: true
}));
app.get('/signup', auth.signup);
app.post('/signup', passport.authenticate('local-signup', {
    //Success go to Profile Page / Fail go to Signup page
    //successRedirect: '/profile',
    successRedirect: '/userRole',
    failureRedirect: '/signup',
    failureFlash: true
}));

app.get('/userUpload', uploader.hasAuthorization, function(req,res) {
    res.render('userUpload', {
        title: 'UPLOAD UR IMAGE!!!'
    }
)});
app.post('/userUpload' , uploader.hasAuthorization , upload.single('image'), uploader.uploadImage);

app.get('/userRole', uploader.hasAuthorization, function(req,res) {
    res.render('userRole', {
        title: "Please select your account type!"
    })
})
app.post('/userRole' , uploader.hasAuthorization , uploader.role);

app.post('/profile' , upload.single('image'), uploader.uploadImage, uploader.hasAuthorization);
app.get('/profile', auth.isLoggedIn, auth.profile);
app.get('/users/profile/:id', auth.isLoggedIn, auth.viewprofile);  // or /users/profile/:id  or /users/profile/:users_id

// Logout Page
app.get('/logout', function (req, res) {
    //req.user.last_login_date = Date.now();
    id = req.user.id;
    Users.findById(id).then(user => {
        user.status = "offline";
        user.save();
    })
    res.clearCookie("userid");
    res.clearCookie("connect.sid"); // cos the browser cookie does not clear after logout.
    req.logout();
    res.redirect('/');
});

// set up routes for comments ////
app.get('/comments' , comments.hasAuthorization , comments.list);
app.post('/comments' , comments.hasAuthorization , comments.create);
app.delete('/comments/:comments_id' , comments.hasAuthorization , comments.delete);


app.get('/users',users.hasAuthorization , users.list );


// Set up  routes for videos ////
app.get('/videos' , videos.hasAuthorization , videos.show);
app.post('/videos' , videos.hasAuthorization , upload.single('video') , videos.uploadVideo);

// Set up  routes for songs ////
app.get('/songs' , songs.hasAuthorization , songs.show);
app.post('/songs' , songs.hasAuthorization , upload.single('song') , songs.uploadSong);
app.delete('/songs/:songs_id' , songs.hasAuthorization , songs.delete);

// Set up routes for images 6666
//app.post('/images', images.hasAuthorization, upload.single('image'), images.uploadImage);
//app.get('/images-gallery', images.hasAuthorization , images.show );
app.use("/images-gallery",imageRouter);



app.get("/p5db" , studentsController.list);
app.get("/p5db/edit/:id" , studentsController.editRecord);
app.post("/p5db/new" , studentsController.insert);
app.post("/p5db/edit/:id" , studentsController.update);
app.delete("/p5db/:id" , studentsController.delete);





//Set up route for chat messages 666666 can do this in another controller but they lazy
 app.get('/messages', function(req, res) {
    ChatMsg.findAll().then((chatMessages) => {
        res.render('chatMsg', {
            url: req.protocol + "://" + req.get("host") + req.url,
            data: chatMessages
        });
    });
}); 
//app.get('/messages', chatMessages.hasAuthorization, chatMessages.list);


app.post('/messages', function(req, res) {
    var chatData = {
        name: req.body.name,
        message: req.body.message,
        user_id: req.user.id // foreign key why not working??? cant be req.body.user.id
    }
    // Save into database
    ChatMsg.create(chatData).then((newMessage) => {
        if (!newMessage) {
            res.sendStatus(500);
        }
        io.emit('message', req.body)
        res.sendStatus(200)
    })
});

// Setup chat
var io = require('socket.io')(httpServer);

var chatConnections = 0;
var ChatMsg = require('./server/models/chatMsg');

let onlineUsersFinal = [];
let offlineUsersFinal = [];
//let onlineU = [];
//let offlineU= [];

io.use(function(socket,next) {
    sessionMiddleware(socket.request, socket.request.res , next);
    console.log("socket id > > > " + socket.id);
    //console.log(socket.request.headers)
})

/*
io.on('connection', function(socket) {
    //var userId = req.session.passport.user;
    //onlineUsers.push(userId);
    console.log(' %s sockets connected' , io.engine.clientsCount)
    console.log( "user id connected to socket is " + socket.request.session.useridhehe);
    if (onlineUsersFinal.indexOf(socket.request.session.useridhehe) == -1) {
        onlineUsersFinal.push(socket.request.session.useridhehe);
    }
    console.log("length of online users array is " + onlineUsersFinal.length);
    for (var i=0; i<onlineUsersFinal.length; i++) {
        Users.findById(onlineUsersFinal[i]).then(user=> {
            user.status = "online";
            user.save();
        })
    }
    chatConnections++;
    console.log("Num of chat users connected before: " + chatConnections);
    console.log("online user array before id is >>>>> " + onlineUsersFinal);


    //socket.join("Room:test");
    
    socket.on('disconnect', function() {
        if (offlineUsersFinal.indexOf(socket.request.session.useridhehe) == -1) {
            offlineUsersFinal.push(socket.request.session.useridhehe);
        }
        console.log("length of offline users array is > " + offlineUsersFinal.length);
        for (var i=0; i<offlineUsersFinal.length; i++) {
            Users.findById(offlineUsersFinal[i]).then(user=> {
                user.status = "offline";
                user.save();
            })
        }
        chatConnections--;
        console.log("Num of chat users connected after: " + chatConnections);
        console.log("offline user array after id xd > > " + offlineUsersFinal);
    }); 
});

*/

users = {} //key value instead of array
//offlineUsers = {}

io.on('connection', function(socket) {
     socket.user_id = socket.request.session.useridhehe;
     socket.on('newUser',function() {
        //socket.user_id = userid;
        users[socket.user_id] = socket.user_id;
        Users.findById(socket.user_id).then(user=> {
            user.status ="online";
            user.last_login_date = Date.now();
            user.save();
            io.sockets.emit('userStatus', user.status);
            io.sockets.emit('onlineUser', socket.user_id);
            //io.sockets.emit('lastSeen', user.last_login_date);
        })
        console.log("\n");
        console.log(JSON.stringify(users) + " wat is user id from client - " + socket.user_id);
        console.log("\n");
        console.log(socket.request.session.useridhehe)
    })

    
    socket.on('disconnect',function() {
        console.log(socket.user_id + "  disconnected");
        if (typeof users != null) {
            Users.findById(socket.user_id).then(user=> {
                user.status = "offline";
                user.last_login_date = Date.now();
                user.save();
                io.sockets.emit('userStatus', user.status);
                io.sockets.emit('onlineUser', socket.user_id);
                
            })
        }
        delete users[socket.user_id];
        console.log(JSON.stringify(users) + " <<<<<< user DELETED FINALLYS ")
    });


});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

app.set('port', serverPort);

var server = httpServer.listen(app.get('port'), function () {
    console.log('http server listening on port ' + server.address().port);
});