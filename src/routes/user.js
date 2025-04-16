const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest');
const user = require('../models/user');


//this API To get all pending requests.
userRouter.get('/user/request/received', userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photo", "about"]);

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

//this API To get all your connections wwho accepted u r request and u accepted others means ur al friends.
userRouter.get('/user/connections', userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"},
            ]
        })
        // .populate("fromUserId", ["firstName", "lastName"]).populate("toUserId", ["firstName", "lastName"]); ==>>this will only give id of connections.
        .populate("fromUserId", ["firstName", "lastName", "photo", "about"])
        .populate("toUserId", ["firstName", "lastName", "photo", "about"])


        // const data = connectionRequests.map((row) => {
        //     if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        //         return row.toUserId;
        //     }
        //     return row.fromUserId;
        // });
        // res.json({
        //     data
        // });

        const data = connectionRequests.map((row) => {
            const user = row.fromUserId._id.toString() === loggedInUser._id.toString()
                ? row.toUserId
                : row.fromUserId;

            return {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                photo: user.photo,
                about: user.about
            };
        });

        res.json({ data });
    }
    catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

// this can be one more way as well.
// userRouter.get('/user/connections', userAuth, async (req, res) => {
//     try {
//         const loggedInUser = req.user;

//         const connectionRequests = await ConnectionRequest.find({
//             $or: [
//                 { toUserId: loggedInUser._id, status: "accepted" },
//                 { fromUserId: loggedInUser._id, status: "accepted" },
//             ]
//         })
//         .populate({
//             path: "fromUserId",
//             select: "_id firstName lastName photo about"
//         })
//         .populate({
//             path: "toUserId",
//             select: "_id firstName lastName photo about"
//         });

//         const data = connectionRequests.map((row) => {
//             const user = row.fromUserId._id.toString() === loggedInUser._id.toString()
//                 ? row.toUserId
//                 : row.fromUserId;

//             return {
//                 _id: user._id,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 photo: user.photo,
//                 about: user.about
//             };
//         });

//         res.json({ data });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// });



//this API is for feed, so who's profile we need to show, all the users which are signedup except below
// 1st i should not see my own profile in feed.
// 2nd i should not see anyof my connection profile, means i am friend of them.
// 3rd i should not see the profile of the user whome i sheared request.
// 4th i should not see the profile of the user whome i ignored.

userRouter.get('/user/feed', userAuth, async (req,res) => {
    try{
        const loggedInUser = req.user; // this is coming from the userAuth

        //Pagination.
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1)*limit;


        // Find all connection req (sent + recived);
        const connectionRequests = await ConnectionRequest.find({
            $or: [{fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}],
        }).select("fromUserId toUserId").skip(skip).limit(limit);

        // now as these are my friends so i dont want all in my feed.
        const hideUserFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        })

        //so in this i am finding all my users except,
        // the users i have sent connection request or i recived connection reqest from them + my own card.
        const users = await user.find({
            $and: [
                {_id: {$nin: Array.from(hideUserFromFeed)}},
                {_id: {$ne: loggedInUser._id}}  // our own user if of person who is logged In.
            ],
        }).select("fromUserId toUserId firstName lastName about photo");
        res.json({data: users});
    }
    catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

module.exports = userRouter;