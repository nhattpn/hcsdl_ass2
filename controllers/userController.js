'use strict';

const userData = require('../data/users');

const getAllUser = async (req, res, next) => {
    try {
        const userlist = await userData.getUser();
        res.send(userlist);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const _user = await userData.getUserById(id);
        res.send(_user);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const createUser = async (req, res, next) => {
    try {
        const data = req.body;
        const insert = await userData.createUser(data);
        res.send(insert);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const deleteUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const _user = await userData.deleteUserById(id);
        res.send(_user);
    } catch (error) {
        res.status(400).send(error.message)
    }
}
const updateUser = async (req, res, next) => {
    try {
        const id =  req.params.id;
        const data = req.body;
        const updated = await userData.updateUser(id, data);
        res.send(updated);
    } catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = {
    getAllUser,
    getUserById,
    createUser,
    deleteUserById,
    updateUser
}