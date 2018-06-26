var StudentModel = require('../models/studentModel');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;


//Add a new  student record to database
exports.insert = function(req,res) {
    var studentData = {
        studentId: req.body.studentId,
        name: req.body.studentName,
        group: req.body.group,
        hobby: req.body.hobby
    }

    StudentModel.create(studentData).then((newRecord, created) => {
        if (!newRecord) {
            return res.send(400, {
                message : "error"
            });
        }
        res.redirect('/p5db');
    })
};


//list all the students records in database
exports.list = function(req,res) {
    StudentModel.findAll({
        attributes: ['id','studentId','name','group','hobby']
    }).then(function (students) {
        res.render('p5db', {
            title: "Practical 5 Database Node JS - Student Records",
            itemList: students,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};


//List one specific student record from database
exports.editRecord = function(req,res) {
    var record_num = req.params.id;
    StudentModel.findById(record_num).then(function (studentRecord) {
        res.render('editRecord', {
            title: "Practical 5 Database Node JS - Edit Student Record!",
            item: studentRecord,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};


//  Update student record in database
exports.update = function (req,res) {
    var record_num = req.params.id;
    var updateData = {
        studentId : req.body.studentId,
        name: req.body.name,
        group: req.body.group,
        hobby: req.body.hobby
    }

    StudentModel.update(updateData, { where: { id: record_num } }).then((updatedRecord) => {
        if (!updatedRecord || updatedRecord == 0) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Updated student record:" + record_num});
    })
}

// delete student record from database
exports.delete = function(req,res) {
    var record_num = req.params.id;
    console.log("deleting " + record_num);
    
    StudentModel.destroy({where: { id: record_num} }).then((deletedRecord) => {
        if (!deletedRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Deleted student record: " + record_num});
    })
}