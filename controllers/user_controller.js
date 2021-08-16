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

// passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
//     User.findOne({ email: email }).then((user) => {
//         if (!user) {
//             return done(null, false, 'User Not Found');
//         }
//         bcrypt.compare(password, user.password, (err, isMatch) => {
//             if (err) throw err;
//             if (isMatch) {
//                 return done(null, user);
//             } else {
//                 return done(null, false, { message: 'Password Incorrect' })
//             }
//         });

//     })
// }));
// passport.serializeUser(function (user, done) {
//     done(null, user.id);
// });
// passport.deserializeUser(function (id, done) {
//     User.findById(id, function (err, user) {
//         done(err, user);
//     });
// });


passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    passport.deserializeUser((id, done) => {
        User.findById(id).then((user) => {
            done(null, user);
        }).catch(done);
    });
});

//TODO STATUSCODELAR DÜZGÜN DÖNMÜYOR ONLAR DÜZELTİLECEK VE GİRİŞ SERVİSİ DÜZELTİLECEK



passport.use("local", new LocalStrategy({ // or whatever you want to use
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    //emaili ya da usernamei zaten var mı diye kontrol et 
    User.findOne({ $or: [{ email: email }, { userName: req.body.userName }] }, function (err, user) {
        if (err) {
            return done(err);
        }

        // check to see if theres already a user with that email
        if (user != null) {
            console.log("BÖYLE BİR USER ZATEN VAR...",);
            return done(null, false, { failureFlash: 'Username or email is already taken.' });
        } else {
            const body = req.body;
            const schema = joiUserSchema();
            const validation = schema.validate(body);
            if (validation.error) {
                console.log("VALIDATION ERROR : ", validation.error);
                res.send()
                return done(null, false, { message: 'VALIDATION ERROR.' });
                // return res.status(httpStatusCode.StatusCodes.NOT_ACCEPTABLE).json({
                //     status: 'error',
                //     message: 'Invalid request data',
                //     data: body
                // });
            }
            else {
                console.log("BODY : ", body.userName); // body.userName geliyor başarılı bir şekilde
                //bodyde bulunan tüm key value değerleri newUsera aktarılıyor userName hariç...
                const newUser = new User(body);
                newUser.password = newUser.generateHash(password);
                // newUser.userName = body.userName;
                newUser.save().then((val) => {
                    return done(null, newUser);
                    // res.status(httpStatusCode.StatusCodes.OK).send(val.id);
                }).catch((err) => {
                    return done(null, false, { message: `BAD REQUEST. :  ${err}` });
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
        // res.send
        console.log("res data : ", res.statusCode)
    }
);
router.get('/login',
    (req, res) => {
        //find the user based on email
        const { email, password } = req.body;

        try {
            const user = awaitUser.findOne({ email });
            if (user == null)
                return res.status(400).json({
                    err: "User with  email doesnot exists.Please signup"
                })
        }
        catch (error) {
            return res.status(500).json({
                err:
                    error.message
            });
        }


        // const token = jwt.sign({ _id: user._id }, YOUR_SECRET_KEY);

        // res.cookie('t');

        const { _id, name, email } = user;
        return res.json({ token, user: { _id, email, name } });



    }
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