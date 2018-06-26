

var lessons = require('../models/lessons');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;


// List lessons
exports.show = function (req, res) {
    sequelize.query('select v.id, v.title, v.videoName, u.email AS user_id from Videos v join Users u on v.user_id = u.id', { model: lessons }).then((lessons) => {

        res.render('lessons', {
            title: 'Lessons Page',
            lessons: lessons,
            
        });
    
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

// Lessons authorization middleware
exports.hasAuthorization = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};