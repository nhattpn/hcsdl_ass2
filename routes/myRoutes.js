'use strict';

const express = require('express');
const userControll = require('../controllers/userController');
const router = express.Router();

const {getAllUser,getUserById,createUser,deleteUserById,updateUser}=userControll

router.get('/users/getAllUser', getAllUser);//Send the all user details from the table
router.get('/users/getUserById/:id', getUserById);
router.post('/users/createUser',createUser)
router.delete('/users/deleteUserById/:id', deleteUserById);
router.put('/users/updateUser/:id',updateUser)

module.exports = {
    routes: router
}