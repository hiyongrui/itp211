var myDatabase = require('../controllers/database');
var sequelizeInstance = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const ProductTag = sequelizeInstance.define('ProductTag', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    product_id: {
        type: Sequelize.INTEGER
    },
    productTags: {
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

ProductTag.sync({ force: false, logging: console.log }).then(() => {
    console.log("Product tag table synced");
    ProductTag.upsert({
        id: 1,
        product_id: 1,
        productTags: "european wood violin",
        user_id: 1
    });
    ProductTag.upsert({
        id: 2,
        product_id: 2,
        productTags: "brand new",
        user_id: 1
    });
    ProductTag.upsert({
        id:3,
        product_id: 2,
        productTags: "yamaha drum",
        user_id: 1
    });
    ProductTag.upsert({
        id:4,
        product_id: 2,
        productTags: "for kids",
        user_id: 1
    });

    ProductTag.upsert({
        id: 5,
        product_id: 3,
        productTags: "brand new",
        user_id: 1
    });
    ProductTag.upsert({
        id:6,
        product_id: 3,
        productTags: "10/10 condition",
        user_id: 1
    });


    ProductTag.upsert({
        id: 7,
        product_id: 4,
        productTags: "gammon drum",
        user_id: 2
    });
    ProductTag.upsert({
        id: 8,
        product_id: 4,
        productTags: "green",
        user_id: 2
    });
    ProductTag.upsert({
        id: 9,
        product_id: 4,
        productTags: "new condition",
        user_id: 2
    });

    ProductTag.upsert({
        id: 10,
        product_id: 5,
        productTags: "black",
        user_id: 2
    });
    ProductTag.upsert({
        id: 11,
        product_id: 5,
        productTags: "gammon drum",
        user_id: 2
    });
    ProductTag.upsert({
        id: 12,
        product_id: 5,
        productTags: "old condition 4/10",
        user_id: 2
    });

    ProductTag.upsert({
        id: 13,
        product_id: 6,
        productTags: "gamm drum",
        user_id: 2
    });
    ProductTag.upsert({
        id: 14,
        product_id: 6,
        productTags: "red",
        user_id: 2
    });

    ProductTag.upsert({
        id: 15,
        product_id: 7,
        productTags: "bulgarian violin",
        user_id: 2
    });
    ProductTag.upsert({
        id: 16,
        product_id: 7,
        productTags: "full size",
        user_id: 2
    });

    ProductTag.upsert({
        id: 17,
        product_id: 8,
        productTags: "very rare",
        user_id: 2
    });
    ProductTag.upsert({
        id: 18,
        product_id: 8,
        productTags: "Jason Kostal",
        user_id: 2
    });
    ProductTag.upsert({
        id: 19,
        product_id: 8,
        productTags: "guitar",
        user_id: 2
    });

    ProductTag.upsert({
        id:20,
        product_id: 9,
        productTags: "limited edition",
        user_id: 2
    })
    ProductTag.upsert({
        id:21,
        product_id: 9,
        productTags: "gretsch gold",
        user_id: 2
    })

    ProductTag.upsert({
        id:22,
        product_id: 10,
        productTags: "sakae almighty",
        user_id: 2
    })
    ProductTag.upsert({
        id:23,
        product_id: 10,
        productTags: "red",
        user_id: 2
    })
    
});

module.exports = sequelizeInstance.model('ProductTag', ProductTag);