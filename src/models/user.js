const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: 4,
        maxLength: 255,
        required: true // ==>> now our 1st name becomes manadatary filed
    },
    lastName: {
        type: String,
        required: true 
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true//==>> this will not allow same email id of the multiple users, now each and every user must have unique email id.
    },
    password: {
        type: String,
        required: true 
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String
    },
    photo : {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pnrao.com%2F%3Fattachment_id%3D8917&psig=AOvVaw3YCvuAnmRnVTRmj0OJAsWt&ust=1743437629587000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMiX27WZsowDFQAAAAAdAAAAABAE"
    },
    about: {
        type: String,
        default: "This is the defult Bio of the user!"
    }
}, 
{ timestamps: true }
);

// const userModel = mongoose.model('user', userSchema); ==>> also can be done as this.
module.exports = mongoose.model('user', userSchema);


// schema means sceleton, in mySQL we have table, the structure of table in SQL is equal to the,
// in Mongo DB we have collection, so the stucture of collection is nothing but the schema.

/*
so this is my schema below, which can take any value, and if someone dont want to pass something or any 
value also it will work, means any dump data can be also stored here into the DB, so to avoid that we have 
something knwon as "Data Sanitisation", which will make sure we are getting proper and unique date with mandatary file.

so there are 2 cases where our data got inserted in POST API call and in PATCH API Call while updating, 
so just we need to check these 2 API Calls as of now.

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
*/