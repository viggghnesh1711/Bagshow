
const express=require('express')
const cookieparser=require('cookie-parser')
const router=express.Router()
const jwt= require('jsonwebtoken')
const usermodel=require('../models/usermodel')

router.use(cookieparser())

module.exports=async function(req,res,next){
    if(!req.cookies.token){
        req.flash("error","you need to login first")
        res.redirect("/user/login")
        }
        try{
            let decoded=jwt.verify(req.cookies.token,process.env.JWT_KEY)
            let user=await usermodel.findOne({email:decoded.email})
            req.user=user;
            next()
        }
       catch(err){
        req.flash("error","you need to login first")
       console.log(err)
       }
    }
