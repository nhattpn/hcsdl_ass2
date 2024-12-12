'use strict';

const utils     = require('../utils');
const config    = require('../../config');
const sql       = require('mssql');

const type = {
    sid:                sql.UniqueIdentifier,
    uid:                sql.UniqueIdentifier,
    image:              sql.VarChar,
    logo:               sql.VarChar,
    name:               sql.NVarChar,
    description:        sql.Text,
    avg_rating:         sql.Float,
    address:            sql.NText
};

const getallShop = async()=>{
    try {
        let pool = await sql.connect(config.sql);
        let result = await pool.request().query('SELECT * FROM Shops');
        console.log("Kết quả truy vấn:\n", result);
        sql.close();
        if (result.recordset.length <= 0) throw "No Shops exist in the Shops table"
        return {
            status: "Get all Shops successfully",
            data:   result.recordset
        }
    } catch (err) {
        // console.error("Lỗi khi thực hiện truy vấn:", err.message);
        sql.close();
        // return err
        return {
            status: "Get all Shops failed",
            data:   err
        }
    }
}

const updateShop = async (body) => {
    try {
        let pool = await sql.connect(config.sql);
        for (let [key, value] of Object.entries(body)) {
            if( (key === "sid") || (key === "image") ) continue
            let result = await pool.request()
                .query(`
                    UPDATE Shops
                    SET ${key}  = '${value}'
                    WHERE sid   = '${body.sid}';
                `);

            console.log(result)
            if (result.rowsAffected[0] === 1) {
                console.log(`Key: ${key}, Value: ${value} is update successfully`);
            } else {
                throw `Insert error at ${key}: ${value}`;
            }
        }
        if ('image' in body && body.image.length > 0){
            let image_res =  await pool.request().query(`SELECT logo FROM Shops WHERE sid = '${body.sid}'`)
            console.log(image_res)
            if (image_res.recordset.length > 0) {
                let del = await deleteimage(image_res.recordset[0].image);
                if   (del === 'successfully')   console.log('Delete old image successfully');
                else console.log('Delete old image failed');
            }
            let result = await pool.request()
                .input('image', type['image'], body.image[0].path)
                .query(`
                    UPDATE Shops
                    SET logo   = @image
                    WHERE sid   = '${body.sid}';
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

const createShop = async (body)=> {
    try {
        console.log(body)
        let pool = await sql.connect(config.sql);
        let result = await pool.request()
            .input('logo', type['image'], body.image[0].path)
            .query(`
                INSERT INTO Shops (sid, uid, name, address, logo, avg_rating)
                VALUES ('${body.sid}', '${body.uid}', '${body.name}', '${body.address}', @logo, '${body.avg_rating}')
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

const deleteShop = async(body)=> {
    try{
        // console.log(body)
        let pool = await sql.connect(config.sql);
        let path_res = await pool.request()
            .input('sid', type['sid'], body.sid)
            .query(`
                SELECT logo FROM Shops WHERE sid = @sid
            `)
        // console.log(path_res)
        if (path_res.recordset.length <= 0) throw "sid is not exist in Shops"

        let result = await pool.request()
            .input('sid', type['sid'], body.sid)
            .query(`
                DELETE FROM Shops WHERE sid = @sid
            `);
        console.log(result)
        console.log(path_res)
        sql.close();
        
        let path = path_res.recordset[0].logo
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

const getShopby  = async(body)=>{
    try {
        // console.log(body)
        let pool = await sql.connect(config.sql);
        const [key, value] = Object.entries(body)[0];
        if (!type[key]) {
            throw new Error(`Invalid data type for key: ${key}`);
        }
        if (key === 'address') {
            let result = await pool.request()
            .input('addressValue', sql.NVarChar, value)
            .query(`
                SELECT * FROM Shops 
                WHERE CAST(address AS NVARCHAR(MAX)) = @addressValue`
            );
            console.log("Kết quả truy vấn:\n", result);
            sql.close();
            if (result.recordset.length <= 0) throw new Error("No shops exist in the Products table")
            return {
                status: `Get Shops by ${key}: ${value} successfully`,
                data:   result.recordset
            }
        } else {
            let result = await pool.request()
            .input( 'value', type[key], value)
            .query(`SELECT * FROM Shops WHERE ${key} = @value`);
            console.log("Kết quả truy vấn:", result);
            sql.close();
            if (result.recordset.length <= 0) throw new Error("No products exist in the Shops table")
            return {
                status: `Get Shops by ${key}: ${value} successfully`,
                data:   result.recordset
            }
        }   
    } catch (err) {
        sql.close();
        return {
            status: "Get Shops failed",
            data:   err
        }
    }
}

module.exports = {
    getallShop,
    updateShop,
    createShop,
    deleteShop,
    getShopby
}