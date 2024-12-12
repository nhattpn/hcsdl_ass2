'use strict';
const productData = require('../data/products');

const Product = {
    async getallProduct (req, res, next) {
        try {
            // console.log("đã vào getAlluser")
            const productlist = await productData.getallProduct();
            if (productlist.status != "Get all products successfully" ) throw productlist.data
            res.send(productlist.data);
        } catch (error) {
            res.status(400).json({
                error: error
            });
        }
    },

    async getProduct (req, res, next) {
        try {
            const productlist = await productData.getProduct(req.body);
            if (productlist.status != "Get product successfully" ) throw productlist.data
            res.send(productlist.data);
        } catch (error) {
            res.status(400).json({
                error: error
            });
        }
    },

    async updateProduct(req, res, next) {
        try{
            let file = (req.file) ? req.file : req.files;
            // if (file.length === 0)      throw "No file in request"
            if (!('pid' in req.body))   throw "No pid in request"
            
            req.body.image = file
            console.log(req.body)
            const result = await productData.updateProduct(req.body);
            if (result != "Update successfully") throw result;
            res.send(result); 
        }catch (err){
            res.status(400).json({
                error: err
            });
        }
    },

    async createProduct(req, res, next) {
        try{
            let file = (req.file) ? req.file : req.files;
            if (file.length === 0) throw "No file in request"
            
            req.body.image = file
            const result = await productData.createProduct(req.body);
            if (result != "Insert successfully") throw result;
            res.send(result); 
        }catch (err){
            res.status(400).json({
                error: err
            });
        }
    },

    async deleteProduct(req, res, next){
        try{
            if( !req.params.pid ){
                throw "Input is required"
            }
            req.body.pid = req.params.pid
            const result = await productData.deleteProduct(req.body);
            if (result != "Delete successfully") throw result;
            res.send(result); 
        }catch (err) {
            res.status(400).json({
                error: err
            });
        }
    },
    async getProductby (req, res, next) {
        try {
            console.log(req.query)
            const productlist = await productData.getProductby(req.query);
            
            if (productlist.status === "Get products failed" ) throw productlist.data

            res.send(productlist.data);
        } catch (error) {
            res.status(400).json({
                error: error
            });
        }
    }
};

module.exports = Product;