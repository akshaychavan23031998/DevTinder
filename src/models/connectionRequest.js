const mongoose = require('mongoose');

const ConnectionRequest = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",    //reference to the ueser Collection.
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    status: {
        type: String,
        ref: "user",  
        required: true,
        enum: {
            values: [ "ignored", "interested", "accepted", "rejected"],
            message: '{VALUE} is not a valid status'
        }
    }
},
{
    timestamps: true,
});


ConnectionRequest.index({fromUserId: 1, toUserId: 1});

// this is for the i cant sent connection request to myself.
ConnectionRequest.pre("save", function(next) {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You cannot send a connection request to yourself.");
    }
    next();
});

const connectionRequestModel = new mongoose.model("ConnectionRequest", ConnectionRequest);

module.exports = connectionRequestModel;