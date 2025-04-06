const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest');


//this API To get all pending requests.
userRouter.get('/user/request/received', userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"]);

        res.json({
            message: 'Data Fetched Successfully',
            data: connectionRequest,
        })
    }
    catch(err){
        console.error(err);
        res.status(500).send('Server Error');
    }
})

module.exports = userRouter;