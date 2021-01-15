const express = require("express");
const mongoose = require("mongoose")

const reviewsModel = require("../../schemas/reviews_schema")

const app = express.Router()

app.get('/', async (req, res, next) => {
    try {
        const reviews = await reviewsModel.find()
        if (reviews.length >= 1) {
            res.status(200).send(reviews)
            console.log("\x1b[32m", "Someone did GET/reviews")
        } else {
            res.status(404).send("404, not found. Could it be that there aren't any reviews in the databse?")
            console.log('\x1b[33m%s\x1b[0m', "Someone did GET/reviews but encountered 404")
        }
    } catch (err) {
        console.log("\x1b[31m", err)
        next(err)
    }
});
app.get('/:id', async (req, res, next) => {
    try {
        const review = await reviewsModel.findById(req.params.id)
        if (review) {
            res.status(200).send(review)
            console.log("\x1b[32m", "Someone did GET/reviews/" + req.params.id)
        } else {
            res.status(404).send("404, not found. Wrong id or the elemnt doesn't exist?")
            console.log('\x1b[33m%s\x1b[0m', " Someone did GET/reviews/" + req.params.id + " but encountered 404")
        }
    } catch (err) {
        console.log("\x1b[31m", err)
        next(err)
    }
});
app.post('/', async (req, res, next) => {
    try {
        try {
            const newReview = new reviewsModel(req.body)
            var { _id } = await newReview.save()
            if (_id) {
                res.status(200).send("Created! here's the id of the review: " + _id)
                console.log("\x1b[32m", "Someone created a review. Id: " + _id)
            } else {
                res.send("Unknown error")
                console.log('\x1b[33m%s\x1b[0m', "Someone tried to create a review but encountered an error")
                next()
            }
        } catch (err) {
            console.log("\x1b[31m", err)
            next(err)
        }
    } catch (err) {
        console.log(err)
        next(err)
    }
});
app.put('/:id', async (req, res, next) => {
    try {
        try {
            const modifiedReview = await reviewsModel.findByIdAndUpdate(req.params.id, req.body, {
                runValidators: true,
                new: true
            })
            console.log()
            if (modifiedReview) {
                res.status(200).send("Review changed, new id:" + modifiedReview._id)
                console.log("\x1b[32m", "Someone modified a review, id: " + req.params.id)
            } else {
                res.send("Unknown error, maybe you mistaken the id?")
                console.log('\x1b[33m%s\x1b[0m', "Someone tried to modify a review but encountered an error, id: " + req.params.id)
                next()
            }
        } catch (err) {
            console.log("\x1b[31m", err)
            next(err)
        }
    } catch (err) {
        console.log(err)
        next(err)
    }
});
app.delete('/:id', async (req, res, next) => {
    try {
        try {
            const DeletedReview = await reviewsModel.findByIdAndDelete(req.params.id)
            if (DeletedReview) {
                res.status(200).send("Review deleted!")
                console.log("\x1b[32m", "Someone deleted a review, id: " + req.params.id)
            } else {
                res.send("Unknown error, maybe you mistaken the id?")
                console.log('\x1b[33m%s\x1b[0m', "Someone tried to delete a review but encountered an error, id: " + req.params.id)
                next()
            }
        } catch (err) {
            console.log("\x1b[31m", err)
            next(err)
        }
    } catch (err) {
        console.log(err)
        next(err)
    }
});


module.exports = app