// console.log("Dev Tinder is Ready to good to Gooo.....

const express = require('express');

const app = express();

app.use("/test", (req, res) => {
    res.send("Welcome to /test route");
})

app.use((req, res) => {
    res.send("Welcome to / route");
})

app.listen(7777, () => {
    console.log('Dev Tinder is running on port 7777');
});