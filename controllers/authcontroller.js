const express=require('express')
const app=express()
const usermodel=require('../models/usermodel')
const bcrypt=require('bcrypt')
const cookieparser=require('cookie-parser')
const Joi = require('joi');
const userschema=require('../validations/userschema')
const jwt=require('jsonwebtoken')
const generate=require('../utils/generatetoken')

app.use(cookieparser())

module.exports.registeruser=async function(req,res){
    let user=await usermodel.findOne({email:req.body.email})
    if(!user){
        try{
            let uname=await usermodel.findOne({username:req.body.username})
            if(!uname){
                     let {username,email,password} =await userschema.validateAsync(req.body)
                        bcrypt.genSalt(10, function(err, salt) {
                            bcrypt.hash(password, salt, async function(err, hash) {
                                    let user =await usermodel.create({
                                        username,
                                        email,
                                        password:hash
                                })
                                let token=generate.generatetoken(user)
                                res.cookie("token",token)
                                res.redirect("/home")
                            });
                        });
            }
            else{
                res.render("auth/register",{errorname:'username already exists!',error:'',erroremail:'',username:'',email:req.body.email,password:req.body.password})
            }
         }
         catch(err){
            req.flash('error','Invalid credientials')
            res.redirect("/user/register")
         }
    }
    else{
        res.render("auth/register",{erroremail:'Email already exists!',error:'',errorname:'',email:'',username:req.body.username,password:req.body.password})
    }
 }

module.exports.loginuser=async function(req,res){
    try{
        let user=await usermodel.findOne({email:req.body.email})
        if(!user){
            res.render("auth/login",{error:"Invalid credentials",email:'',password:'',errorpassword:''})
        }
        else{
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if(result){
                    let token=generate.generatetoken(user)
                    res.cookie("token",token)
                    res.redirect("/home")
                }
                else{
                    res.render("auth/login",{errorpassword:"Invalid password",email:user.email,password:'',error:''})
                }
            });
        }
    }
     catch(err){
        res.render("auth/login",{errorpassword:"",email:'',password:'',error:'Invalid credentials'})
     }   
    }