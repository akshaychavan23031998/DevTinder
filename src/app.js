const express = require('express');

const app = express();

//this will work for usr and user as i have done qustion mark infront of e so it will become optional. 
app.get("/use?r", (req, res) => {        //this below get call will only match /user get call
    res.send({firstname: "Akshay", lastname: "Chavan"})
})

//this is work for user and useeeeeer,and etc as i have added plus sign infront of e, so it will add mire stings infront of e.
app.get("/use+r", (req, res) => {        //this below get call will only match /user get call
    res.send({firstname: "Akshay", lastname: "Chavan"})
})

// this will work for user and we have added star * infront of s soo * means anything, ex: usAKSHAYRAMCHAVANWERTer.
app.get("/us*er", (req, res) => {        //this below get call will only match /user get call
    res.send({firstname: "Akshay", lastname: "Chavan"})
})

//these are complex regex of route and can be use combined as well.

app.listen(7777, () => {
    console.log('Dev Tinder is running on port 7777');
});