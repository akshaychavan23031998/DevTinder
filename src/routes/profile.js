const express = require('express');
const profileRouter = express.Router();

const {userAuth} = require('../middlewares/auth');
const {validateEditProfileData} = require('../utils/Validations');

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const userData = req.user;
        res.send("Get Profile"+userData);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error"+err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }
        const PassedValuesFromPostman = req.body;    // this will give us the values passed from postman.
        console.log(PassedValuesFromPostman);
        
        const loggedInUser = req.user;  // this will give us the logged in user, before edit.
        console.log(loggedInUser);
        
        // now here what we are doing is we are applying for each loop on each and every value we PassedValuesFromPostman and
        // then for each key of loggedin user we are changing this values.
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        console.log(loggedInUser);      // this will give us the logged in user, After edit.

        await loggedInUser.save();

        // res.send(`${loggedInUser.firstName} Profile Updated Successfully`); this is normal method
        res.json({
            message: `${loggedInUser.firstName} Profile Updated Successfully`,// this how in indusry works.
            updatedData: loggedInUser,
        })
    }
    catch(err) {
        console.error(err);
        res.status(500).send("Server Error"+err.message);
    }
});

module.exports = profileRouter;