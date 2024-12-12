'use strict';
const express = require('express');
const router = express.Router();
const User = require('../../controllers/user.controller');

router.get('/getAllUser', User.getAllUser);
router.get('/getUserById/:id', User.getUserById);
router.post('/createUser', User.createUser)
router.delete('/:id', User.deleteUserById);
router.put('/:id', User.updateUser);

module.exports = router;