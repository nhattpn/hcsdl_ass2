'use strict';
const express = require('express');
const router = express.Router();
const procedureController = require('../../controllers/procedure.controller');

router.get('/orderswithcustomerdetails', procedureController.OrdersWithCustomerDetails)
router.get('/totalshoprevenue', procedureController.TotalShopRevenue)

module.exports = router;