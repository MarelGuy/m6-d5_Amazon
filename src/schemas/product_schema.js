const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const ProdcutSchema = new Schema(
    {
        name: String,
        description: String,
        brand: String,
        imageUrl: String,
        price: Number,
        category: String
    },
    {
        timestamps: true,
    }
)

ProdcutsModel = mongoose.model("products", ProdcutSchema)

module.exports = (ProdcutsModel) 