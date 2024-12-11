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

const TotalShopRevenue = async (query) => {
    try {
        // Lấy các tham số từ query hoặc gán giá trị mặc định
        //console.log(query)
        let start_date   = (query && 'start_date' in query)   ?  query.start_date   : null;  // Ngày bắt đầu
        let end_date     = (query && 'end_date' in query)     ?  query.end_date     : null;  // Ngày kết thúc
        // if(start_date === null && end_date === null) throw new Error   ("Both start_date and end_date are required")
        
        let shop_name    = (query && 'shop_name'    in query) ? query.shop_name     : null; // Tên cửa hàng
        let min_revenue  = (query && 'min_revenue'  in query) ? query.min_revenue   : null; // Doanh thu tối thiểu
        let sort_column  = (query && 'sort_column'  in query) ? query.sort_column   : null; // Cột sắp xếp
        let sort_order   = (query && 'sort_order'   in query) ? query.sort_order    : null; // Thứ tự sắp xếp

        console.log(start_date, end_date, shop_name, min_revenue, sort_column, sort_order)
        // Kết nối SQL
        let pool = await sql.connect(config.sql);
        
        // Chuẩn bị và thực thi truy vấn
        let result = await pool.request()
            .input('sd'     , sql.Date  , start_date)
            .input('ed'     , sql.Date  , end_date)
            .input('shop_name'      , sql.NVarChar(100) , shop_name)
            .input('Min_Revenue'    , sql.Float         , min_revenue)
            .input('Sort_Column'    , sql.NVarChar(50)  , sort_column)
            .input('Sort_Order'     , sql.NVarChar(4)   , sort_order)
            .query('EXEC total_shop_revenue @sd, @ed, @shop_name, @Min_Revenue, @Sort_Column, @Sort_Order');

        console.log("Kết quả thủ tục:\n", result);
        
        // Đóng kết nối
        sql.close();

        // Xử lý kết quả trả về
        // if (result.recordset.length <= 0) throw "No rows matching exist in the database";

        return {
            status: "The procedure executed successfully",
            data: result.recordset
        };

    } catch (err) {
        // Đóng kết nối khi lỗi xảy ra
        sql.close();
        console.error(err);
        return {
            status: "The procedure executed failed",
            data: err
        }
    }
}

module.exports = {
    OrdersWithCustomerDetails,
    TotalShopRevenue
}