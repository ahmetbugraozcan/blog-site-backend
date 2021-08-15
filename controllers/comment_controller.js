var express = require('express');
var router = express.Router();
const Blog = require('../models/blog');
const httpStatusCode = require('http-status-codes')
const Comment = require('../models/comment');


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
router.get('/blog/:blogID/comment', async (req, res) => {
    var commentId = req.params.commentId;
    Comment.find((err, comment) => {
        if (err) {
            return res.send(err);
        } else {
            return res.json(comment);
        }
    })
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

router.post('/blog/:id/comment', async (req, res) => {
    // find out which post you are commenting
    const id = req.params.id;
    // get the comment text and record post id

    const comment = new Comment({
        text: req.body.text,
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
        if (err) { console.log(err) }
        res.status(httpStatusCode.StatusCodes.OK).json(comment)
    })

})

module.exports = {
    router
}