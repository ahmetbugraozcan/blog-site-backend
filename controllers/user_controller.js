var express = require('express');
const User = require('../models/user');
var router = express.Router();
const baseError = require('../utils/base_error');
const httpStatusCode = require('http-status-codes');
const loginConstats = require('../constants/login_constants');

router.post('/signup', function(req, res){
    const body = req.body;
    const newUser = new User(body);

    newUser.save().then((val)=>{
        res.status(httpStatusCode.StatusCodes.OK).send(val.id);
    }).catch((err)=>{
        res.status(httpStatusCode.StatusCodes.BAD_REQUEST).send(err);
    })
});

router.post('/login', function(req, res){
    const query = {};
    query.email = req.body.email;
    query.password = req.body.password;

    User.findOne(query, (err,user) => {
        if(!user){
            return res.status(httpStatusCode.StatusCodes.NOT_FOUND).send(baseError(httpStatusCode.StatusCodes.NOT_FOUND, loginConstats.loginFailed));
        }else{
            return res.send(user);
        }
    })
});
module.exports = {
    router
}