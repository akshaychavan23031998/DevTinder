const express = require('express');

const app = express();

const connectDB = require("./config/database");

const {adminAuth, userAuth} = require('./middlewares/auth');

const user = require("./models/user");

const { validateSignUpData } = require("./utils/Validations");

const bcrypt = require('bcrypt');
// const user = require('./models/user');

app.use(express.json());    //==>> its a middleware

// now we have seen that we had hashed the password but how to validate it ?
// generally we give email and password at the time of login, so for that we need to write login API Call.
app.post("/login", async (req, res) => {
    const {emailId, password} = req.body;
    //now here we also need to perform the validation for the email and password,
    // like its valid emailId and password or not ? 
    // & then the email id is present in the db if yes then check its password.
    const existingUser = await user.findOne({emailId: emailId});
    try {
        if(!existingUser) {
            throw new Error("New Email ID, please signup");
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if(isPasswordValid) {
            res.send("Logged In Successfully");
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
})

/*
// so here we 1st validate the data, then encrypting the password by using the bcrypt package, 
// then we arr passing this hashedPassword to the value of password,
// so that knwo should come to know about actual password given by user., only use should know this no one else if he knwo,
// if he forgots then knwo one will know the password what he added as password.
app.post("/signup", async (req, res) => {
    try {
    //Validation of data
    validateSignUpData(req);    // as soon as my data comes, ill validate it from my validation function from utils.

    //encrypt the password, to encrypt the password we have one library called bcrypt and we will use that.
    const {firstName,lastName,emailId,password} = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);  // $2b$10$wkLvexKUi/rwPlYYVwIDm.XI2lob9/GJ6HVLcQ1EhG0ODz4NJEU5. ==>> This is called hashed password.

    const users = new user(
        {
            firstName,
            lastName,
            emailId,
            password:  hashPassword, //==>> we are passing the hashed password here.
        }
    ); //==>> this is dynamic.
        await users.save();
        res.send("User Signed up successfully");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});


//API Lavel Validations: hv u ever wondered that most of the social media platforms deoes not allow us to
// update the Email ID its bcz , now i hv login in with akshay and then i changed to celebraty name, and changed
// the pphoto and all measn i am complty changing the ideantity right, so thats whay most of the
// patforms does not allow us, so how we can do that is at API Level validations we can do these things,
// and its only releted to the update.

// this is the API Validation: 
// const ALLOWED_UPDATES = ["userId", "photo", "about", "gender", "age"];
//     const isUpdateAllowed = Object.keys(data).every((k) => {
//         ALLOWED_UPDATES.includes(k)
//     });
//     if(!isUpdateAllowed) {
//         res.status(400).send("Update not allowed");
//     };


// API Validation for patch request: 
app.patch("/updateuser", async (req, res) => {
    const data = req.body;
    const userId = req.body.userId;

    const ALLOWED_UPDATES = ["userId", "photo", "about", "gender", "age"];

    const isUpdateAllowed = Object.keys(data).every((k) => {
        ALLOWED_UPDATES.includes(k)
    });
    if(!isUpdateAllowed) {
        res.status(400).send("Update not allowed");
    };

    try {
        await user.findByIdAndUpdate({_id: userId}, data);
        res.send("User updated successfully");
    }
    catch (err) {
        // console.error("Error:", err);
        res.status(500).send("Server Error");
    }
})


app.post("/signup", async (req, res) => {
    // console.log(req.body); ==>> as i am getting the JS Object in this from the postman/user
    // creating a new instance of user model
    const users = new user(req.body); //==>> this is dynamic.

    try {
        await users.save();
        res.send("User Signed up successfully");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
})

// delete user by finding the Id.
app.delete("/deleteuser", async (req, res) => {
    const userId = req.body.userId;
    try {
        const User = await user.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }
    catch (err) {
        // console.error("Error:", err);
        res.status(500).send("Server Error");
    }
})


// this is for my all users, it will not take anything in postman
app.get("/allusers", async (req, res) => {
    try {
        // console.log("Request received at /allusers"); // Debugging log

        const allUsers = await user.find({});
        // console.log("Users fetched:", allUsers); // Debugging log

        if (allUsers.length === 0) {
            res.status(404).send("No users found");
            return;
        } else {
            res.status(200).json(allUsers);
        }
    } 
    catch (err) {
        // console.error("Error:", err);
        res.status(500).send("Server Error");
    }
});

// this is for the perticular user, it will take a firstName in postman and accoridng to that it will give us the records.
app.get("/user", async (req, res) => {
    const userfirstName = req.body.firstName;
    try {
        const userName = await user.find({firstName: userfirstName});

        if(userName.length == 0) {   // ==>> if my given or reqested user not found then it will return empty object. ex we have data for "Akshay" not for "akshay".
            res.status(404).send("User not found");
            return;
        }
        else {
            res.send(userName); 
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});


app.post("/signup", async (req, res) => {
    // console.log(req.body); ==>> as i am getting the JS Object in this from the postman/user
    // creating a new instance of user model
    const users = new user(req.body); //==>> this is dynamic.

    try {
        await users.save();
        res.send("User Signed up successfully");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
})


app.post("/signup", async (req, res) => {
    // console.log(req);
    // console.log(req.body); ==>> this is give us undefined, its bcz our we are sending our data in JSON Formate inside body,
    // and we will get JS Object, so for that we need something that converts this JSON to JS Object, 
    // so for that expree has given us a middleware which wil be called each and every time, and converts our JSON to JS Object. 
    // app.use(express.json()); ==>> now this will exicute each and every time for all HTTP Methods + all routes., 
    // without this we will get undefined, bcz its JS Object and it did not get anything like JS Object inside body, 
    // now we are sending JSON it will convert to JS Object and we will get values in the console.
    console.log(req.body);
});


1st POST API., here we are passing values by hard coading it, how i can make it dynamic.
app.post("/signup", async (req, res) => {
    const users = new user({
        firstName: "Akshay",
        lastName: "Saini",
        email: "akshay@Saini.com",
        password: "123sdf456",
        age: 25,
        gender: "Male",
    });

    try {
        await users.save();
        res.send("User Signed up successfully");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
})

*/

connectDB()
.then(() => {   // if DB Connection is successfull, then start the server, or else show the error of why DB Connecttion failed.
    console.log("DB Connected Successfully")
    app.listen(7777, () => {
        console.log('Dev Tinder is running on port 7777');
    });
})
.catch((err) => {
    console.error("DB Connect Fail", err);
});

// connectDB()
//     .then(() => console.log("DB Connected Successfully"))
//     .catch((err) => console.log("DB Connect Fail", err));


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


3rd Way: Prper way of error handling using is try and catch block.
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