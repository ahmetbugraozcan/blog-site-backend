require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require("mongoose");
const app = express();
const passport = require('passport');
const userController = require('./controllers/user_controller');
const blogController = require('./controllers/blog_controller');
const commentController = require('./controllers/comment_controller');
const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
});

var cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));
app.use(cors())



app.use(expressSession);

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;



app.listen(9000, () => {
    console.log("Listening port 9000");
});

app.use(passport.initialize());
app.use(passport.session());

app.use(userController.router);
app.use(blogController.router);
app.use(commentController.router);
// app.get("/", (req,res)=>{
//     res.send({name: "ahmet"});
//     console.log(process.env.DATABASE_URL)
// })
