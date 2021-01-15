const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const ReviewSchema = new Schema(
    {
        comment: String,
        rate: Number
    },
    {
        timestamps: true,
    }
)

ReviewModel = mongoose.model("reviews", ReviewSchema)

module.exports = (ReviewModel) 