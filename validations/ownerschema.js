const Joi = require('joi');

const ownerschema=Joi.object({
    ownername:Joi.string().required(),
    email:Joi.string().required(),
    shopname:Joi.string().required(),
    bname:Joi.string().required(),
    bcode:Joi.string().required(),
    bnumber:Joi.string().required()
})

module.exports=ownerschema