const jwt = require('jsonwebtoken');

const user = require("../models/user");

// so till now we are using admin and userAuth, now how we can do it using cookies,
// see there are only 2 API's signup API & Login API which does not require auth, 
// but for feed, connection request and other API's we need authentication, 
// and we are going to do it using middleware, so that our not only 2 API's, our all API's will be secure.
const userAuth = async (req, res, next) => {
    try{
    const {token} = req.cookies;

    if(!token) {
        throw new Error("Time Out, Please Login Again!");
    }

    const decodedObj = await jwt.verify(token, "devTinder@123");

    const {_id} = decodedObj;

    const User = await user.findById(_id);

    if(!User) {
        throw new Error("User not found");
    }

    req.user = User;
    next();
    } catch (err) {
        res.status(401).send("Invalid token");
    }
}

module.exports = {
    userAuth,
};

/*
const adminAuth = (req, res, next) => {
    const token = "xyz";
    const isAuth = token === "xyz";
    if(!isAuth) {
        res.status(401).send("Unauthorised");
    }
    else {
        next();
    }
}

const userAuth = (req, res, next) => {
    const token = "xyz";
    const isAuth = token === "xyz";
    if(!isAuth) {
        res.status(401).send("Unauthorised");
    }
    else {
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth,
};
*/