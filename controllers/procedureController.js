'use strict';

const procedureData = require('../data/procedure');

const OrdersWithCustomerDetails = async (req, res, next) => {
    try {
        console.log(req.query)
        const result      = await procedureData.OrdersWithCustomerDetails(req.query);
        if (result.status != "The procedure executed successfully" ) throw result.data
        res.send(result.data);
    } catch (error) {
        res.status(400).json({
            error: error
        });
    }
}

const TotalShopRevenue = async (req, res, next) =>{
    try{
        console.log(req.query)
        if( !("start_date" in req.query) || !("end_date" in req.query) ){
            res.send('Both start_date and end_date are required');
            return
        }
        const result      = await procedureData.TotalShopRevenue(req.query);
        if (result.status != "The procedure executed successfully" ) throw result.data
        res.send(result.data);
    }catch(error){
        res.status(400).json({
            error: error
        });
    }
}

module.exports = {
    OrdersWithCustomerDetails,
    TotalShopRevenue
}