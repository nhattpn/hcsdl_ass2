'use strict';

const productData = require('../data/procedure');

const OrdersWithCustomerDetails = async (req, res, next) => {
    try {
        console.log(req.query)
        const productlist      = await productData.OrdersWithCustomerDetails(req.query);
        if (productlist.status != "The procedure executed successfully" ) throw productlist.data
        res.send(productlist.data);
    } catch (error) {
        res.status(400).json({
            error: error
        });
    }
}

module.exports = {
    OrdersWithCustomerDetails
}