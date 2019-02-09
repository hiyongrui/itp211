const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    address: String,
    salary : Number
});

var UserModel = mongoose.model("User", userSchema); //model User references to the collection name in the MongoDB Atlas database.
                        //NOTE: even though mongodb auto append 's' in "Userzzz", "Userzzz" or "Userzzzs" are both working.
module.exports = UserModel;