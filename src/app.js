const express = require('express');

const app = express();


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