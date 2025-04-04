const express = require('express');
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/Validations");
const user = require("../models/user");
const bcrypt = require('bcrypt');

authRouter.post("/signup", async (req, res) => {
    try {
    validateSignUpData(req); 

    const {firstName,lastName,emailId,password} = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const users = new user(
        {
            firstName,
            lastName,
            emailId,
            password:  hashPassword, 
        }
    ); 
        await users.save();
        res.send("User Signed up successfully");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

authRouter.post("/login", async (req, res) => {
    const {emailId, password} = req.body;
    const existingUser = await user.findOne({emailId: emailId});
    try {
        if(!existingUser) {
            throw new Error("New Email ID, please signup");
        }
        const isPasswordValid = await existingUser.validatePassword(password); 

        if(isPasswordValid) {
            const token = await existingUser.getJWT();  
            res.cookie("token", token, {
                expires: new Date(Date.now() + 900000)
            });
            res.send("Logged In Successfully");
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
})

authRouter.post('/logout', async (req, res) => {
    res.cookie("token", {
        expires: new Date(Date.now()),
    });
    res.send("Logged Out Successfully");
});

/*
We can also use this, which is more secure way ==>>

authRouter.post('/logout', async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,  // Ensure this is consistent with how you set the cookie
        sameSite: "strict",
    });
    res.json({ message: "Logged Out Successfully" });
});

*/

module.exports = authRouter;