const mongoose=require('mongoose')
const usermodel = require('./usermodel')

const ownerSchema=mongoose.Schema({
    ownername:String,
    owneremail:String,
    shopname:String,
    bname:String,
    bnumber:String,
    bcode:String,
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    products:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
        }
    ],
    dashboard:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"order"
        }
    ],
})

module.exports=mongoose.model("owner",ownerSchema)