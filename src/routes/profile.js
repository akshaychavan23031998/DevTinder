const express = require('express');
const profileRouter = express.Router();

const {userAuth} = require('../middlewares/auth');

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const userData = req.user;
        res.send("Get Profile"+userData);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error"+err.message);
    }
})

module.exports = profileRouter;