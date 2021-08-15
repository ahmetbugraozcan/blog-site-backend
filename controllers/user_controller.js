var express = require('express');
const User = require('../models/user');
var router = express.Router();
const passport = require('passport')
const baseError = require('../utils/base_error');
const httpStatusCode = require('http-status-codes');
const loginConstats = require('../constants/login_constants');
const connectEnsureLogin = require('connect-ensure-login');
var LocalStrategy = require('passport-local').Strategy;
var Joi = require('joi');

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//TODO STATUSCODELAR DÜZGÜN DÖNMÜYOR ONLAR DÜZELTİLECEK VE GİRİŞ SERVİSİ DÜZELTİLECEK



passport.use("local", new LocalStrategy({ // or whatever you want to use
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    User.findOne({ 'local.email': email }, function (err, user) {
        if (err)
            return done(err);

        // check to see if theres already a user with that email
        if (user) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
            const body = req.body;
            const schema = joiUserSchema();
            const validation = schema.validate(body);
            if (validation.error) {
                return done(null, false, req.flash('signupMessage', 'BAD REQUEST 404'));
                // return res.status(httpStatusCode.StatusCodes.NOT_ACCEPTABLE).json({
                //     status: 'error',
                //     message: 'Invalid request data',
                //     data: body
                // });
            }
            else {
                const newUser = new User(body);
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.save().then((val) => {
                    return done(null, newUser);
                    // res.status(httpStatusCode.StatusCodes.OK).send(val.id);
                }).catch((err) => {
                    return done("BAD REQUEST")
                    // res.status(httpStatusCode.StatusCodes.BAD_REQUEST).send(err);
                })
            }
        }
    })
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
}));




// router.post('/signup', function (req, res) {
//     const body = req.body;
//     const schema = joiUserSchema();
//     const validation = schema.validate(body);

//     if (validation.error) {
//         return res.status(httpStatusCode.StatusCodes.NOT_ACCEPTABLE).json({
//             status: 'error',
//             message: 'Invalid request data',
//             data: body
//         });
//     }
//     else {

//         const newUser = new User(body);

//         newUser.save().then((val) => {
//             res.status(httpStatusCode.StatusCodes.OK).send(val.id);
//         }).catch((err) => {
//             res.status(httpStatusCode.StatusCodes.BAD_REQUEST).send(err);
//         })
//     }

// });
//kayıt olurken bu olacak. giriş yaparken de logine post atıcaz 
router.post('/signup', passport.authorize('local')
    , (req, res) => {
        console.log("PASSPORT AUTHORİZE BİTTİ AMA BURDA İŞ KALMADI?")
        console.log("RESPONSE : " ,res )
    }
);

// router.get('/login',
//     (req, res) => {
//         console.log(res.body);    }
// );

router.get('/login',
    connectEnsureLogin.ensureLoggedIn(),
    (req, res) => res.send({ user: req.user })
);

// router.get('/',
//   connectEnsureLogin.ensureLoggedIn(),
//   (req, res) => res.sendFile('html/index.html', {root: __dirname})
// );

// router.post('/login', (req, res, next) => {
//     const query = {};
//     query.email = req.body.email;
//     query.password = req.body.password;

//     User.findOne(query, (err, user) => {
//         if (!user) {
//            return res.status(httpStatusCode.StatusCodes.NOT_FOUND).send(baseError(httpStatusCode.StatusCodes.NOT_FOUND, loginConstats.loginFailed));
//         } else {
//             return res.send(user);
//         }
//     })
// });

function joiUserSchema() {
    const schema = Joi.object({
        id: Joi.any(),
        name: Joi.string()
            .min(3)
            .max(40)
            .required(),
        userName: Joi.string().required(),
        password: Joi.string()
            .required(),
        email: Joi.string()
            .required(),
    });
    return schema;
}
module.exports = {
    router
}