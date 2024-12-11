'use strict';

const express = require('express');
const userControll = require('../controllers/userController');
const productControl = require('../controllers/productController');
const procedureControl = require('../controllers/procedureController');
const router = express.Router();
const {getAllUser,getUserById,createUser,deleteUserById,updateUser}=userControll

const {upload} = require('./upload');

router.get('/users/getAllUser', getAllUser);//Send the all user details from the table
router.get('/users/getUserById/:id', getUserById);
router.post('/users/createUser',createUser)
router.delete('/users/deleteUserById/:id', deleteUserById);
router.put('/users/updateUser/:id',updateUser);

router.get('/product/getall', productControl.getallProduct)
router.put('/product/update', upload.array('image', 1), productControl.updateProduct)
router.post('/product/create', upload.array('image', 1), productControl.createProduct)
router.delete('/product/delete', productControl.deleteProduct)
router.get('/product/get', productControl.getProduct)
router.get('/product/getby', productControl.getProductby)

router.get('/procedure/orderswithcustomerdetails', procedureControl.OrdersWithCustomerDetails)
router.get('/procedure/totalshoprevenue', procedureControl.TotalShopRevenue)
module.exports = {
    routes: router
}