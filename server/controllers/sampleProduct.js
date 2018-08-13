var StudentModel = require("../models/studentModel")
var Product = require('../models/sampleProduct');
var Cart = require('../models/cart');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

var fs = require('fs');
var mime = require('mime');

// set image file types
var IMAGE_TYPES = ['image/jpeg' , 'image/jpg' , 'image/png'];

var Images = require('../models/images');

var Songs = require('../models/songs');

var ProductTag = require('../models/productTags');

var viewProductHistory = require("../models/viewProductHistory");
/* 
Images.findAll({
    attributes: ['id','title','content','user_id'],
    include: { model : Comments}
}).then(function(images,comments) {
    res.render('images-gallery', {
        title:'Comments Page',
        images: images,
        comments: comments
    });

})  */



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

    // save file process   , #listen for stream completion event
    src.on('end',function () {
        //create a new instance of the Images model with request body   
        var productData = {
            productListingName: req.body.productListingName,
            productListingType: req.body.productListingType,
            quantity: req.body.quantity,
            productListingCondition: req.body.optionCondition,
            productTags: req.body.productTags,
            pricing: req.body.pricing,
            imageName: req.file.originalname,
            user_id: req.user.id
        }            
        console.log("creating product data ------- " + JSON.stringify(productData));
        console.log("product tags >>>>>>>    " + productData.productTags);
        
        //save to database
        Product.create(productData).then((newRecord, created) => {
            console.log("in process of creating ---- " + JSON.stringify(newRecord));
            console.log("\n new record id is >> " + newRecord.id);

            if (productData.productTags != undefined) {
                console.log("highest prod id now >>>   " + newRecord.id);
                for (i=0; i<productData.productTags.length; i++) {
                    var productTagData = {
                        product_id: newRecord.id,
                        productTags: productData.productTags[i],
                        user_id: productData.user_id
                    }
                    console.log("hi tag --  " + i  + " " + productData.productTags[i]);
                    console.log("product tag data >> " + JSON.stringify(productTagData));
                    ProductTag.create(productTagData).then(createdTags => {
                        console.log(" created tags ------   " + JSON.stringify(createdTags));
                    })
                }
            }

            if (!newRecord) {
                return res.send(400, {
                    message: "error"
                });
            }

            res.redirect('/products');
        })


        sequelize.query("select max(id) + 1 from Products").then(latestProductId => {
            console.log("latest product id is....  " + JSON.stringify(latestProductId));
        })


        // remove from temp folder
        fs.unlink(tempPath, function (err) {
            if (err) {
                return res.status(500).send('Something bad happened here');
            }
            // Redirect to gallery's page
            //res.redirect('images-gallery');
        });
    });
};

// Images authorisation middleware
exports.hasAuthorization = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

exports.list = function (req, res) {
    console.log("viewing products all ");
    console.log(" req query " + JSON.stringify(req.query));
    console.log("req param " + JSON.stringify(req.params));
    console.log("page -->  " + req.query.page);
    var pageToLimit = (req.query.page * 9) - 9;
    console.log("page to limit ====  " + pageToLimit);
    sequelize.query("select * from Products limit :limitNo,9", 
    {replacements: {limitNo: pageToLimit}, type: sequelize.QueryTypes.SELECT} ).then(products => {
        sequelize.query("select * from Products", {type: sequelize.QueryTypes.SELECT} ).then(totalProducts => {
            console.log("total prod \n " + JSON.stringify(totalProducts.length));
            console.log(totalProducts);
            res.render('sampleProduct', {
                title: "Product Listing",
                itemList: products,
                totalProducts: totalProducts,
                urlPath: req.protocol + "://" + req.get("host") + req.url,
                hostPath: req.protocol + "://" + req.get("host"),
            });
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

exports.delete = function (req, res) {
    var record_num = req.params.id;
    console.log("deleting " + record_num);
    Product.destroy({ where: { id: record_num } }).then((deletedRecord) => {
        Cart.destroy({ where: { product_id: record_num } }).then((deletedCart) => {
        ProductTag.destroy({ where: {product_id: record_num} }).then((deletedTag) => {
        if (!deletedRecord && !deletedCart && !deletedTag) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Deleted product record id : " + record_num });
    });
    });
});
};

exports.viewOneProduct = function(req,res) {
    var thisProductId = req.params.id;

    console.log("req cookie viewing one product " + JSON.stringify(req.cookies));
    console.log("req user >> " + req.user);

    if (req.user) {
        console.log("req user is not undefined hahahaha" + req.user.name);

        var addIntoViewProductHistory = {
            product_id: thisProductId,
            user_id: req.user.id
        };

        sequelize.query("select product_id , user_id from ViewProductHistories", {type: sequelize.QueryTypes.SELECT} ).then(async isItIn => {
            console.log("this product id ------------> " + thisProductId);
            console.log("this current user that view ^^^^  " + req.user.id);
            console.log("selecting all the product id from isitin");
            console.log(JSON.stringify(isItIn));
            console.log("\n length of this whole database view product history array is " + isItIn.length);
            for (i=0; i<isItIn.length; i++) {
                if ((isItIn[i].product_id == thisProductId) && (isItIn[i].user_id == req.user.id)) {
                    console.log("is it in is found " + JSON.stringify(isItIn));
                    await viewProductHistory.destroy({ where: {product_id: isItIn[i].product_id, user_id: isItIn[i].user_id }}).then(removeFromViewProductHistory => {
                        console.log("deleted this remove " + JSON.stringify(removeFromViewProductHistory));
                    })
                }
            }
            await viewProductHistory.create(addIntoViewProductHistory).then(createNewProductHistoryAgain => {
                console.log("creatng product hist!!!");
                console.log(JSON.stringify(createNewProductHistoryAgain));
            });

            await sequelize.query("select * from Products p inner join Users u on p.user_id = u.id where p.id = :id", 
            {replacements: {id: thisProductId} , type:sequelize.QueryTypes.SELECT }).then(thisProduct => {
                sequelize.query("select * from ViewProductHistories vph inner join Products p on vph.product_id = p.id where vph.user_id = :currentUserId",
                {replacements: {currentUserId: req.user.id}, type: sequelize.QueryTypes.SELECT}).then(pastProductViewed => {
                    sequelize.query("select count(*) count from Products where user_id = :countProductOfThisUser",
                    {replacements: {countProductOfThisUser: thisProduct[0].user_id}, type: sequelize.QueryTypes.SELECT }).then(countProductOfUser=> {
                        sequelize.query("select * from Products where productListingType = :sameType and id <> :notThisId order by id desc",
                        {replacements: {sameType: thisProduct[0].productListingType, notThisId: thisProductId} , type: sequelize.QueryTypes.SELECT }).then(sameProducts => {
                    //console.log("this specific product im viewing now -->  " + JSON.stringify(thisProduct,null,2));
                            console.log(thisProduct.length);
                            console.log("THIS PROD " + JSON.stringify(thisProduct));
                            console.log("count prod of tis user --- \n " + JSON.stringify(countProductOfUser));
                            console.log("same prods ++ \n " + JSON.stringify(sameProducts,null,2));
                            console.log("this prod id " + thisProduct[0].id + " and prod type " + thisProduct[0].productListingType);
                            res.render("thisProduct", {
                                thisProduct: thisProduct,
                                pastProductViewed: pastProductViewed,
                                sameProducts: sameProducts,
                                countProductOfUser: countProductOfUser
                            })
                        });
                    });
                });
            });
        })

   
    } //end of if req.user();
    else{
        console.log("\n roflmao 500 status gay");
        console.log("req cookie sid " + req.cookies["connect.sid"]);

        var addIntoViewProductHistory = {
            product_id: thisProductId,
            user_id: -1,
            connect_sid: req.cookies["connect.sid"]
        }

        console.log("\n -- ADD INTO VIEW PRODUCT IF USER IS NOT LOGGED IN COOKIE " + JSON.stringify(addIntoViewProductHistory));
        
        sequelize.query("select product_id , user_id from ViewProductHistories", {type: sequelize.QueryTypes.SELECT} ).then(async historyForAllUser => {
            console.log("selecting all history for current non logged in user ");
            console.log(JSON.stringify(historyForAllUser));
            console.log("\n length of this all user database product view histor ");
            for (i=0; i<historyForAllUser.length; i++) {
                if ((historyForAllUser[i].product_id = thisProductId) && (historyForAllUser[i].connect_sid = req.cookies["connect.sid"])) {
                    console.log("history for all ========== > " + JSON.stringify(historyForAllUser,null,2));
                    await viewProductHistory.destroy({ where: {product_id: historyForAllUser[i].product_id, connect_sid: historyForAllUser[i].connect_sid }}).then(removeFromViewProductHistory => {
                        console.log("\n deleting non logged in user connect sid " + req.cookies["connect.sid"]);
                        console.log("\n deleting this history for this non logged in user ---> " + JSON.stringify(removeFromViewProductHistory));
                    })
                }
            }
            await viewProductHistory.create(addIntoViewProductHistory).then(createNewProductHistoryAgain => {
                console.log("creating prod history for non logged in user !!! " + req.cookies["connect.sid"]);
                console.log(JSON.stringify(createNewProductHistoryAgain));
            })

            await sequelize.query("select * from Products p inner join Users u on p.user_id = u.id where p.id = :id", 
            {replacements: {id: thisProductId} , type:sequelize.QueryTypes.SELECT }).then(thisProduct => {
                sequelize.query("select * from ViewProductHistories vph inner join Products p on vph.product_id = p.id where connect_sid = :currentConnectId",
                {replacements: {currentConnectId: req.cookies["connect.sid"]}, type: sequelize.QueryTypes.SELECT }).then(pastProductViewed => {
                    sequelize.query("select count(*) count from Products where user_id = :countProductOfThisUser",
                    {replacements: {countProductOfThisUser: thisProduct[0].user_id}, type: sequelize.QueryTypes.SELECT }).then(countProductOfUser=> {
                        sequelize.query("select * from Products where productListingType = :sameType and id <> :notThisId order by id desc",
                        {replacements: {sameType: thisProduct[0].productListingType, notThisId: thisProductId} , type: sequelize.QueryTypes.SELECT }).then(sameProducts => {
                            //console.log("this specific product im viewing now -->  " + JSON.stringify(thisProduct,null,2));
                            console.log(thisProduct.length);
                            console.log(pastProductViewed.length);
                            console.log("\n past product viewed " + JSON.stringify(pastProductViewed));
                            res.render("thisProduct", {
                                thisProduct: thisProduct,
                                pastProductViewed: pastProductViewed,
                                sameProducts: sameProducts,
                                countProductOfUser: countProductOfUser
                            })
                        })
                    })
                })
            });
        })
        

    } //end of else statement

} //end of function viewOneProduct()