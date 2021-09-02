var express = require('express');
const User = require('../models/user');
var router = express.Router();
const baseError = require('../utils/base_error');
const httpStatusCode = require('http-status-codes');
const loginConstats = require('../constants/login_constants');
const connectEnsureLogin = require('connect-ensure-login');
var Joi = require('joi');
var bcrypt = require('bcrypt');
var mongo = require('mongodb');
const Follower = require('../models/follower');


//Belirli iddeki tek kullanıcıyı getiren sorgu
router.get('/user/:username', (req, res) => {
    var username = req.params.username;
    // var o_id = new mongo.ObjectID(userID);
    User.findOne({ 'username': username }, (err, user) => {
        if (user) {
            res.status(httpStatusCode.StatusCodes.OK).send(user);
        } else {
            res.status(httpStatusCode.StatusCodes.NOT_FOUND).json({
                status: 'error',
                message: 'User Not Found!',
                statusCode: httpStatusCode.StatusCodes.NOT_FOUND,
            });;
        }
    })
})


router.post('/signup', async function (req, res) {
    const body = req.body;
    const schema = joiUserSchema();
    const validation = schema.validate(body);

    //user varsa user var mesajı dönülecek

    if (validation.error) {
        console.log(validation.error)
        return res.status(httpStatusCode.StatusCodes.NOT_ACCEPTABLE).json({
            status: 'error',
            message: 'Invalid request data',
            data: body
        });
    }
    else {
        const newUser = new User(body);
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        newUser.password = hashedPassword;
        console.log("User : ", newUser);
        newUser.save().then((val) => {
            res.status(httpStatusCode.StatusCodes.OK).send(val.id);
        }).catch((err) => {
            console.log(err);
            res.status(httpStatusCode.StatusCodes.BAD_REQUEST).send(err);
        })
    }

});
//kayıt olurken bu olacak. giriş yaparken de logine post atıcaz


router.post('/login',
    (req, res) => {
        const query = { }
        query.email = req.body.email;
        User.findOne(query, async (err, user) => {
            if (!user) {
                return res.status(httpStatusCode.StatusCodes.NOT_FOUND).send("Böyle bir email bulunamadı");
            } else {
                if (await bcrypt.compare(req.body.password, user.password)) {
                    console.log("PAROLALAR EŞLEŞTİ")
                    return res.status(httpStatusCode.StatusCodes.OK).send(user);
                } else {
                    return res.status(httpStatusCode.StatusCodes.FORBIDDEN).send("Şifre Yanlış");
                }
            }
        })
    }
);

//bir kişinin tüm takipçilerini getirir
router.get("/user/:username/followers", (req, res) => {
    var usernameParam = req.params.username;
    User.findOne({ "username": usernameParam }).then((user, err) => {
        if(user) {
            console.log("users : " , user.followers);
            res.json(user.followers).status(httpStatusCode.StatusCodes.OK);
        } else {
            res.sendStatus(httpStatusCode.StatusCodes.NOT_FOUND);
        }
    })
});

router.post("/user/:username/follow",
    (req, res) => {
        var isFollowedEarly = false;
        const body = req.body;
        const schema = joiFollowerSchema();
        const usernameParam = req.params.username
        var reqFollower = {
            follower: req.body.follower,
        };
        const validation = schema.validate(reqFollower);

        if (validation.error) {
            console.log(validation.error)
            return res.status(httpStatusCode.StatusCodes.NOT_ACCEPTABLE).json({
                status: 'error',
                message: 'Invalid request data',
                data: body
            });
        }
        else {
            const follower = new Follower(reqFollower);
            User.findOne({ 'username': usernameParam }, (err, userRelated) => {
                userRelated.followers.forEach(user => {
                    if (user.follower.username == follower.follower.username) {
                        isFollowedEarly = true;
                    }
                });

                if (!isFollowedEarly) {
                    userRelated.followers.push(follower)
                }
                else {
                    userRelated.followers.forEach(user => {
                        if (user.follower.username == follower.follower.username) {
                            userRelated.followers.remove(user);
                        }
                    });
                    // blogRelated.likes.remove
                };

                userRelated.save(function (err) {
                    if (err) { console.log(err) }
                    if (!isFollowedEarly) {
                        res.status(httpStatusCode.StatusCodes.OK).send(httpStatusCode.StatusCodes.OK);
                        console.log("OK")
                    }
                    else {
                        res.status(httpStatusCode.StatusCodes.ACCEPTED).send(httpStatusCode.StatusCodes.ACCEPTED);
                        console.log("ACCEPTED")
                    }
                });
            });

        }
    }
);

//bir kişinin takip ettiği tüm kullanıcıları getirir

router.get('/user/:username/followedUsers', (req, res) => {
    var username = req.params.username;
    
    User.find({"followers.follower.username":  username}).then((users, err) => {
        if(users) {
            console.log("USERLAR : " , users);
            res.json(users).status(httpStatusCode.StatusCodes.OK);
        } else {
            res.sendStatus(httpStatusCode.StatusCodes.NOT_FOUND);
        }
    })
}) 



function joiUserSchema() {
    const schema = Joi.object({
        id: Joi.any(),
        name: Joi.string()
            .min(3)
            .max(40)
            .required(),
        username: Joi.string().required(),
        password: Joi.string()
            .required(),
        email: Joi.string()
            .required(),
    });
    return schema;
}


function joiFollowerSchema() {
    const schema = Joi.object({
        id: Joi.any(),
        follower: Joi.object(),
    });
    return schema;
}
module.exports = {
    router
}

// passport.authenticate("local", new LocalStrategy({ // or whatever you want to use
//     // by default, local strategy uses username and password, we will override with email
//     usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
//     passwordField: 'password',
//     passReqToCallback: true
// }, function (req, email, password, done) {
//     console.log("BURAYA GİRMEMEMİZ GEREKLİYDİ")
//     //emaili ya da usernamei zaten var mı diye kontrol et 
//     User.findOne({ $or: [{ email: email }, { userName: req.body.userName }] }, function (err, user) {
//         if (err) {
//             console.log("ERROR")
//             return done(err);
//         }

//         // check to see if theres already a user with that email
//         if (user != null) {
//             console.log("BÖYLE BİR USER ZATEN VAR...",);
//             return done(null, false, { failureFlash: 'Username or email is already taken.' });
//         } else {
//             const body = req.body;
//             const schema = joiUserSchema();
//             const validation = schema.validate(body);
//             if (validation.error) {
//                 console.log("VALIDATION ERROR : ", validation.error);
//                 res.send()
//                 return done(null, false, { message: 'VALIDATION ERROR.' });
//                 // return res.status(httpStatusCode.StatusCodes.NOT_ACCEPTABLE).json({
//                 //     status: 'error',
//                 //     message: 'Invalid request data',
//                 //     data: body
//                 // });
//             }
//             else {
//                 console.log("BODY : ", body.userName); // body.userName geliyor başarılı bir şekilde
//                 //bodyde bulunan tüm key value değerleri newUsera aktarılıyor userName hariç...
//                 const newUser = new User(body);
//                 console.log("NEW USER : ", newUser.body)

//                 newUser.password = newUser.generateHash(password);
//                 // newUser.userName = body.userName;
//                 newUser.save().then((val) => {
//                     console.log("VALUE : ", val)
//                     return done(null, newUser);
//                     // res.status(httpStatusCode.StatusCodes.OK).send(val.id);
//                 }).catch((err) => {
//                     console.log(err);
//                     return done(null, false, { message: `BAD REQUEST. :  ${err}` });
//                     // res.status(httpStatusCode.StatusCodes.BAD_REQUEST).send(err);
//                 })
//             }
//         }
//     })
//     // find a user whose email is the same as the forms email
//     // we are checking to see if the user trying to login already exists
// }))

// passport.serializeUser(function (user, done) {
//     console.log("SERIALIZEUSER CALISTI")
//     done(null, user.id);
// });
// passport.deserializeUser((id, done) => {
//     console.log("DESERIALIZEUSER CALISTI")
//     passport.deserializeUser((id, done) => {
//         User.findById(id).then((user) => {
//             done(null, user);
//         }).catch(done);
//     });
// });