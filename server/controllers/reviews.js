var fs = require('fs');
var mime = require('mime');

var IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

//get Reviews model
var Reviews = require('../models/reviews');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

var Products = require("../models/sampleProduct");
var Users = require("../models/users");

exports.list = function (req, res) {
    // List all reviews and sort by date
    sequelize.query('select r.id, r.title, r.content, r.rating, r.imageName, r.createdAt, u.name\
    from Reviews r inner join Users u on r.user_id = u.id', { type: sequelize.QueryTypes.SELECT }).then(reviews => {
            console.log("reviews list --> " + JSON.stringify(reviews));
            // or Select * from Reviews
            res.render('reviews', {
                title: 'Reviews Page',
                reviews: reviews
            })
        }).catch((err) => {
            return res.status(400).send({
                message: err
            });
        });
};

// Image upload
exports.insert = function (req, res) {
    var src;
    var dest;
    var targetPath;
    var targetName;
    var tempPath = req.file.path;
    console.log("SMLJ IS REQ FILE " + req.file);

    //get mime type of file
    var type = mime.lookup(req.file.mimetype);

    //get file extension
    var extension = req.file.path.split(/[. ]+/).pop();

    // check support file types
    if (IMAGE_TYPES.indexOf(type) == -1) {
        return res.status(415).send('Supported image formats: jpeg, jpg, jpe, png');
    }

    // set new path to images
    targetPath = './public/images/' + req.file.originalname;

    // using read stream API to read file;
    src = fs.createReadStream(tempPath);

    // using write stream API to write file
    dest = fs.createWriteStream(targetPath);
    src.pipe(dest);   //copy data from tempPath to targetPath aka ./public/images/ + name of file

    // Show error  , #listen for error event
    src.on('error', function (err) {
        if (err) {
            return res.status(500).send({
                message: error
            });
        }
    });

    console.log("target path --- " + targetPath);
    // save file process   , #listen for stream completion event
    src.on('end', function () {
        //create a new instance of the Images model with request body   
        console.log("src end --- - - - - - ");
        var reviewData = {
            product_id: req.body.product_id,
            title: req.body.title,
            content: req.body.content,
            //imageName: req.body.imageName,
            imageName: req.file.originalname,
            rating: req.body.rating,
            user_id: req.user.id
        }
        console.log("review data on end ----  " + JSON.stringify(reviewData));
        //save to database
        Reviews.create(reviewData).then(async newRecord => {
             await sequelize.query("select *, sum(rating)/count(*) calculated , count(*) counter from Reviews where product_id = :id group by product_id",
                { replacements: { id: reviewData.product_id }, type: sequelize.QueryTypes.SELECT }).then(latestReview => {
                    console.log("latest review found ---- " + JSON.stringify(latestReview) + "\n");
                    console.log("latest review calculated " + latestReview[0].calculated);
                    console.log("\n latest review counter --> " + latestReview[0].counter);
                     Products.findById(reviewData.product_id).then(updateProductRating => {
                        console.log("update this product rating -->  " + JSON.stringify(updateProductRating));
                        updateProductRating.rating = latestReview[0].calculated;
                        updateProductRating.ratingCount = latestReview[0].counter;
                        updateProductRating.save();
                        console.log("after saving -------- \n ");
                        console.log(JSON.stringify(updateProductRating));
                    })
                });
                      await sequelize.query("select distinct p.user_id from Reviews r inner join Products p on r.product_id = p.id where r.product_id = :changeId",
                    {replacements: {changeId: reviewData.product_id }, type: sequelize.QueryTypes.SELECT }).then(async changeUser => {
                     await sequelize.query("select u.id , sum(rating*ratingCount) / sum(ratingCount) gg from Products p inner join Users u on p.user_id = u.id where p.user_id = :findUserId",
                    {replacements: {findUserId: changeUser[0].user_id} , type: sequelize.QueryTypes.SELECT }).then(async latestUser => {
                        console.log("change user \n " +JSON.stringify(changeUser));
                        
                         await Users.findById(latestUser[0].id).then(updateUserRating => {
                            console.log("\n user rating --- \n " + JSON.stringify(updateUserRating));
                            console.log("\n latest user >>> \n " + JSON.stringify(latestUser));
                            updateUserRating.userRating = latestUser[0].gg;
                            updateUserRating.save();
                            console.log("after saving update user ----\n " + JSON.stringify(updateUserRating));
                     
                    })
                })
            });
            if (!newRecord) {
                return res.send(400, {
                    message: "error"
                });
            }
            res.redirect('/reviews');
        })
        // remove from temp folder
        fs.unlink(tempPath, function (err) {
            if (err) {
                return res.status(500).send('Something bad happened here');
            }
        });
    });
};




exports.delete = function (req, res) {
    var record_num = req.params.reviews_id;
    console.log("deleting reviews" + record_num);

    sequelize.query("select * , sum(rating)/count(*) calculated , count(*) counter from Reviews where id = :recordNum",
        { replacements: { recordNum: record_num }, type: sequelize.QueryTypes.SELECT }).then(async findProductAffected => {

             await Reviews.destroy({ where: { id: record_num } }).then((deletedReview) => {
                console.log("deleting this review ---- > " + JSON.stringify(deletedReview));

                if (!deletedReview) {
                    return res.send(400, {
                        message: "error"
                    });
                }
            })
             await sequelize.query("select * from Reviews where product_id = :checkId", {replacements: {checkId: findProductAffected[0].product_id}, type: sequelize.QueryTypes.SELECT}).then(async checkIfExist => {
                 console.log("check if exist " + JSON.stringify(checkIfExist));
                if (checkIfExist !="") {
                    console.log("prod still have reviews " + JSON.stringify(checkIfExist));
                      sequelize.query("select * , sum(rating)/count(*) calculated , count(*) counter from Reviews where product_id = :id group by product_id",
                        { replacements: { id: findProductAffected[0].product_id }, type: sequelize.QueryTypes.SELECT }).then(async latestReviewForThisProduct => {
                            console.log("\n latest review for tis prod \n " + JSON.stringify(latestReviewForThisProduct));
                          await Products.findById(latestReviewForThisProduct[0].product_id).then( updatingProductNow => {

                            console.log("\n before deleting review ---> \n " + JSON.stringify(updatingProductNow));
                            updatingProductNow.rating = latestReviewForThisProduct[0].calculated;
                            updatingProductNow.ratingCount = latestReviewForThisProduct[0].counter;
                            updatingProductNow.save();
                            console.log("\n after deleting review , product state finally --> \n " + JSON.stringify(updatingProductNow));
                          });
                            await sequelize.query("select distinct p.user_id from Reviews r inner join Products p on r.product_id = p.id where r.product_id = :changeId",
                            {replacements: {changeId: findProductAffected[0].product_id} , type: sequelize.QueryTypes.SELECT }).then( changeUser => {
                                 sequelize.query("select u.id , sum(rating*ratingCount) / sum(ratingCount) updatesUser from Products p inner join Users u \
                                on p.user_id = u.id where p.user_id = :findUserId group by user_id", {replacements: {findUserId: changeUser[0].user_id}, type: sequelize.QueryTypes.SELECT }).then(findUser => {
                                    
                               Users.findById(findUser[0].id).then(updatedUser => {

                            console.log("updating user before deleting review \n " + JSON.stringify(updatedUser));
               
                            updatedUser.userRating = findUser[0].updatesUser;
                            updatedUser.save();
                            console.log("change user  \n " + JSON.stringify(changeUser));
                            console.log("found user to update after review deleted " + JSON.stringify(findUser));
                    
                            console.log("updated user after review deleted " + JSON.stringify(updatedUser));
                        })
                    });
                    })
                    });
                    
                }
                else{
                    Products.findById(findProductAffected[0].product_id).then(async updatingProductRatingToNone => {
                        console.log("deleting review ,n o more review for prodssss " + JSON.stringify(updatingProductRatingToNone));
                        updatingProductRatingToNone.rating = 0;
                        updatingProductRatingToNone.ratingCount = 0;
                        updatingProductRatingToNone.save();
                        console.log("after saving review deletion \n " + JSON.stringify(updatingProductRatingToNone));
                        Products.findById(findProductAffected[0].product_id).then(async updateProductRatingWorking => {
                            console.log("upda prod finally workin \n + " + JSON.stringify(updateProductRatingWorking));
                            await sequelize.query("select u.id , sum(rating* ratingCount) / sum(ratingCount) updateUser from Products p inner join Users u\
                            on p.user_id = u.id where p.user_id = :findUserId group by user_id", {replacements: {findUserId: updateProductRatingWorking.user_id}, type: sequelize.QueryTypes.SELECT }).then(findUser => {
                                console.log("find user is it [0] or no \n " + JSON.stringify(findUser));
                                Users.findById(findUser[0].id).then(updatedUser => {
                                    if (!findUser[0].updateUser) {
                                        updatedUser.userRating = 0;
                                        updatedUser.save();
                                    }
                                    else{
                                        updatedUser.userRating = findUser[0].updateUser;
                                        updatedUser.save();
                                    }
                                    console.log("found user for review " + JSON.stringify(findUser));
                                    console.log("deleting review ,n o more review for prod " + JSON.stringify(updatingProductRatingToNone));
                                    console.log("updated user " + JSON.stringify(updatedUser));
                    })
                    });
                    })
                    })
                }
            });
                console.log("find prod affected \n " + JSON.stringify(findProductAffected));

             
                res.status(200).send({ message: "Deleted reviews : " + record_num });

        })


}

exports.viewReviewsOfThisUser = function (req, res) {
    var theUserIdYouViewing = req.params.user_id;
    console.log("user id that u wan to view review is ... " + theUserIdYouViewing);

    sequelize.query("select * from Reviews r inner join Users u on r.user_id = u.id where user_id = :id", { replacements: { id: theUserIdYouViewing }, type: sequelize.QueryTypes.SELECT }).then(reviews => {
        console.log("successfully view review.. ");
        console.log(reviews);
        res.render("viewReviewsOfThisUser", {
            reviews: reviews
        })
    })
}

// reviews authorization middleware
exports.hasAuthorization = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect("/login");

};