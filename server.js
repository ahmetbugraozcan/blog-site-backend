require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const flash = require('connect-flash');
const path = require('path')
const userController = require('./controllers/user_controller');
const blogController = require('./controllers/blog_controller');
const commentController = require('./controllers/comment_controller');
const likeController = require('./controllers/like_controller');
const bookmarkController = require('./controllers/bookmark_controller');
const expressSession = require('express-session')({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
});

var cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())


app.use(expressSession);
app.use(express.static(__dirname));
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
const db = mongoose.connection;





// app.use(express.static(path.join(__dirname, '../build')))
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../build'))
// })

app.use(userController.router);
app.use(blogController.router);
app.use(commentController.router);
app.use(likeController.router);
app.use(bookmarkController.router);
const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// app.get("/", (req,res)=>{
//     res.send({name: "ahmet"});
//     console.log(process.env.DATABASE_URL)
// })
// server static assets if in production
if(process.env.NODE_ENV === 'production'){    
    app.use(express.static('frontend/build'))  // set static folder 
    //returning frontend for any route other than api 
    app.get('*',(req,res)=>{     
        res.sendFile (path.resolve(__dirname,'frontend','build',         
                      'index.html' ));    
    });
}