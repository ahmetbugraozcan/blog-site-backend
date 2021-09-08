var express = require('express');
var router = express.Router();

const multer = require("multer");
const uuid4 = require("uuid").v4;
const path = require("path");
const User = require('../models/user');
const httpStatusCodes = require('http-status-codes')
const Blog = require('../models/blog');
const Comment = require('../models/comment');

//yapılan yorumlarda vs de değiştirmek gerekiyor hepsini...
router.post("/uploads/:id", function (req, res) {
    var mainRes = res;
    var id = req.params.id;
    //user findbyusername or id --> profil fotoğraf linkini güncelle 
    //link => localhost:9000/images/upload/username
    var storage = multer.diskStorage({
        destination: path.join(__dirname, "/public/uploads"),
        filename: function (req, file, cb) {
            const fullName =
                "user_" + uuid4().replace(/-/g, "") +
                path.extname(file.originalname);
            cb(null, fullName);
        },
    });



    var upload = multer({ storage: storage }).single('photo');

    User.findById(id, function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            upload(req, res, function (err) {
                if (err) {
                    console.log(err);
                    return res.end("Error uploading file.");
                } else {
                    if (req.file) {
                        var url = "http://" + req.headers.host + "/uploads/" + req.file.filename;
                        User.updateOne({ profilePhotoUrl: url }, (err, res) => {
                            if (err) {
                                return res.sendStatus(500);
                            }
                            else {
                                console.log("Başarılı")
                                return mainRes.status(httpStatusCodes.StatusCodes.OK).json({ profilePhotoUrl: url });
                                // uploadRes.json({
                                //     success: true,
                                //     user: {
                                //         photo: "/uploads/" + req.file.filename,
                                //     },
                                // })
                            }
                        });

                        User.updateMany({ 'followers.follower._id': req.params.id }, { $set: { 'followers.$.follower.profilePhotoUrl': url} }).then((res) => {
                        }).catch(err => console.log(err));;
        
                        Blog.updateMany({ 'author._id': req.params.id }, { $set: { 'author.profilePhotoUrl': url } }).then((res) => {
                        }).catch(err => console.log(err));
        
                        Blog.updateMany({ 'comments.commenter._id': req.params.id }, { $set: { 'comments.$.commenter.profilePhotoUrl': url } }).then((res) => {
                        }).catch(err => console.log(err));
        
                        Comment.updateMany({ 'commenter._id': req.params.id }, { $set: { 'commenter.profilePhotoUrl': url } }).then((res) => {
                        }).catch(err => console.log(err));

                    }
                    else {
                        console.log("bura")
                        return mainRes.status(httpStatusCodes.StatusCodes.NOT_ACCEPTABLE).json({error: "error"})
                    }
                }
            });
        }
    })

});


router.get('/uploads/:fileName', function (req, res) {
    var fileName = req.params.fileName;
    const filePath = `public/uploads/${fileName}` // find out the filePath based on given fileName
    res.sendFile(filePath, { root: __dirname });
});

// router.post('/image',function(req, res) {
//     upload(req, res, function (err) {
//            if (err instanceof multer.MulterError) {
//                return res.status(500).json(err)
//            } else if (err) {
//                return res.status(500).json(err)
//            }
//            console.log("error : " , err)
//       return res.status(200).send(req.file)
//     })

// });

// router.get('/image/:id' , (req, res) => {
//     console.log(res);
// })

module.exports = {
    router
}