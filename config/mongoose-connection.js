const mongoose=require('mongoose')
const config=require('config')
require('dotenv').config()
const dbgr=require('debug')

if(process.env.MONGO_URI){
    console.log("connected")
}
else{
    console.log("not connected")
}
mongoose
.connect(`${process.env.MONGO_URI}`)
.then(function(){
    dbgr("connected")
})
.catch(function(err){
    dbgr("error")
})

module.exports=mongoose.connection;