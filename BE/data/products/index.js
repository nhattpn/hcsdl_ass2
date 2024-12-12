'use strict';

const utils     = require('../utils');
const config    = require('../../config');
const sql       = require('mssql');

const type = {
    pid:                sql.UniqueIdentifier,
    image:              sql.VarChar,
    manufactor_date:    sql.Date,
    current_price:      sql.Float,
    name:               sql.VarChar,
    description:        sql.Text,
    avg_rating:         sql.Float,
    remain_quantity:    sql.Int,
    bid:                sql.UniqueIdentifier, 
    cid:                sql.UniqueIdentifier,
    sid:                sql.UniqueIdentifier
};

const getallProduct = async()=>{
    try {
        let pool = await sql.connect(config.sql);
        let result = await pool.request()
        .query('SELECT * FROM Products');
        console.log("Kết quả truy vấn:", result);
        sql.close();
        if (result.recordset.length <= 0) throw "No products exist in the Products table"
        return {
            status: "Get all products successfully",
            data:   result.recordset
        }
    } catch (err) {
        // console.error("Lỗi khi thực hiện truy vấn:", err.message);
        sql.close();
        // return err
        return {
            status: "Get all products failed",
            data:   err
        }
    }
}

const getProduct    = async(body)=>{
    try {
        let pool = await sql.connect(config.sql);
        let result = await pool.request().query(`SELECT * FROM Products WHERE pid = '${body.pid}'`);
        console.log("Kết quả truy vấn:", result);
        sql.close();
        if (result.recordset.length <= 0) throw "No products exist in the Products table"
        return {
            status: "Get product successfully",
            data:   result.recordset
        }
    } catch (err) {
        sql.close();
        return {
            status: "Get products failed",
            data:   err
        }
    }
}

const updateProduct = async (body) => {
    try {
        let pool = await sql.connect(config.sql);
        for (let [key, value] of Object.entries(body)) {
            if( (key === "pid") || (key === "image") ) continue
            let result = await pool.request()
                .query(`
                    UPDATE Products
                    SET ${key}  = '${value}'
                    WHERE pid   = '${body.pid}';
                `);

            console.log(result)
            if (result.rowsAffected[0] === 1) {
                console.log(`Key: ${key}, Value: ${value} is update successfully`);
            } else {
                throw `Insert error at ${key}: ${value}`;
            }
        }
        if ('image' in body && body.image.length > 0){
            let image_res =  await pool.request().query(`SELECT image FROM Products WHERE pid = '${body.pid}'`)
            console.log(image_res)
            if (image_res.recordset.length > 0) {
                let del = await deleteimage(image_res.recordset[0].image);
                if   (del === 'successfully')   console.log('Delete old image successfully');
                else console.log('Delete old image failed');
            }
            let result = await pool.request()
                .input('image', type['image'], body.image[0].path)
                .query(`
                    UPDATE Products
                    SET image   = @image
                    WHERE pid   = '${body.pid}';
                `);
            console.log(result)
            if (result.rowsAffected[0] === 1) {
                console.log(`Key: image, Value: ${body.image[0].path} is update successfully`);
            } else {
                throw `Insert error at image: ${body.image[0].path}`;
            }
        }
        sql.close();
        return "Update successfully"
    } catch (error) {
        sql.close();
        return error;
    }
}

const createProduct = async (body)=> {
    try {
        let pool = await sql.connect(config.sql);
        let result = await pool.request()
            .input('image', type['image'], body.image[0].path)
            .query(`
                INSERT INTO Products (pid, image, manufactor_date, current_price, name, description, avg_rating, remain_quantity, bid, cid, sid)
                VALUES ('${body.pid}', @image , '${body.manufactor_date}', ${body.current_price}, '${body.name}', '${body.description}', ${body.avg_rating}, ${body.remain_quantity}, '${body.bid}', '${body.cid}', '${body.sid}')
            `);
        console.log(result)
        sql.close();

        if (result.rowsAffected[0] === 1) {
            return "Insert successfully"
        } else {
            let del = await deleteimage(body.image[0].path);
            if (del === 'successfully') console.log('Delete image successfully');
            else console.log('Delete image failed');
            return 'Insert error';
        }
    } catch (error) {
        sql.close();
        let del = await deleteimage(body.image[0].path);
        if (del === 'successfully') console.log('Delete image successfully');
        else console.log('Delete image failed');
        return error.message;
    }
}

const deleteProduct = async(body)=> {
    try{
        let pool = await sql.connect(config.sql);
        let path_res = await pool.request().query(`
                SELECT image FROM Products WHERE pid = '${body.pid}'
            `)
        if (path_res.recordset.length <= 0) throw "pid is not exist in Products"

        let result = await pool.request()
            .query(`
                DELETE FROM Products WHERE pid = '${body.pid}'
            `);
        console.log(result)
        console.log(path_res)
        sql.close();
        
        let path = path_res.recordset[0].image
        if (result.rowsAffected[0] === 1) {
            let del = await deleteimage(path)
            if      (del != 'successfully') console.log('Delete image failed');
            else    console.log('Delete image successfully');
            return  "Delete successfully"
        } else {
            return  'Delete error';
        }
    }catch(err){
        return err
    }
}

const deleteimage   = async (path) => {
    const fs = require('fs').promises; // Sử dụng fs.promises để hỗ trợ Promise
    try {
        await fs.unlink(path); // Sử dụng await để chờ xóa file hoàn thành
        return 'successfully';
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.error('File does not exist.');
        } else {
            console.error('Error while deleting the file:', err.message);
        }
        return err.message; // Trả về thông báo lỗi nếu có lỗi xảy ra
    }
}

const getProductby  = async(body)=>{
    try {
        // console.log(body)
        let pool = await sql.connect(config.sql);
        const [key, value] = Object.entries(body)[0];
        if (!type[key]) {
            throw new Error(`Invalid data type for key: ${key}`);
        }
        if (key === 'description') {
            let result = await pool.request()
            .query(`
                SELECT * FROM Products 
                WHERE CAST(description AS VARCHAR(MAX)) = '${value}'`
            );
            console.log("Kết quả truy vấn:", result);
            sql.close();
            if (result.recordset.length <= 0) throw new Error("No products exist in the Products table")
            return {
                status: `Get products by ${key}: ${value} successfully`,
                data:   result.recordset
            }
        } else {
            let result = await pool.request()
            .input( 'value', type[key], value)
            .query(`SELECT * FROM Products WHERE ${key} = @value`);
            console.log("Kết quả truy vấn:", result);
            sql.close();
            if (result.recordset.length <= 0) throw new Error("No products exist in the Products table")
            return {
                status: `Get products by ${key}: ${value} successfully`,
                data:   result.recordset
            }
        }   
    } catch (err) {
        sql.close();
        return {
            status: "Get products failed",
            data:   err
        }
    }
}

module.exports = {
    getallProduct,
    updateProduct,
    createProduct,
    deleteProduct,
    getProduct,
    getProductby
}