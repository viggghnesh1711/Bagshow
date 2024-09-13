const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    username:String,
    email:String,
    password:String,
    cart:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    }],
    whishlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    }],
    owner:{
        type:Boolean,
        default:false
    },
    ownid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"owner"
    },
    order:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"order"
    }],
})

module.exports=mongoose.model("user",userSchema)