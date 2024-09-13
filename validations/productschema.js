const Joi = require('joi');

const productschema=Joi.object({
    shopname: Joi.string().required(), // Ensure `shopname` is included in the schema
    type: Joi.string().valid('Backpacks', 'Handbags', 'Suitcases', 'Duffelbags', 'Luggagebags', 'Laptopbags', 'Others').required(),
    usertype: Joi.string().valid('Men', 'Women','Both').required(),
    price: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    discount: Joi.number().optional()
})

module.exports=productschema