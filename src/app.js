const express = require('express');
const app = express();
const connectDB = require("./config/database");
const {adminAuth, userAuth} = require('./middlewares/auth');
const user = require("./models/user");
// const { validateSignUpData } = require("./utils/Validations");
const { validateSignUpData } = require("./utils/validations");

const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const cors = require("cors");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));            // To Byy pass the CORS Error.
app.use(express.json());    //==>> its a middleware
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profilRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use("/", authRouter);
app.use("/", profilRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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

/*
This is the App.js how this use to look before the Expree router:
//Schema Methods: Off loaded the logic of password encryption and JWT Tooken.
// so in this here we are writting all API's in one single file of APP.JS which is not a good thing to do,
// so we will use Express router, so that we can easily manage all routers properly.

app.post("/login", async (req, res) => {
    const {emailId, password} = req.body;
    const existingUser = await user.findOne({emailId: emailId});
    try {
        if(!existingUser) {
            throw new Error("New Email ID, please signup");
        }
        const isPasswordValid = await existingUser.validatePassword(password); // off laoded to user schema methods.

        if(isPasswordValid) {
            const token = await existingUser.getJWT();  // off laoded to user schema methods.
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

app.post("/signup", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
    try {
        const userData = req.user;
        res.send("Get Profile"+userData);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error"+err.message);
    }
})

app.post("/sendConnectionRequest", userAuth, (req, res) => {
    const user = req.user;
    res.send("Hey you have Connection Request from "+user.firstName);
});


//Updated the Login API by seting the expiry time of JWT token and cookie.
app.post("/login", async (req, res) => {
    const {emailId, password} = req.body;
    const existingUser = await user.findOne({emailId: emailId});
    try {
        if(!existingUser) {
            throw new Error("New Email ID, please signup");
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if(isPasswordValid) {   // this jwt is getting generated for the all users, so we can off laod it to schema level by using schema method.
            const token = await jwt.sign({ _id: existingUser._id }, "devTinder@123", {
                expiresIn: '1d',
            });
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


//Authentication Middle ware: Updated profile API With Auth Middleware==>>

// so till now we are using admin and userAuth, now how we can do it using cookies,
// see there are only 2 API's signup API & Login API which does not require auth, 
// bcz in these we are creating the token, creating the user and getting login the user.
// but for profile, feed, connection request and other API's we need authentication, 
// and we are going to do it using middleware, so that our not only 2 API's, our all API's will be secure.

// so this is my profile should get opened only when it goes through the userAuth Middle ware form auth.js,
// and if everything goes well in userAuth then it will goes to nect(); is the try and catch blcok of this get Profile API.

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
    const {emailId, password} = req.body;
    const existingUser = await user.findOne({emailId: emailId});
    try {
        if(!existingUser) {
            throw new Error("New Email ID, please signup");
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if(isPasswordValid) {
            const token = await jwt.sign({ _id: existingUser._id }, "devTinder@123");
            res.cookie("token", token);
            res.send("Logged In Successfully");
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
})

app.get("/profile", userAuth, async (req, res) => {
    try {
        //now we have removed the unwanted code or redundant code or the same code which is present in the authMiddleware and this API Call.
        const userData = req.user;
        res.send("Get Profile"+userData);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error"+err.message);
    }
})

// with this API Call anyone can heat the connection request, but i want unless and until a user login, 
// user cant send the connection reqest.
// app.post("/sendConnectionRequest", (req, res) => {
//     res.send("Connection Request Sent");
// })

app.post("/sendConnectionRequest", userAuth, (req, res) => {
    const user = req.user;
    res.send("Hey you have Connection Request from "+user.firstName);
});


//JWT Cookie & Authentication for login:
// Here we are generating the JWT Tooken dynamically using the npm package called "jsonwebtoken".
app.post("/login", async (req, res) => {
    const {emailId, password} = req.body;
    const existingUser = await user.findOne({emailId: emailId});
    try {
        if(!existingUser) {
            throw new Error("New Email ID, please signup");
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if(isPasswordValid) {
            const token = await jwt.sign({ _id: existingUser._id }, "devTinder@123");
            console.log(token); //now it generated this JWT Cookie ==>> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDM0MDY4NzN9.Grpvn18Rapj3qm9n_gq2sAXl39GlM14zCkG9rgLTijo
            res.cookie("token", token);
            res.send("Logged In Successfully");
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
})

app.get("/profile", async (req, res) => {
    try {
    const cookies = req.cookies;

    const {token} = cookies;
    if(!token) {
        throw new Error("No Token, Please Login");
    }
    const decodedMessage = await jwt.verify(token,  "devTinder@123");
    console.log(decodedMessage);    // these will decode my user id and give to me. ==>> { _id: '67ea2ca742a51689bf29218b', iat: 1743411102 }
    console.log(cookies);           //token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2VhMmNhNzQyYTUxNjg5YmYyOTIxOGIiLCJpYXQiOjE3NDM0MTExMDJ9.caf1po5Xqhc5YJZ_r1H3rVFF5fieuAUhkuAO37ADGJE'
    //so now my decodedMessage has id, if i retriver the data on the basis of my id then,
    const {_id} = decodedMessage;
    console.log("Logged In User is _id"+_id); 

    const userData = await user.findById(_id);
    console.log(userData); 
//==>> this is the userData, now what happend is if anyone logged in by his email and password, 
// then profile of that user will be shown only.

//     Logged In User is _id67ea2ca742a51689bf29218b
// {
//   _id: new ObjectId('67ea2ca742a51689bf29218b'),
//   firstName: 'akshay',
//   lastName: 'chavan',
//   emailId: 'akshay@gmail.com',
//   password: '$2b$10$gOxbr6zF/MTyy8Hca1cxDe6/U9HRUmuR6djhWM88ysI2vk6midEj6',
//   photo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pnrao.com%2F%3Fattachment_id%3D8917&psig=AOvVaw3YCvuAnmRnVTRmj0OJAsWt&ust=1743437629587000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMiX27WZsowDFQAAAAAdAAAAABAE',
//   about: 'This is the defult Bio of the user!',
//   _id: new ObjectId('67ea2ca742a51689bf29218b'),
//   firstName: 'akshay',
//   lastName: 'chavan',
//   emailId: 'akshay@gmail.com',
//   password: '$2b$10$gOxbr6zF/MTyy8Hca1cxDe6/U9HRUmuR6djhWM88ysI2vk6midEj6',
//   photo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pnrao.com%2F%3Fattachment_id%3D8917&psig=AOvVaw3YCvuAnmRnVTRmj0OJAsWt&ust=1743437629587000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMiX27WZsowDFQAAAAAdAAAAABAE',
//   about: 'This is the defult Bio of the user!',
//   createdAt: 2025-03-31T05:48:23.154Z,
//   updatedAt: 2025-03-31T05:48:23.154Z,
//   __v: 0
// }

    res.send("Get Profile");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error"+err.message);
    }
})


// In this we are hard coading the values of JWT cookie.
app.post("/login", async (req, res) => {
    const {emailId, password} = req.body;
    const existingUser = await user.findOne({emailId: emailId});
    try {
        if(!existingUser) {
            throw new Error("New Email ID, please signup");
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if(isPasswordValid) {
            //Create JWT Cookie here, once the Email ID & Password validated.
            //add the token to cookie & send the response back to the user.
            //so express js has given a inbult function called "res.cookie".
            res.cookie("jwtcookie","sdfghjhg2345678");  
            // now when ever i login ill send this cookie to my user, and it will there in the postman cookie option.
            res.send("Logged In Successfully");
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
})

// so in above /login POST API Call, we are storing the cookie, now i can get it ?
// to get the cookie, we need to make a get API Call, GET /profile.

app.get("/profile", (req, res) => {
    const cookies = req.cookies;
    //we can not get the cookie form the reqest directly, so to get the cookie from the request,
    // we need to install a package given by express team "cookie-parser" and just we need to install & require it.
    console.log(cookies);   // { jwtcookie: 'sdfghjhg2345678' } exactly same as given in login post api call.
    res.send("Get Profile");
})


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