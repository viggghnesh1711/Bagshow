const jwt=require('jsonwebtoken')
const config=require('config')
require('dotenv').config()

const generatetoken=(user)=>{
    return jwt.sign({email:user.email,id:user._id},process.env.JWT_KEY)
}
module.exports.generatetoken=generatetoken;