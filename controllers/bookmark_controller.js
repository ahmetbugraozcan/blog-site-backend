var express = require('express');
var router = express.Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const httpStatusCode = require('http-status-codes')
const Comment = require('../models/comment');
const Joi = require('joi');
const Bookmark = require('../models/bookmark');
var mongo = require('mongodb');
Joi.objectId = require('joi-objectid')(Joi)


router.post('/blog/:id/bookmark', async (req, res) => {
    console.log("BURAYA GİRDİK")
    var isBookmarkedEarly = false;
    const body = req.body;
    const schema = joiBookmarkSchema();
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

        const bookmark = new Bookmark({
            bookmarkedUserID: req.body.bookmarkedUserID,
            blog: req.body.blog
        })
        // save comment
        // await like.save();

        // get this particular post
        var userID = new mongo.ObjectID(req.body.bookmarkedUserID);
        const userRelated = await User.findById(userID);
        const blogRelated = await Blog.findById(id);


        // push the comment into the post.comments array
        userRelated.bookmarks.forEach(bookmarkItem => {
            if (bookmarkItem.bookmarkedUserID == bookmark.bookmarkedUserID ) {
                isBookmarkedEarly = true;
                console.log("DAHA ÖNCE KAYDEDİLMİŞ")
            }
        });

        if (!isBookmarkedEarly) {
            blogRelated.bookmarkedUserIDs.push(req.body.bookmarkedUserID);
            userRelated.bookmarks.push(bookmark);
        } else {
            userRelated.bookmarks.forEach(bookmarkItem => {
                if (bookmarkItem.bookmarkedUserID == bookmark.bookmarkedUserID) {
                    userRelated.bookmarks.remove(bookmarkItem);
                    blogRelated.bookmarkedUserIDs.remove(req.body.bookmarkedUserID);

                }
            });
            // blogRelated.likes.remove
        };

        // save and redirect...
        await blogRelated.save(function (err) {
            if (err) { console.log(err, "SAVE ERROR") }
        })
        await userRelated.save(function (err) {
            if (err) { console.log(err, "SAVE ERROR") }
            if (!isBookmarkedEarly) {
                res.status(httpStatusCode.StatusCodes.OK).json(bookmark)
            }
            else {
                res.status(httpStatusCode.StatusCodes.ACCEPTED).json(bookmark)
            }
        })
    }
})

function joiBookmarkSchema() {
    const schema = Joi.object({
        blog: Joi.object().required(),
        bookmarkedUserID: Joi.string().required(),
    });
    return schema;
}

module.exports = {
    router
}