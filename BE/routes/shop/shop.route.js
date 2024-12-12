'use strict';
const express = require('express');
const router = express.Router();
const Shop = require('../../controllers/shop.controller');
const {upload} = require('../upload');

// shopController.createProduct
router.get('/getall', Shop.getallShop)
router.post('/create', upload.array('logo', 1), Shop.createShop)
router.put('/update', upload.array('logo', 1), Shop.updateShop)
router.delete('/delete/:sid', Shop.deleteShop)
router.get('/getby', Shop.getShopby)

module.exports = router;