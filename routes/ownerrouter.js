const express=require('express')
const router=express.Router()
const logincheck=require('../middlewares/loginchecker')
const Joi = require('joi');
const ownerschema=require('../validations/ownerschema')
const ownermodel=require('../models/ownermodel')
const usermodel=require('../models/usermodel')
const session = require('express-session');
const flash = require('connect-flash');

router.use(session({
    secret: 'your-secret-key', // Change this to a random string
    resave: false,
    saveUninitialized: true
  }));

router.use(flash());

router.get("/ownerprofile",logincheck,async function(req,res){
  let owner =await ownermodel.findOne({_id:req.user.ownid})
    res.render("owner/ownerprofile",{owner})
})

router.get("/createowner",logincheck,function(req,res){
    res.render("owner/createowner")
})

router.post("/createowner",logincheck,async function(req,res){
        try{
            let {ownername,shopname,email,bname,bcode,bnumber}=await ownerschema.validateAsync(req.body);
            if(req.user.email===req.body.email){
                let owner=await ownermodel.create({
                    ownername,
                    shopname,
                    owneremail:email,
                    bname,
                    bnumber,
                    bcode,
                    userid:req.user._id
                })
                let result=await usermodel.findOneAndUpdate({email:req.body.email},{owner:true,ownid:owner._id},{new:true})
                console.log("kjncdc")
                res.redirect("/owner/ownerprofile")
        }
        else{
            req.flash('info', 'Invalid email');
            console.log("cwewe",err)
            res.redirect('/owner/createowner');
        }
    }
        catch(err){
            req.flash('info', 'Invalid crediantials');
            console.log("c",err)
            res.redirect('/owner/createowner');
        }
   
    
})

router.get("/deleteowner", logincheck, async function(req, res) {
    try {
      let result = await usermodel.findOneAndUpdate(
        { email: req.user.email },
        { owner: false }
      );
      let owner = await ownermodel.findOneAndDelete({ email: req.query.email });
      res.redirect("/user/userprofile");

    } catch (error) {
      // Handle errors
      console.error("deleteing owner",error);
      res.status(500).send("Server error");
    }
  });

router.get("/profile",logincheck,function(req,res){
  res.render("owner/profile")
})

router.get("/dashboard",logincheck,function(req,res){
  res.render("owner/dashboard")
})
  
module.exports=router;