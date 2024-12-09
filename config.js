'use strict';

const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();

const {PORT, HOST, SQL_USER, SQL_PASSWORD, SQL_DATABASE, SQL_SERVER, SQL_INSTANCENAME, SQL_PORT} = process.env;

const SQL_ENCRYPT = process.env.SQL_ENCRYPT === "true";
const SQL_TRUSTSERVERCERTIFICATE = process.env.SQL_TRUSTSERVERCERTIFICATE === 'true';
const SQL_ENABLEARITHABORT = process.env.SQL_ENABLEARITHABORT=== 'true;';
const SQL_TRUSTEDCONNECTION = process.env.SQL_TRUSTEDCONNECTION === 'true';


assert(PORT, 'PORT is require');
assert(HOST, 'HOST is required');

module.exports = {
    port: Number(PORT),
    host: HOST,
    // url: HOST_URL,
    sql: {
        user:   SQL_USER,
        password:   SQL_PASSWORD,
        server: SQL_SERVER,
        database:   SQL_DATABASE,
        user:   SQL_USER,
        password:   SQL_PASSWORD,
        options: {
            encrypt:    SQL_ENCRYPT,
            trustServerCertificate: SQL_TRUSTSERVERCERTIFICATE,
            trustedConnection:  SQL_TRUSTEDCONNECTION,
            enableArithAbort:   SQL_ENABLEARITHABORT,
            instancename:       SQL_INSTANCENAME
        },
        port: Number(SQL_PORT)
    },
};