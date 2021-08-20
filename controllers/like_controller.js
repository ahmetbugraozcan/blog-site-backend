var express = require('express');
var router = express.Router();
const Blog = require('../models/blog');
const httpStatusCode = require('http-status-codes')
const Comment = require('../models/comment');
const Joi = require('joi');
const Like = require('../models/like');
Joi.objectId = require('joi-objectid')(Joi)


router.post('/blog/:id/like', async (req, res) => {
    const body = req.body;
    const schema = joiLikeSchema();
    const validation = schema.validate(body);

    if (validation.error) {
        console.log(validation.error ," aasdasda")
        return res.status(httpStatusCode.StatusCodes.NOT_ACCEPTABLE).json({
            status: 'error',
            message: 'Invalid request data',
            data: body
        });
    } else {
        const id = req.params.id;
        // get the comment text and record post id

        const like = new Like({
            commenterID: req.body.userID,
            blog: id
        })
        // save comment
        await like.save();

        // get this particular post
        const blogRelated = await Blog.findById(id);
        // push the comment into the post.comments array
        blogRelated.likes.push(like);

        // save and redirect...
        await blogRelated.save(function (err) {
            if (err) { console.log(err) }
            res.status(httpStatusCode.StatusCodes.OK).json(like)
        })
    }
})

function joiLikeSchema() {
    const schema = Joi.object({
        id: Joi.any(),
        date: Joi.date(),
        likerID: Joi.any().required(),
    });
    return schema;
}

module.exports = {
    router
}