'use strict';

const utils     = require('../utils');
const config    = require('../../config');
const sql       = require('mssql');

const type = {
    pid:                sql.UniqueIdentifier,
    image:              sql.VarChar,
    manufactor_date:  sql.Date,
    current_price:      sql.Float,
    name:               sql.VarChar,
    description:        sql.Text,
    avg_rating:         sql.Float,
    remain_quantity:    sql.Int,
    bid:                sql.UniqueIdentifier, 
    cid:                sql.UniqueIdentifier,
    sid:                sql.UniqueIdentifier
};

const OrdersWithCustomerDetails = async(query)=>{
    try {
        // console.log(query)
        let customer_id = (query && 'customer_id' in query)  ? query.customer_id : null;
        let status      = (query && 'status'      in query)  ? query.status      : null;
        
        let pool    = await sql.connect(config.sql);
        let result  = await pool.request()
            .input('customer_id', sql.UniqueIdentifier, customer_id)  // Cung cấp tham số với kiểu dữ liệu
            .input('status'     , sql.VarChar         , status)       // Cung cấp tham số với kiểu dữ liệu
            .query('EXEC OrdersWithCustomerDetails @customer_id, @status');

        console.log("Kết quả thủ tục:\n", result);
        sql.close();
        if (result.recordset.length <= 0) throw "No rows matching exist in the database"
        return {
            status: "The procedure executed successfully",
            data:   result.recordset
        }
    } catch (err) {
        sql.close();
        console.log(err)
        return {
            status: "The procedure executed failed",
            data:   err
        }
    }
}

module.exports = {
    OrdersWithCustomerDetails
}