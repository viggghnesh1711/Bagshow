const mongoose=require('mongoose')
const usermodel = require('./usermodel')
const ownermodel = require('./ownermodel')

const productSchema=mongoose.Schema({
    shopname:String,
    type:String,
    bagimg:String,
    price:Number,
    discount: {
      type:Number,
      default:0
    },
    name:String,
    description:String,
    ownerid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"owner"
    },
    type: {
        type: String,
        required: true,
        enum: ['Backpacks', 'Handbags', 'Suitcases', 'Duffelbags', 'Luggagebags', 'Laptopbags', 'Others']
      },
      usertype: {
        type: String,
        required: true,
        enum: ['Men', 'Women', 'Both']
      }
  
})

module.exports=mongoose.model("product",productSchema)