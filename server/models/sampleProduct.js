var myDatabase = require('../controllers/database');
var sequelizeInstance = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Product = sequelizeInstance.define('Product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    rating: {
        type: Sequelize.DECIMAL(10,2)
    },
    ratingCount:{
        type: Sequelize.INTEGER
    },
    quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    productLikeNo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    productListingName: {
        type: Sequelize.STRING,
        allowNull: false,
        trim:true
    },
    productListingType: {
        type: Sequelize.STRING,
        allowNull:false
    },
    productListingCondition: {
        type: Sequelize.STRING,
        allowNull: false
    },
    productTags: {
        type: Sequelize.STRING,
        trim:true
    },
    pricing: {
        type: Sequelize.DECIMAL(10,2)
    },
    imageName: {
        type: Sequelize.STRING,
        trim:true
    },
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
})

Product.sync({ force: false, logging: console.log }).then(() => {
    console.log("Product table synced");
    Product.upsert({
        id: 1,
        quantity: 1,
        productListingName: "European tone wood violin",
        productListingType: "Violin",
        productListingCondition: "new",
        productTags: "european wood violin",
        pricing: 1119,
        imageName: "violinQuality.jpg",
        user_id: 1
    });
    Product.upsert({
        id: 2,
        quantity: 2,
        productListingName: "Yamaha Electronic Drum DTX562K",        
        productListingType: "Drum",
        productListingCondition: "new",
        productTags: "brand new, yamaha drum, for kids",
        pricing: 2220.00,
        imageName: "yamahaDrum.jpg",
        user_id: 1
    });
    Product.upsert({
        id: 3,
        quantity: 3,
        productListingName: "Yamaha f310 guitar 10/10 condition", 
        productListingType: "Guitar",
        productListingCondition: "new",
        productTags: "brand new, 10/10 condition",
        pricing: 3373.00,
        imageName: "guitar.jpg",
        user_id: 1
    });

    Product.upsert({
        id: 4,
        quantity: 4,
        productListingName: "gammon drum (green color)", 
        productListingType: "Drum",
        productListingCondition: "new",
        productTags: "gammon drum,green,new condition",
        pricing: 419.00,
        imageName: "gammon drum green.jpg",
        user_id: 2
    })
    Product.upsert({
        id: 5,
        quantity: 5,
        productListingName: "gammon drum (black color)", 
        productListingType: "Drum",
        productListingCondition: "old",
        productTags: "black,gammon drum,old condition 4/10",
        pricing: 525.00,
        imageName: "gammon drum.jpg",
        user_id: 2
    })
    Product.upsert({
        id: 6,
        quantity: 6,
        productListingName: "gammon drum (red color)", 
        productListingType: "Drum",
        productListingCondition: "old",
        productTags: "gamm drum,red",
        pricing: 666.00,
        imageName: "gammon red drum.jpg",
        user_id: 2
    })
    Product.upsert({
        id: 7,
        quantity: 7,
        productListingName: "Bulgarian 4/4 Full Size Violin, 2013", 
        productListingType: "Violin",
        productListingCondition: "new",
        productTags: "bulgarian violin, full size",
        pricing: 777.00,
        imageName: "violinTest.jpg",
        user_id: 2
    })
    Product.upsert({
        id: 8,
        quantity: 8,
        productListingName: "Rare Jason Kostal Guitars", 
        productListingType: "Guitar",
        productListingCondition: "old",
        productTags: "very rare, Jason Kostal, guitar",
        pricing: 88.50,
        imageName: "guitar test.png",
        user_id: 2
    });

    Product.upsert({
        id: 9,
        quantity:9,
        productListingName: "Gretsch Broadkaster Gold Duco Limited Edition",
        productListingType: "Drum",
        productListingCondition: "new",
        productTags: "limited edition, gretsch gold",
        pricing: 2999.00,
        imageName: "qualityDrum.jpg",
        user_id: 2
    });
    Product.upsert({
        id:10,
        quantity: 10,
        productListingName: "Sakae Almighty 10pc Blood Red Finish",
        productListingType: "Drum",
        productListingCondition: "new",
        productTags: "sakae almighty, red",
        pricing: 2599.00,
        imageName: "qualityDrum2.jpg",
        user_id:2
    });

});

module.exports = sequelizeInstance.model('Product', Product);