const express = require("express");
const User = require("../models/UserMongoose");
const mongoose = require("mongoose");


const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).json({
        message:"Serving Users on the Endpoint."
    });   
});

router.get("/list", (req, res, next) => {
    console.log("getting list..?");
    User.find({})
        .exec()
        .then(docs => {
            console.log("DOCS ???? " + docs);
            res.status(200).json({
                docs
            });
        })
        .catch(err => {
            console.log("ERROR retirveing");
            console.log(err)
        });
    console.log("end of getting list..");
});

router.post("/add", (req, res, next) => {
    console.log("adding now.... or no?");
    console.log("req body of add = " + JSON.stringify(req.body));
    const user = new User({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        address:req.body.address,
        salary: req.body.salary
    });

    user.save()
    .then(result => {
        console.log("success!!! result");
        res.status(200).json({
            docs:[user]
        });
    })
    .catch(err => {
        console.log("ERRR ADD");
        console.log(err);
    });
});

router.post("/delete", (req, res, next) => {
    const deletedID = req.body.id;
    console.log("deleted id " + deletedID);
    User.findById(deletedID)
        .exec()
        .then(docs => {
            docs.remove();
            res.status(200).json({
                deleted:true
            });
        })
        .catch(err => {
            console.log(err)
        });
});

//TODO: HACK: FIXME: BUG: NOTE: update .put, controller and javascript
router.put("/edit", (req, res) => {
    const editID = req.body.id;
    console.log("EDIT ID IN CONTROLLER --> " + editID);
    console.log("req body --> " + JSON.stringify(req.body)); //if don't use json.stringify, function stops here.. 500 status error in console
    var dynamicQuery = {};
    Object.keys(req.body).forEach(key => {
        console.log("Key in object req body = " + key + " value --> " + req.body[key]);
        if (req.body[key] != "") {
            console.log("   UPDATE KEY : " + key + " NEW VALUE = " + req.body[key]);
            dynamicQuery[key] = req.body[key];
        }
    })
    console.log("dynamic query --> " , JSON.stringify(dynamicQuery));
    //User.findByIdAndUpdate(editID, {salary:999}, {new:true}).then(docs => {
    //User.findByIdAndUpdate(editID, req.body, {new:true}).then(docs => { //update the whole user again, fields empty will be ""
    User.findByIdAndUpdate(editID, {$set:dynamicQuery}, {new:true}).then(docs=> { //NOTE: dynamic query, update only fields that changed
        console.log("found id and updated docs ---> " + JSON.stringify(docs));
        res.status(200).json({
            //edited:true
            docs
        });
    }).catch(err => {
        console.log("error updating!!! " + err);
        res.status(500).json({
            validation:false
        })
    });
});

module.exports = router;