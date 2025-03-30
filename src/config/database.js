const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://Namastedev:HuCZ4fXxBgidSjPU@namastenode.ehpurrx.mongodb.net/devTinder");
};

module.exports = connectDB;

// connectDB()
//     .then(() => console.log("DB Connected Successfully"))
//     .catch((err) => console.log("DB Connect Fail", err));

// mongoose.connect("mongodb+srv://namastedev:NLdwK2iNG7C1YOby@namastedev.jutef.mongodb.net/");
// this is will return a promise, so its always better it wrap it in to async wait function.
//so now what is happning is our server is started and and db is succesfull, but what if
// our server started and DB Faailed to connect ? n that case 
// 1st we need to connect our db if its sucee full then start our server that is the currect approach.


// in this file we have just connected to our cluster, and cluster can have multiple no of DB's,
// this is the url of cluster, ==>>
// mongodb+srv://Namastedev:HuCZ4fXxBgidSjPU@namastenode.ehpurrx.mongodb.net/
// this is the url of DB  which is insidde the cluster ==>> 
// mongodb+srv://Namastedev:HuCZ4fXxBgidSjPU@namastenode.ehpurrx.mongodb.net/devTinder
// and in app.js file, if the connection to the cluster is suceefully then we will start the server.