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

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "Accepted"},
                {fromUserId: loggedInUser._id, status: "Accepted"},
            ]
        }).populate("fromUserId", ["firstName", "lastName"]).populate("toUserId", ["firstName", "lastName"]);

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({
            data
        });
    }
    catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

module.exports = userRouter;