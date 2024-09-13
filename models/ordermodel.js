const mongoose=require('mongoose')
const usermodel = require('./usermodel')

const orderSchema=mongoose.Schema({
    name:String,
    contact:Number,
    address:String,
    email:String,
    amount:Number,
    items:Number,
    status:{
        type:String,
        default:"fail"
    }, 
    products:[{
        productid:{type:mongoose.Schema.Types.ObjectId,ref:"product"},
        quantity:{type:Number},
        price:{type:Number},
        productname:{type:String},
    }],
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    createdAt: {
        type: Date,
        default: Date.now  
    },
})

module.exports=mongoose.model("order",orderSchema)