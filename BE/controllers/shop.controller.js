'use strict';

const shopData = require('../data/shops');

const Shop = {
    async getallShop (req, res, next) {
        try {
            console.log("đã vào getallshop")
            const shoplist = await shopData.getallShop();
            if (shoplist.status != "Get all Shops successfully" ) throw shoplist.data
            res.send(shoplist.data);
        } catch (error) {
            res.status(400).json({
                error: error
            });
        }
    },

    async updateShop(req, res, next) {
        try{
            let file = (req.file) ? req.file : req.files;
            // if (file.length === 0)      throw "No file in request"
            if (!('sid' in req.body))   throw "No pid in request"
            
            req.body.image = file
            console.log(req.body)
            const result = await shopData.updateShop(req.body);
            if (result != "Update successfully") throw result;
            res.send(result); 
        }catch (err){
            res.status(400).json({
                error: err
            });
        }
    },

    async createShop(req, res, next) {
        try{
            let file = (req.file) ? req.file : req.files;
            if (file.length === 0) throw "No file in request"
            
            req.body.image = file
            const result = await shopData.createShop(req.body);
            if (result != "Insert successfully") throw result;
            res.send(result); 
        }catch (err){
            res.status(400).json({
                error: err
            });
        }
    },

    async deleteShop(req, res, next) {
        try{   
            // console.log(req)
            if(!req.params.sid){
                throw "Input is required"
            }
            req.body.sid = req.params.sid
            const result = await shopData.deleteShop(req.body);
            if (result != "Delete successfully") throw result;
            res.send(result); 
        }catch (err) {
            res.status(400).json({
                error: err
            });
        }
    },

    async getShopby (req, res, next) {
        try {
            console.log(req.query)
            const shoplist = await shopData.getShopby(req.query);
            
            if (shoplist.status === "Get Shops failed" ) throw shoplist.data

            res.send(shoplist.data);
        } catch (error) {
            res.status(400).json({
                error: error
            });
        }
    }
};


module.exports = Shop;