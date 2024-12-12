'use strict';
const express = require('express');
const router = express.Router();

const userRoute = require('./user/user.route');
const productRoute = require('./product/product.route');
const shopRoute = require('./shop/shop.route');
const procedureRoute = require('./procedure/procedure.route');

router.use('/users', userRoute);
router.use('/product', productRoute);
router.use('/shop', shopRoute);
router.use('/procedure', procedureRoute);

module.exports = router;