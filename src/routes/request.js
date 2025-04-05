const express = require('express');
const requestRouter = express.Router();

const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require("../models/connectionRequest");
const user = require('../models/user');

// requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
//     const user = req.user;
//     res.send("Hey you have Connection Request from "+user.firstName);
// });

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try{
        const toUserId = req.params.toUserId;
        const fromUserId = req.user._id;
        const status = req.params.status;

        //its to check the allowed status
        const allowedStatus = ["interested", "ingnored"];
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message: status + " is Invalid status type."})
        }

        //to check the user exist in our DB or not
        const toUser = await  user.findById(toUserId);
        if(!toUser) {
            return res.status(400).json({message: "User not found."})
        }

        //its to check the person A send send connection request to B now B is not allowed to send connection request to Prson A.
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })
        
        if(existingConnectionRequest) {
            return res.status(400).json({message: "Connection Request already sent."})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId,status
        });

        const data = await connectionRequest.save();

        res.json({
            message: req.user.firstName +" "+ status + "in your profile",
            data,
        })
    }
    catch(err) {
        res.status(400).send("ERROR: "+err.message);
    }
});

module.exports = requestRouter;