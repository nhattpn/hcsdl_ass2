'use strict';
const express = require('express');
const router = express.Router();

const Product = require('../../controllers/product.controller');
const {upload} = require('../upload');

Product.createProduct
router.get('/getall', Product.getallProduct)
router.put('/update', upload.array('image', 1), Product.updateProduct)
router.post('/create', upload.array('image', 1), Product.createProduct)
router.delete('/delete/:pid', Product.deleteProduct)
router.get('/get/:id', Product.getProduct) // ko dùng
router.get('/getby', Product.getProductby)

module.exports = router