const {Category} = require('../models/category');
const {Product} = require('../models/product');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


// http://localhost:3000/api/v1/products
router.get(`/`, async (req, res) => {
    let filter = {};
    if(req.query.categories) {
        filter = {category: req.query.categories.split(',')}
    }
    
    const productList = await Product.find(filter).populate('category').select('name image');
    if(!productList) {
        res.status(500).json({success: false})
    }
    res.send(productList); 
});

router.get(`/:id`, async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Product ID')
    }

    const product = await Product.findById(req.params.id).populate('category').select('name image -_id');

    if(!product) {
        res.status(500).json({success: false})
    }
    res.send(product); 
});

router.post(`/`, async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        if(!category) return res.status(400).send('Invalid Category ID')

        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        })

        product = await product.save();
        res.send(product);
    } catch (error) {
        console.error("Product creation error:", error);
        next(error);
    }
});

router.put('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Product ID')
    }

    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category ID')

    let product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        },
        {new: true}
    )

    if(!product)
    return res.status(500).send('Product cannot be updated!')

    res.send(product);
});

router.delete('/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id).then(product => {
        if(product) {
            return res.status(200).json({success: true, message: 'Product deleted successfully'})
        } else {
            return res.status(404).json({success: false, message: 'Product not found'})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
});

router.get(`/get/count`, async (req, res) =>{
    try {
        const productCount = await Product.countDocuments();

        res.send({
            productCount: productCount
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

router.get('/get/featured/:count', async (req, res) =>{
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({isFeatured: true}).limit(+count).select('name image -_id');

    if(!products) {
        res.status(500).json({success: false})
    }

    res.send(products);
})

module.exports = router;