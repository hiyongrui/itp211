// Import basic modules
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookie = require('cookie');

const COOKIE_SECRET = 'keyboard cat??' // at first dh

// import multer 666
var multer = require('multer');  //                               15 mb now i added another 0 to it cos of the song "exit premise" 6mb..
var upload = multer({dest:'./public/uploads/', limits: {fileSize: 15000000, files:5}});   //1.5 megabyte file size limit , file only can 1



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

//Import playlist controller (7/8/2018)
var playlists = require('./server/controllers/playlists');

// upload profile image when you sign up 
var uploader = require('./server/controllers/userUpload');

// import image controller @@@@@
//var images = require('./server/controllers/images');
var imageRouter = require('./routes/imagerouter');

var chatMessages = require('./server/controllers/chatMsg');

var studentsController = require("./server/controllers/studentsController"); //from p5db



// Import lessons controller kamali
var lessons = require('./server/controllers/lessons');
//var viewAllLessons = require('./server/controllers/viewAllLessons');
var profileSetting = require('./server/controllers/profileSetting');
var profileSetting = require('./server/controllers/profileSetting');

var IndProfile = require('./server/controllers/IndProfile'); // Import IndProfile controller kamali

var guitar = require('./server/controllers/guitar'); // Import InstructorListings controller kamali
var violin = require('./server/controllers/violin'); 
//end of kamali controller import


// Import products controller jiarong
var productsController = require("./server/controllers/sampleProduct");
var cart = require("./server/controllers/cart");
var transaction = require("./server/controllers/transaction");
var payment = require("./server/controllers/payment");
// end of jiarong controller import

// Import reviews controller charmaine @@@
var reviews = require('./server/controllers/reviews');
//end of charmaine controller import


var Users = require('./server/models/users');
var Songs = require('./server/models/songs');
var Songlike = require('./server/models/songlike');
var search = require("./server/controllers/search");


// Modules to store session
var myDatabase = require('./server/controllers/database');
var sequelize = myDatabase.sequelize;
var expressSession = require('express-session');
var SessionStore = require('express-session-sequelize')(expressSession.Store);
var sequelizeSessionStore = new SessionStore({
    db: myDatabase.sequelize,
});
// Import Passport and Warning flash modules
var passport = require('passport');
var flash = require('connect-flash');

const Joi = require('joi');

const dbREST = require("./server/controllers/db");
const collection = "todo";
// schema used for data validation for our todo document
const schema = Joi.object().keys({
    todo : Joi.string().required()
});

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
    if (req.isAuthenticated()) {
    res.locals.user = req.user; // user variable available to all templates but must declare right after passport.session middleware, before any routes
    }
    else{
        res.locals.user = false;
    }
    app.locals.urlName = req.headers.host; //<%=urlName%> in client javascript is equal to   localhost:3000
    console.log(req.headers.referer);
    console.log("app locals url name >>>> " + req.headers.host);
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
    console.log("current id is wat??? " + id);
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

// app.locals to make the song sequelize object available for all pages , req.locals no work??
app.use(function(req,res,next) {
    Songs.findAll().then((songs=> {
        app.locals.songs = songs
    }
))
next();
})

app.use(function(req,res,next) {
    console.log("app use ---------------- ");
    if (req.isAuthenticated()) {
    var changecool = req.session.useridhehe;
    sequelize.query("select s.title AS createdAt , u.name AS user_id  , u.userImage AS id , s.user_id lol , sl.user_id haha from Songlikes sl inner join Users u on sl.user_id = u.id inner join Songs s on sl.song_id = s.id where u.id <> :status",
    {replacements: {status:changecool}, type:sequelize.QueryTypes.SELECT} 
    , {model: Songlike}).then(songlikes=> {
        app.locals.songlike = songlikes
        console.log("\n song like DATA =============== ");
        console.log(JSON.stringify(songlikes));
        next(); //ended this next() here and else{next() because it seems to be async and error songlike is undefined at header.ejs if no next() here...?} and console log will happen after the error
        //https://stackoverflow.com/questions/34184701/expressjs-async-and-middleware-does-not-work-properly
    })
    }
    else{
        next();
    }
})

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
app.get('/users/profile/:name', auth.isLoggedIn, auth.viewprofile);  // or /users/profile/:id  or /users/profile/:users_id

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
//app.post('/videos' , videos.hasAuthorization , upload.single('video') , videos.uploadVideo);
app.delete('/videos/:videos_id'  ,videos.hasAuthorization, videos.delete); //kamali


// Set up  routes for songs ////
app.get('/songs' , songs.hasAuthorization , songs.show);
app.post('/songs' , songs.hasAuthorization , upload.fields([{name: 'song', maxCount:1}, {name:"image", maxCount:1}]) , songs.uploadSong);
app.delete('/songs/:songs_id' , songs.hasAuthorization , songs.delete);
app.post('/addsongs', songs.hasAuthorization , songs.addSong);
app.post('/likesong', songs.hasAuthorization , songs.likeSong);
app.post('/unlikesong', songs.hasAuthorization , songs.unlikeSong);


app.get('/playlists', playlists.hasAuthorization , playlists.list);
app.post('/playlists', playlists.hasAuthorization , playlists.create);
app.get('/playlists/:id', playlists.hasAuthorization , playlists.viewOnePlaylist);
app.post('/addInPlaylist/:id', playlists.hasAuthorization , upload.fields([{name: "song", maxCount:1}, {name: "image", maxCount:1}]), playlists.uploadSong);

app.get("/products/:id", productsController.viewOneProduct);
//app.get("/search", search.search);
//app.post("/search/:searchResult", search.searchResult);

//app.get("/search/:searchResult", search.searchList);
//app.get("/search/:searchResult/haha", search.searchForTag);
app.get("/search/:searchResult/filter", search.searchFilter);

app.get("/search/searchResult", search.searchList);
app.get("/search/:searchResult/searchTag", search.searchForTag);
// search/instruments/searchResult?comeon=searchVal)
// eg..         /display/post?size=small
//  use app.get("/display/post") , req.query.size will give u small. https://stackoverflow.com/questions/17007997/how-to-access-the-get-parameters-after-in-express
//if dont use req.query , cant search for stuff like 4/10 condition the slash / does not work for req.params
// https://hackernoon.com/restful-api-designing-guidelines-the-best-practices-60e1d954e7c9 , according to this , :searchResult params should be in query instead... ?


// Set up routes for images 6666
//app.post('/images', images.hasAuthorization, upload.single('image'), images.uploadImage);
//app.get('/images-gallery', images.hasAuthorization , images.show );
app.use("/images-gallery",imageRouter);



app.get("/p5db" , studentsController.list);
app.get("/p5db/edit/:id" , studentsController.editRecord);
app.post("/p5db/new" , studentsController.insert);
app.post("/p5db/edit/:id" , studentsController.update);
app.delete("/p5db/:id" , studentsController.delete);


// kamali profileSetting , lessons
//app.get('/profileSetting', auth.isLoggedIn , auth.profileSettings);
//app.get('/lessons', lessons.hasAuthorization, lessons.show);
app.get('/profileSetting', profileSetting.hasAuthorization, profileSetting.list);
app.get("/profileSetting/edit/:id" , profileSetting.editprofileSetting);
app.post("/profileSetting/new" , profileSetting.insert);
app.post("/profileSetting/edit/:id" , profileSetting.update);

app.get('/lessons', lessons.hasAuthorization, lessons.show);
app.get('/viewAllLessons', profileSetting.show);

app.get('/IndProfile/:id', IndProfile.show); //routes for ind profile

app.get('/guitar', guitar.show); //routes for instructor listings , suppose to have ukelele , cello , singing,piano,flute,saxophone,drums,clarinet,bassguitar,harmonica,tabla,opera,songwriting,percussion,trumpet,trombone
app.get('/violin', violin.show);    // but im not gonna copy paste 18 model , 18 controller , 18 ejs = 54 that are duplicated wtf. so just 2.
app.get('/ukulele', violin.show);
app.get('/cello', violin.show);
app.get('/singing', violin.show);
app.get('/piano', violin.show);
app.get('/flute', violin.show);
app.get('/saxophone', violin.show);
app.get('/drums', violin.show);
app.get('/clarinet', violin.show);
app.get('/bassGuitar', violin.show);
app.get('/harmonica', violin.show);
app.get('/tabla', violin.show);
app.get('/opera', violin.show);
app.get('/songWriting', violin.show);
app.get('/percussion', violin.show);
app.get('/trumpet', violin.show);
app.get('/trombone', violin.show);
//end of kamali router



// jiarong product router
app.post("/new", upload.single('image'),  productsController.insert );

app.get("/products", productsController.list);
//app.post("/new", productsController.insert);
app.delete('/products/:id', productsController.delete);


app.get("/cart", cart.list);
app.post("/products/new", cart.insert);
app.delete("/cart/:id", cart.cartDelete);
app.post("/cart/cartCount", cart.updateCartCount);
app.post("/products/:id/newCartItem", cart.newCartItem);



var payment = require('./server/controllers/payment');
app.get("/payment", payment.payment);

app.get("/transactions", transaction.listOrders);
app.post("/payment/transaction", transaction.transaction);
app.post("/payment/deductAmt", transaction.deductAmt);
app.delete("/payment/cartDelete", transaction.deleteCart);
app.post("/payment/cartCountUpdate", transaction.updateCartCount);
app.all("/transactions/:transactionId", transaction.listOrderDetails);
app.post("/transactions/:id/sendPayment", transaction.sendPayment);


var topup = require('./server/controllers/topup');
app.get("/wallet", topup.list);
app.get("/topupPayment", topup.coinPaymentList);
app.post("/topuppayment/coinPayment", topup.payment);
app.get("/wallet/topupHistory", topup.topupHistory);

var booking = require('./server/controllers/booking');
app.get("/timingForm", booking.timingTest);
app.get("/bookingForm/:id", booking.bookingForm);
app.post("/bookingForm/:id/getTimings", booking.getTimings);
app.post("/timingForm/timings", booking.addTiming);
app.post("/bookingForm/:id/booking", booking.createBooking);
app.post("/videos", upload.single('video'), booking.uploadVideo, booking.appendId);
app.post("/bookingForm/:id/bookingData", booking.booking);
app.post("/bookingForm/:id/bookingUserPayment", booking.bookingPayment);
app.post("/bookingForm/:id/bookingSendPayment", booking.sendPayment);

app.get("/bookingHistory", booking.listBookingHistory);
app.get("/bookingHistory/userHist", booking.listUserHistory);
app.post("/bookingHistory/bookingDetails", booking.getDetails);
app.get("/bookingHistory/instructorHist", booking.listInstructorHistory);
// end of jiarong router

// charmaine review router//
app.post("/reviews", upload.single('image'),  reviews.insert );
app.get('/reviews' , reviews.hasAuthorization , reviews.list);
// app.post('/reviews' , reviews.hasAuthorization , reviews.create);
app.delete('/reviews/:reviews_id' , reviews.hasAuthorization , reviews.delete);
app.get('/users/profile/:name/rating/:user_id', reviews.hasAuthorization, reviews.viewReviewsOfThisUser); //review for this oner user
//end of charmaine router

var userMongoose = require("./server/controllers/UserMongoose");
app.use("/users", userMongoose);
app.get("/mongoose", (req,res) => {
    res.render('mongoose');
})

app.get("/restful", (req,res)=> {
    res.render('restful');
})
// read
app.get('/getTodos',(req,res)=>{
    // get all Todo documents within our todo collection
    // send back to user as json
    dbREST.getDB().collection(collection).find({}).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{
            res.json(documents);
        }
    });
});

// update
app.put('/:id',(req,res)=>{
    // Primary Key of Todo Document we wish to update
    const todoID = req.params.id;
    // Document used to update
    const userInput = req.body;
    // Find Document By ID and Update
    dbREST.getDB().collection(collection).findOneAndUpdate({_id : dbREST.getPrimaryKey(todoID)},{$set : {todo : userInput.todo}},{returnOriginal : false},(err,result)=>{
        if(err)
            console.log(err);
        else{
            res.json(result);
        }      
    });
});


//create
app.post('/',(req,res,next)=>{
    // Document to be inserted
    const userInput = req.body;

    // Validate document
    // If document is invalid pass to error middleware
    // else insert document within todo collection
    Joi.validate(userInput,schema,(err,result)=>{
        if(err){
            const error = new Error("Invalid Input");
            error.status = 400;
            next(error);
        }
        else{
            dbREST.getDB().collection(collection).insertOne(userInput,(err,result)=>{
                if(err){
                    const error = new Error("Failed to insert Todo Document");
                    error.status = 400;
                    next(error);
                }
                else
                    res.json({result : result, document : result.ops[0],msg : "Successfully inserted Todo!!!",error : null});
            });
        }
    })    
});



//delete
app.delete('/:id',(req,res)=>{
    // Primary Key of Todo Document
    const todoID = req.params.id;
    // Find Document By ID and delete document from record
    dbREST.getDB().collection(collection).findOneAndDelete({_id : dbREST.getPrimaryKey(todoID)},(err,result)=>{
        if(err)
            console.log(err);
        else
            res.json(result);
    });
});

var db;

app.get("/mongodb", (req,res) => {
    res.render("mongofile");
})
app.get("/afterMongo", (req,res) => {
    db.collection('quotes').find().toArray(function(err,results) {
        console.log("found quotes");
        console.log(results);
        res.render("afterMongo", {quotes:results});;
    }); //cursor is a mongo object
})
app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err,result) => {
        var x = JSON.stringify(req.body); //must use json.stringify, else will have typeError:Cannot convert object to primitive value
        console.dir("quotes --> " + x);
        if (err) {
            return console.log(err);
        }
        else {
            console.log("saved quotes to database mongodb");
        }
        res.redirect("/afterMongo");
    })
})
app.put("/quotes", (req,res) => {
    //Handle put request
    db.collection('quotes').findOneAndUpdate({name: 'watar'}, {
        $set: {
            name: req.body.name,
            quote: req.body.quote
        }
    }, {
        sort: {_id: -1},
        upsert: true
    }, (err, result) => {
      if (err) {
        return res.send(err)
      }
      else {
        res.send(result)
      }
    })
})
app.delete('/quotes', (req, res) => {
    // Handle delete event here
    db.collection('quotes').findOneAndDelete({name: req.body.name},
        (err, result) => {
            if (err) return res.send(500, err)
            res.send({message: 'A darth vadar quote got deleted'})
        }
    )
})

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
        //io.emit('message', req.body)
        io.emit('message', chatData);
        res.sendStatus(200)
    })
});

// Setup chat
var io = require('socket.io')(httpServer); //put cookie:false to disable cookie called io on client side.

var chatConnections = 0;
var ChatMsg = require('./server/models/chatMsg');

let onlineUsersFinal = [];
let offlineUsersFinal = [];
//let onlineU = [];
//let offlineU= [];

// io engine override socket id , but how does this work?
/*
io.engine.generateId = function(req) {
    //socket.id = cookiefinal.userid;
    console.log("req headers cookie " + cookie.parse(req.headers.cookie).userid)
    //console.log(socket.req)
    //var cookief = socket.handshake.headers.cookie;
    //var cookiefinal = cookie.parse(cookief);
    //console.log("cookie final > > > " + cookiefinal.userid)
        //return cookiefinal.userid
    return cookie.parse(req.headers.cookie).userid;
    } */
    
io.use(function(socket,next) {
    sessionMiddleware(socket.request, socket.request.res , next);
    //socket.id = cookiefinal.userid;
    //var cookief = socket.handshake.headers.cookie;
    //var cookiefinal = cookie.parse(cookief);
    //console.log("cookie final > > > " + cookiefinal.userid)
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
    
     /* 
     socket.join(socket.user_id,function() { //by default socket join its own room identified by its own socket.id
         console.log("\n socket rooms new !! " + JSON.stringify(socket.rooms)); //rooms of current socket
         console.log("room length > > " + JSON.stringify(io.sockets.adapter.rooms[socket.user_id])) //.length
         console.log("total clients " + Object.keys(io.sockets.connected)); // socket id of clients connected 
         console.log("\n total wat is tis " + JSON.stringify(io.sockets.adapter.rooms) + "\n"); // or adapter.sids , 2 rooms after joining or adapter.sids[socket.id]
         //io.sockets.adapter.rooms[socket.user_id].length += 1;
     });
     console.log("handshake \n before"  + JSON.stringify(socket.handshake.headers.cookie))
     console.log("socket session > > " + socket.user_id);
     console.log("socket cookie lolol " + cookie.parse(socket.handshake.headers.cookie).userid);
     */
     //socket.on('newUser',function() {
        // socket.user_id = userid;
     users[socket.id] = socket.user_id; // key value , previously socket.user_id = socket.user_id?
     console.log("socket id ## " + socket.id + " users object $$ " + Object.values(users));

//    if (socket.user_id != undefined) { // new if statement 8/1/2018 2.23 am when planning the google doc , to prevent error cannot set property 'status' of null
          Users.findById(socket.user_id).then(user=> {
            user.status ="online";
            user.last_login_date = Date.now();
            user.save();
            io.sockets.emit('userStatus', user.status);
            io.sockets.emit('onlineUser', socket.user_id);
            //io.sockets.emit('lastSeen', user.last_login_date);
        })
   // } // end of new if statement 8/1/2018
        console.log("\n");
        console.log(JSON.stringify(users) + " wat is user id from client - " + socket.user_id);
        console.log('\n %s sockets connected' , io.engine.clientsCount);
        console.log(Object.keys(io.engine.clients));
        //console.log(socket.request.session)
        //console.log("length before is ? " + io.sockets.adapter.rooms[socket.user_id].length);
    //})

   
    socket.on('songLikeByUserId' , function(songlikebyuser_id) {
            console.log("song love by user id===========");
            console.log(songlikebyuser_id);
            //find max id from like table --> sequelize.query("select *")
            sequelize.query("select s.user_id toUser , sl.user_id fromUser , u.name , u.userImage , s.title from Songlikes sl inner join Songs s on sl.song_id = s.id inner join Users u on sl.user_id = u.id where sl.id = (select max(id) from Songlikes)" 
             , {type:sequelize.QueryTypes.SELECT} ).then(send_to_user => {
            //sequelize.query("select distinct s.user_id from Songlikes sl inner join Songs s on sl.song_id = s.id where song_id = 2").then(send_to_user => {
                console.log("send to user >>> " + JSON.stringify(send_to_user));
                io.sockets.emit("sendToUser", send_to_user);
            });
    });
    
    // or socket.on('leave') for room leave , then disconnected aka offline?
    socket.on('disconnect',function() {
        console.log(socket.user_id + "  disconnected");   
        console.log("total rooms after disconnect>>>>>>>> " + JSON.stringify(io.sockets.adapter.sids));
        //io.sockets.adapter.rooms[socket.user_id].length = io.sockets.adapter.rooms[socket.user_id].length - 1;
        //find user by id , then put status offline , then delete from object only when browser close??
        //delete users[socket.id]; // if users[socket.id] = socket.user_id then must delete users[socket.id] to work.
        // wan to delete only when browser close!!! , if room gone(?)
            console.log(' %s sockets connected after --------- ' , io.engine.clientsCount);
            console.log(Object.keys(io.engine.clients));
        
            //if (io.sockets.adapter.rooms[socket.user_id] ===  {}) {
            //if ( Object.values(users).indexOf(socket.user_id) <=0) {
              //  if (socket.user_id != undefined) {
                Users.findById(socket.user_id).then(user=> {
                user.status = "offline";
                user.last_login_date = Date.now();
                user.save();
                io.sockets.emit('userStatus', user.status);
                io.sockets.emit('onlineUser', socket.user_id);    
                
                })
            //}
            
           // }
               
            
        //console.log(socket.handshake);
            //}
            
        console.log("handshake \n after"  + JSON.stringify(socket.handshake.headers.cookie))   
        console.log("socket cookie lolol " + cookie.parse(socket.handshake.headers.cookie).userid);
        console.log(JSON.stringify(users) + " <<<<<< user DELETED FINALLYS ")
        console.log("socket request.session.useridhehe after disconn " + socket.request.session.useridhehe);
                
        console.log("\n socket rooms after !! " + JSON.stringify(socket.rooms));
        console.log(io.sockets.adapter.rooms[socket.user_id]);
        console.log("room length > > " + JSON.stringify(io.sockets.adapter.rooms[socket.user_id])) //.length
        console.log("total clients " + Object.keys(io.sockets.connected)); // socket id of clients connected 
        console.log("socket id after ## " + socket.id + " users object $$ " + Object.values(users));
    
     
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

const assert = require('assert');
const mongooseATLAS = require("mongoose");

var server = httpServer.listen(app.get('port'), function () {
    console.log('http server listening on port ' + server.address().port);
    
    mongooseATLAS.connect(
        //"mongodb+srv://nodeuser:nodepwd@opencodez-pzgjy.gcp.mongodb.net/test?retryWrites=true",
        "mongodb+srv://mongodbuser:mongodbpassword@cluster0-mnf7x.mongodb.net/mongoCLOUD?retryWrites=true",
        { 
            useNewUrlParser: true
        }
    );
    const dbMongooseATLAS = mongooseATLAS.connection;
    dbMongooseATLAS.on('error', console.error.bind(console, 'connection error to db monoogse CLOUD ATLAS:'));
    dbMongooseATLAS.once('open', function() {
    // we're connected!
        console.log("\n Connected to MongoDB database CLOUD MONGOOSE ATLAS"); 
    });

    dbREST.connect((err) => {
        if (err) {
            console.log("mongo restful db fail to connect");
        }
        else{
            console.log("restful connection successful to mongodb community edition - cmd prompt mongo.exe thro/compass?");
            //findAllDocuments(dbREST) NOTE: add mongo bin folder to path environment variable, so can run mongo in cmd/anywhere
        }
    })

    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect('mongodb://itp211mongodbname:itp211mongodbpassword@ds223685.mlab.com:23685/itp211mongodbname', (err, client) => {
      // ... start the server   
        if (err) {
            console.log("FAIL CONNECTION TO MONGODB");
            return console.log("ERRR " + err);
        }
        else{
            console.log("CLIENT CONNECT MONGO FINAL");
            db = client.db('itp211mongodbname');
            insertDocuments(db, function() {
                indexCollection(db, function() {
                    findDocuments(db, function() {
                        removeDocument(db, function(success) {
                            console.log("in middle of deleting -->  + " + success);
                            //client.close()
                        })
                    })
                })
            })
        }
    })
});

const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
      {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
      assert.equal(err, null);
      assert.equal(3, result.result.n);
      assert.equal(3, result.ops.length);
      console.log("Inserted 3 documents into the collection");
      callback(result);
    });
}
const findDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      console.log(docs)
      callback(docs);
    });
    collection.find({'a': 3}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found records with value a : 3");
        console.log(docs);
        callback(docs);
    });
}
const removeDocument = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Delete document where a is 3
    var ids = [1, 2, 3] 
    var myquery = { a: { $in: ids} };
    //collection.deleteOne({ a : 3 }, function(err, result) {
    collection.deleteMany(myquery, function(err, result) {
        assert.equal(err, null);
        //assert.equal(1, result.result.n);
        console.log(JSON.stringify(result.result.n));
        console.log("result --> " + result);
        console.log("success delete!!!")
        callback(result);
    })
}
const indexCollection = function(db, callback) {
    db.collection('documents').createIndex(
      { "a": 1 },
        null,
        function(err, results) {
            console.log("indexing----");
            console.log(results);
            callback();
        }
    );
};