'use strict';
const utils = require('../utils');
const config = require('../../config');
const sql = require('mssql');

const getUser = async () => {
    try {
        let pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('users');
        const userList = await pool.request()
        .query(sqlQueries.GetAllUser);//This GetAllUser is Sql file name inside the data/users folder
        return userList.recordset;
    } catch (error) {
        console.log(error.message);
    }
}
//By Stored Proc
// const getUser = async () => {
//     try {
//         let pool = await sql.connect(config.sql);
//         const sqlQueries = await utils.loadSqlQueries('Users');
//         const userList = await pool.request()
//             .input('mode', sql.Int, 1)
//             .execute("SP_User");
//         return userList.recordset;
//     } catch (error) {
//         return error.message;
//     }
// }

const getUserById = async (id) => {
    try {
        let pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('users');
        const _user = await pool.request()
            .input('uid', sql.Int, id)
            .query(sqlQueries.GetUserById);//This GetUserById is Sql file name inside the data/users folder
        return _user.recordset;
    } catch (error) {
        return error.message;
    }
}

const createUser = async (userData) => {
    try {
        let pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('users');
        const insertUser = await pool.request()
            .input('name', sql.VarChar(200), userData.name)
            .input('email', sql.VarChar(200), userData.email)
            .query(sqlQueries.CreateUser);//This CreateUser is Sql file name inside the data/users folder
        return insertUser.recordset;
    } catch (error) {
        return error.message
    }
}
const deleteUserById = async (id) => {
    try {
        let pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('users');
        const delUser = await pool.request()
            .input('id', sql.Int, id)
            .query(sqlQueries.DeleteUserByID);//This DeleteUserByID is Sql file name inside the data/users folder
        return delUser.recordset;
    } catch (error) {
        return error.message;
    }

}
const updateUser = async (id, data) => {
    try {
        let pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('users');
        const _update = await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.VarChar(200), data.name)
            .input('email', sql.VarChar(200), data.email)
            .query(sqlQueries.UpdateUser);
        return _update.recordset;
    } catch (error) {

    }
}

module.exports = {
    getUser,
    getUserById,
    createUser,
    deleteUserById,
    updateUser
}