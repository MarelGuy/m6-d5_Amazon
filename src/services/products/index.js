const express = require("express");
const mongoose = require("mongoose")

const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../../config/cloudinary")

const productModel = require("../../schemas/product_schema")

const app = express.Router()

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: process.env.FOLDER_NAME
    }
})
const multerCloudinary = multer({
    "storage": storage
})

app.get('/', async (req, res, next) => {
    try {
        const products = await productModel.find().populate("reviews")
        if (products.length >= 1) {
            res.status(200).send(products)
            console.log("\x1b[32m", "Someone did GET/products")
        } else {
            res.status(404).send("404, not found. Could it be that there aren't any products in the databse?")
            console.log('\x1b[33m%s\x1b[0m', "Someone did GET/products but encountered 404")
        }
    } catch (err) {
        console.log("\x1b[31m", err)
        next(err)
    }
});

app.get('/:id', async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.id).populate("reviews")
        if (product) {
            res.status(200).send(product)
            console.log("\x1b[32m", "Someone did GET/products/" + req.params.id)
        } else {
            res.status(404).send("404, not found. Wrong id or the elemnt doesn't exist?")
            console.log('\x1b[33m%s\x1b[0m', " Someone did GET/products/" + req.params.id + " but encountered 404")
        }
    } catch (err) {
        console.log("\x1b[31m", err)
        next(err)
    }
});

app.post('/', async (req, res, next) => {
    try {
        const newProduct = new productModel(req.body)
        var { _id } = await newProduct.save()
        if (_id) {
            res.status(200).send("Created! here's the id of the product: " + _id)
            console.log("\x1b[32m", "Someone created a product. Id: " + _id)
        } else {
            res.send("Unknown error")
            console.log('\x1b[33m%s\x1b[0m', "Someone tried to create a product but encountered an error")
            next()
        }
    } catch (err) {
        console.log("\x1b[31m", err)
        next(err)
    }
});

app.post("/:id/imageupload", multerCloudinary.single("imageUrl"), async (req, res, next) => {
    try {
        console.log("\x1b[32m", "Someone uploaded an image on product id: " + req.params.id)
        res.status(201).send("Image uploaded on product id:" + req.params.id)
    } catch (err) {
        console.log("\x1b[31m", err)
        next(err)
    }
})

app.put('/:id', async (req, res, next) => {
    try {
        const modifiedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true
        })
        console.log()
        if (modifiedProduct) {
            res.status(200).send("Product changed, new id:" + modifiedProduct._id)
            console.log("\x1b[32m", "Someone modified a product, id: " + req.params.id)
        } else {
            res.send("Unknown error, maybe you mistaken the id?")
            console.log('\x1b[33m%s\x1b[0m', "Someone tried to modify a product but encountered an error, id: " + req.params.id)
            next()
        }
    } catch (err) {
        console.log("\x1b[31m", err)
        next(err)
    }
});

app.delete('/:id', async (req, res, next) => {
    try {
        const DeletedProduct = await productModel.findByIdAndDelete(req.params.id)
        if (DeletedProduct) {
            res.status(200).send("Product deleted!")
            console.log("\x1b[32m", "Someone deleted a product, id: " + req.params.id)
        } else {
            res.send("Unknown error, maybe you mistaken the id?")
            console.log('\x1b[33m%s\x1b[0m', "Someone tried to delete a product but encountered an error, id: " + req.params.id)
            next()
        }
    } catch (err) {
        console.log("\x1b[31m", err)
        next(err)
    }
});



module.exports = app