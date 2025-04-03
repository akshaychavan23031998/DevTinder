var validator = require('validator');

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName) {
        throw new Error("Invalid Name");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid EmailId");
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Password is Not Strong Enough");
    }
}

const validateEditProfileData  = (req) => {
    const allowedEditFildes = ["firstName", "lastName", "age", "gender", "photo", "about"];

    const isEditAllowed = Object.keys(req.body).every((filed) => allowedEditFildes.includes(filed));

    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
}