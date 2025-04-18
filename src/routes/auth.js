const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/Validations");
const user = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const users = new user({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });
    const savedUser = await users.save();
    // Generate token
    const token = await savedUser.getJWT();
    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false, // set true if using HTTPS
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    });

    res.json({ message: "User Signed up successfully", data: savedUser });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// authRouter.post("/login", async (req, res) => {
//     const {emailId, password} = req.body;
//     const existingUser = await user.findOne({emailId: emailId});
//     try {
//         if(!existingUser) {
//             throw new Error("New Email ID, please signup");
//         }
//         const isPasswordValid = await existingUser.validatePassword(password);

//         if(isPasswordValid) {
//             const token = await existingUser.getJWT();
//             res.cookie("token", token, {
//                 expires: new Date(Date.now() + 900000)
//             });
//             res.send(existingUser);
//         }
//     }
//     catch (err) {
//         console.error(err);
//         res.status(500).send("Server Error");
//     }
// })

// routes/auth.js or wherever your authRouter is defined
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const existingUser = await user.findOne({ emailId });

    // If user doesn't exist
    if (!existingUser) {
      return res.status(401).send("Email ID not found. Please sign up.");
    }

    // Validate password
    const isPasswordValid = await existingUser.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(401).send("Invalid password. Please try again.");
    }

    // Generate token
    const token = await existingUser.getJWT();

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false, // set true if using HTTPS
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    });

    // Send user data
    res.status(200).send(existingUser);
  } catch (err) {
    console.error("Login API error:", err.message);
    res.status(500).send("Server error. Please try again later.");
  }
});

/*
authRouter.post('/logout', async (req, res) => {
    res.cookie("token", {
        expires: new Date(0),
        httpOnly: true, 
        path: "/",
    });
    res.send("Logged Out Successfully");
});
*/

// We can also use this, which is more secure way ==>>

authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // Ensure this is consistent with how you set the cookie
    sameSite: "strict",
  });
  res.json({ message: "Logged Out Successfully" });
});

module.exports = authRouter;
