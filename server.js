require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require("mongoose");
const app = express();
const userController = require('./controllers/user_controller');
var cors = require('cors');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;




app.use(cors())

app.listen(9000, ()=> {
    console.log("Listening port 9000");
});

app.use(userController.router);
// app.get("/", (req,res)=>{
//     res.send({name: "ahmet"});
//     console.log(process.env.DATABASE_URL)
// })
