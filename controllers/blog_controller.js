var express = require('express');
const Blog = require('../models/blog');
var router = express.Router();
const httpStatusCode = require('http-status-codes');
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const blogPath = "/blog";

// User.findOne({ $or: [{ email: email }, { userName: req.body.userName }] }
router.get(blogPath + '/:userid/likedPosts', (req, res) => {
    var userid = req.params.userid;
    
    Blog.find({"likes.likerID":  userid}).then((blogs, err) => {
        if(blogs) {
            res.json(blogs);
        } else {
            res.sendStatus(httpStatusCode.StatusCodes.NOT_FOUND);
        }
    })
}) 

router.get(blogPath + '/:userid/bookmarkedPosts', (req, res) => {
    var userid = req.params.userid;
    
    Blog.find({"bookmarkedUserIDs":  userid}).then((blogs, err) => {
        if(blogs) {
            res.json(blogs);
        } else {
            res.sendStatus(httpStatusCode.StatusCodes.NOT_FOUND);
        }
    })
}) 

router.get(blogPath, (req, res) => {
    Blog.find((err, blogs) => {
        if (err) {
            return res.send(err);
        } else {
            return res.json(blogs);
        }
    }).sort( { createdDate:-1 } )
});

router.get(blogPath + '/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id, (err, blogs) => {
        if (err) {
            return res.send(err);
        } else {
            return res.json(blogs);
        }
    })
});

//sadece USERID gelecek ve user bilgilerini biz çekeceğiz databaseden !! ÖNEMLİ
router.post(blogPath, async (req, res) => {
    const data = req.body;
    const schema = joiBlogSchema();
    const validation = schema.validate(data);
    if (validation.error) {
        console.log(validation.error);
        return res.status(httpStatusCode.StatusCodes.NOT_ACCEPTABLE).json({
            status: 'error',
            message: 'Invalid request data',
            data: data
        });
    }
    else {
        const blog = new Blog(data);
        blog.save((err, data) => {
            if (err) {
                console.log("ERROR : " , ERR)
                return res.status(httpStatusCode.StatusCodes.NOT_ACCEPTABLE).json({
                    status: 'error',
                    message: err.message,
                });
            } else {
                console.log(req.session)
                return res.status(httpStatusCode.StatusCodes.ACCEPTED).json(blog)
            }
        });
    }

})

const updateBlog = async (item) => {
    const blog = JSON.parse(item);
    const data = await Blog.findById(blog.model.sId);
    if (!data) {
        return false;
    } else {
        data.title = blog.model.title;
        data.content = blog.model.content;
        data.save();
        return true;
    }
}
//blog sahibi idsi eklensin 

function joiBlogSchema() {
    const schema = Joi.object({
        id: Joi.any(),
        title: Joi.string()
            .min(3)
            .max(40)
            .required(),
        content: Joi.object(),
        previewSubtitle: Joi.string(),
        image: Joi.string()
            .min(3)
            .max(200)
            .required(),
        createdDate: Joi.date(),
        numberOfView: Joi.number(),
        likes: Joi.array(),
        comments: Joi.array(),
        author: Joi.object().required(),
    } , { minimize: false });
    return schema;
}

module.exports = {
    router,
    updateBlog
}