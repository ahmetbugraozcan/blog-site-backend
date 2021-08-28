var express = require('express');
var router = express.Router();
const Blog = require('../models/blog');
const httpStatusCode = require('http-status-codes')
const Comment = require('../models/comment');
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

//belirli iddeki comment
router.get('/blog/:blogID/comment/:commentId', async (req, res) => {
    var commentId = req.params.commentId;
    Comment.findById(commentId, (err, comment) => {
        if (err) {
            return res.send(err);
        } else {
            return res.json(comment);
        }
    })
})
//hepsi geliyor blog idsini belirtmemize rağmen diğer blogların commenti de gekiyor
//O blogun tüm  commentlerini getiren metod
router.get('/blog/:blogID/comment', async (req, res) => {
    var blogID = req.params.blogID;
    Comment.find({ "blog": blogID }, (err, comment) => {
        if (err) {
            return res.send(err);
        } else {
            return res.json(comment);
        }
    }).sort( { date: -1 } )
})

// router.get('/blog/:id/comment', async (req, res) => {
//     var commentId = req.params.commentId;
//     Comment.find(commentId, (err, comment) => {
//         if (err) {
//             return res.send(err);
//         } else {
//             return res.json(comment);
//         }
//     })
// })

// idsi belirtilmiş bloga comment atan metod

router.post('/blog/:id/comment', async (req, res) => {
    const body = req.body;
    const schema = joiCommentSchema();
    const validation = schema.validate(body);

    if (validation.error) {
        console.log(validation.error)
        return res.status(httpStatusCode.StatusCodes.NOT_ACCEPTABLE).json({
            status: 'error',
            message: 'Invalid request data',
            data: body
        });
    } else {
        const id = req.params.id;
        // get the comment text and record post id

        const comment = new Comment({
            comment: req.body.comment,
            commenter: req.body.commenter,
            blog: id
        })
        // save comment
        await comment.save();

        // get this particular post
        const blogRelated = await Blog.findById(id);
        // push the comment into the post.comments array
        blogRelated.comments.push(comment);

        console.log(comment)
        // save and redirect...
        await blogRelated.save(function (err) {
            if (err) { console.log(err);   res.status(httpStatusCode.StatusCodes.BAD_REQUEST)}
            res.status(httpStatusCode.StatusCodes.OK).json(comment)
        })

    }
})

function joiCommentSchema() {
    const schema = Joi.object({
        id: Joi.any(),
        date: Joi.date(),
        comment: Joi.string().min(3).max(40)
            .required(),
        commenter: Joi.object().required(),
        blog: Joi.any(),
    });
    return schema;
}

module.exports = {
    router
}