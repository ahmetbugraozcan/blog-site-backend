var express = require('express');
const Blog = require('../models/blog');
var router = express.Router();
const httpStatusCode = require('http-status-codes');
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const blogPath = "/blog";
//tüm blogları getirir
router.get(blogPath, (req, res) => {
    Blog.find((err, blogs) => {
        if (err) {
            return res.send(err);
        } else {
            return res.json(blogs);
        }
    })
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
                console.log("ERROR : " ,err);
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
        content: Joi.string().min(40).required(),
        image: Joi.string()
            .min(3)
            .max(200)
            .required(),
        createdDate: Joi.date(),
        numberOfView: Joi.number(),
        likes: Joi.array(),
        comments: Joi.array(),
        authorName: Joi.string().required(),
        authorID: Joi.string().required(),
    });
    return schema;
}

module.exports = {
    router,
    updateBlog
}