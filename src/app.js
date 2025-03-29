const express = require('express');

const app = express();

const {adminAuth, userAuth} = require('./middlewares/auth');

// ex. 1st ==>> infinte loop
// app.use("/user1", (req, res) => {
//     res.send("User1 Fetched"); // if comment this line then it will go into the infinite loop, as we are not sending any response.
//     // console.log("User1 Fetched");
// })


// ex. 2nd ==>> infinte loop
// app.use("/user", (req, res) => {
//     // res.send("User Fetched"); // if comment this line then it will go into the infinite loop, as we are not sending any response.
//     console.log("User Fetched");
// }, (req, res) => {
//     res.send("User Fetched");
//     console.log("User Fetched");
// })


// ex. 3rd ==>> 2nd response handler.
// app.use("/user", (req, res, next) => {
//     console.log("1st response handler");
//     next();
// }, (req, res) => {
//     res.send("2nd response handler");
//     console.log("2nd response handler");
// })

// ex. 4th ==>> 1st response handler, + one error msg
// app.use("/user", (req, res, next) => {
//     res.send("1st response handler");
//     console.log("1st response handler");
//     next();
// }, (req, res) => {
//     res.send("2nd response handler");
//     console.log("2nd response handler");
// })

// ex. 5th ==>> 2nd response handler, + one error msg
// app.use("/user", (req, res, next) => {
//     next();
//     res.send("1st response handler");
//     console.log("1st response handler");
// }, (req, res) => {
//     res.send("2nd response handler");
//     console.log("2nd response handler");
// })

// ex. 6th ==>> Multiple route handlers.
// app.use("/user", (req, res, next) => {
//     res.send("1st response handler");
//     console.log("1st response handler");
//     next();
// }, (req, res, next) => {
//     res.send("2nd response handler");
//     console.log("2nd response handler");
//     next();
// }, (req, res, next) => {
//     res.send("2nd response handler");
//     console.log("3rd response handler");
//     next();
// }, (req, res, next) => {
//     res.send("2nd response handler");
//     console.log("4th response handler");
//     // next();
// })

// ex. 7th ==>> Multiple route handlers.
// app.use("/user", RH1, RH2, RH3, RH4, RH5);

// app.use("/user", [RH1, RH2, RH3, RH4, RH5]); //WE CAN ALSO PASS THIS IN ARRAY AS WELL.

// app.use("/user", RH1, [RH2, RH3], RH4, RH5); //WE CAN ALSO PASS THIS KIND OF ARRAY AS WELL. 

// Just the thing is in last RH There should not be next called, and the last RH must return the response.


// ex. 8th ==>> Multiple route handlers.
// app.use("/user", (req, res, next) => {
//     console.log("Main Function");
//     next();
// })

// app.get("/user", (req, res, next) => {  // the middle functions are called Middleware.
//     console.log("User Fetched");
//     res.send("1st RH");
//     next();
// }, (req, res, next) => {
//     console.log("User Fetched");
//     // res.send("2nd RH");
//     next();
// }, (req, res, next) => {
//     console.log("User Fetched");
//     res.send("3rd RH");
//     // next();
// })

/*
Middleware.
for admin should get the user only if he is authenticated.

app.get("/admin/getallusers", (req, res, next) => {
    const token = "xyz";
    const isAuth = token === "xyz";
    if(!isAuth) {
        res.status(401).send("Unauthorised");
    }
    else {
        res.send("Get All User");
    }
})

for admin should delete the user only if he is authenticated.
app.get("/admin/deleteUser", (req, res, next) => {
    const token = "xyz";
    const isAuth = token === "xyz";
    if(!isAuth) {
        res.status(401).send("Unauthorised");
    }
    else {
        res.send("Deleted User");
    }
})
*/
/*
so i need to do this thing again and again, fr all methdos, so for all methdos i can do like belwo.

app.use("/admin", (req, res) => {
    const token = "xyz";
    const isAuth = token === "xyz";
    if(!isAuth) {
        res.status(401).send("Unauthorised");
    }
    else {
        next();
    }
})

app.get("/admin/getuser", (req, res) => {
    res.send("Get all user");
})

app.get("/admin/delete", (req, res) => {
    res.send("deleted user");
})

*/

/*
generally as per standards we keep all our these methdos in middleware folder folder, 

app.use("/admin", adminAuth);

app.get("/admin/getuser", (req, res) => {
    res.send("Get all user");
})

app.get("/admin/delete", (req, res) => {
    res.send("deleted user");
})

app.get("/user", userAuth, (req, res) => {
    res.send("user Authenticated and got user data");    
})
*/

/*
Error handling
// 1st way
app.get("user", (req, res) => { // very bad way of writting, and it will only work for the app.get
    throw new Error("sdfgh");
    res.status(500).send("User not found");
})

// 2nd way
app.use("/user", (err,req, res, next) => {  // best way of writting, and it will work for all HTTP Methods, as we are using app.use
    res.status(500).send("Something went wrong");
})

// 3rd Way: Prper way of error handling using is try and catch block.
app.get("/user", (req, res) => {
    try {
        throw new Error("sdfgh");
        res.send("User Data Send");
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }    
})

app.listen(7777, () => {
    console.log('Dev Tinder is running on port 7777');
});

*/

/*
    const express = require('express');

    const app = express();

    //this below get call will only match /user get call
    app.get("/user", (req, res) => {
        res.send({firstname: "Akshay", lastname: "Chavan"})
    })

    //this below get call will only match /user get call
    app.use("/test", (req, res) => {
        res.send("Welcome to / route");
    })

    app.get("/user", (req, res) => {        //this below get call will only match /user get call
        res.send({firstname: "Akshay", lastname: "Chavan"})
    })

    app.post("/user", (req, res) => {        //this below post call will only match /user get call
        res.send("Saved the Data to the DB")
    })

    app.delete("/user", (req, res) => {        //this below delete call will only match /user get call
        res.send("deleted Data from the DB")
    })


    app.use("/test", (req, res) => {        //this match all the HTTP Method API Calls to /test 
        res.send("Welcome to / route");
    })


    app.listen(7777, () => {
        console.log('Dev Tinder is running on port 7777');
    });


    const express = require('express');

    const app = express();

    app.use("/test", (req, res) => {
        res.send("Welcome to /test route");
    })

    this below get call will only match /user get call
    app.get("/user", (req, res) => {
        res.send({firstname: "Akshay", lastname: "Chavan"})
    })

    this below get call will only match /user get call
    app.use("/test", (req, res) => {
        res.send("Welcome to / route");
    })

    app.listen(7777, () => {
        console.log('Dev Tinder is running on port 7777');
    });

*/