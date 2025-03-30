const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    }
});

// const userModel = mongoose.model('user', userSchema); ==>> also can be done as this.
module.exports = mongoose.model('user', userSchema);


// schema means sceleton, in mySQL we have table, the structure of table in SQL is equal to the,
// in Mongo DB we have collection, so the stucture of collection is nothing but the schema.