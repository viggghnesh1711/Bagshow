const express=require('express')
const router =express.Router()
const Joi = require('joi');
const logincheck=require('../middlewares/loginchecker')
const ownermodel=require('../models/ownermodel')
const usermodel=require('../models/usermodel')
const productmodel=require('../models/productmodel')
const session = require('express-session');
const flash = require('connect-flash');
const upload = require('../config/multerconfig')
const jwt =require('jsonwebtoken')
const productschema = require('../validations/productschema')
const cloudinary = require('cloudinary').v2;

router.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true
  }));

  cloudinary.config({ 
    cloud_name: 'dqizrpofa', 
    api_key: '568857784796491', 
    api_secret: '1uO4ev7w1kC0DsUdlRtjcxiA4M0'
  });

router.use(flash());

router.get("/view/:id",logincheck,async function(req,res){
  let product=await productmodel.findOne({_id:req.params.id})

res.render("product/viewproduct",{product:product,user:req.user})
})


router.get("/createproduct",logincheck,async function(req,res){
    const imgerr=""
    let owner = await ownermodel.findOne({_id:req.user.ownid})
    res.render("product/createproduct",{imgerr,owner})
})

router.post("/addproduct",logincheck, async function(req, res) {
  let owner = await ownermodel.findOne({_id:req.user.ownid})
 
  if(owner.shopname===req.body.shopname){
    try{
      const file = req.files.bagimg;
      cloudinary.uploader.upload(file.tempFilePath,async function(err,result){
    let {shopname,price,type,usertype,name,description,discount}=await productschema.validateAsync(req.body)
    let product=await productmodel.create({
        shopname,
        price,
        discount,
        bagimg:result.url,
        type,
        usertype,
        name,
        description,
        ownerid:req.user.ownid
      })
    
      await product.save()
      const owner=await ownermodel.findOne({_id:req.user.ownid});
      owner.products.push(product._id)
      await owner.save()
    })
      res.redirect("/owner/ownerprofile")
    }
  catch (err) { 
    console.log("error")
  }
  }
  else{
    console.log("invalid shop name")
  }
 
});


router.get("/editproductslist",logincheck,async function(req,res){
  let owner = await ownermodel.findOne({_id:req.user.ownid}).populate("products")
  res.render("product/editproductslist",{owner:owner,products:owner.products})
})

router.get("/edit/:id",logincheck,async function(req,res){
  try{
    const imgerr=""
    let product = await productmodel.findOne({_id:req.params.id})
    let owner = await ownermodel.findOne({_id:req.user.ownid})
    res.render("product/editproduct",{imgerr,product,owner})
  }
   catch(err){
    console.log("edit product err ",err)
   }
})

router.post("/update/:id",upload.single('bagimg'),logincheck,async function(req,res){
  const bagimg = req.file;
  try{
    let {shopname,price,type,usertype,discount,name,description}=await productschema.validateAsync(req.body)
    let updateData = {
      shopname,
      price,
      discount,
      type,
      usertype,
      name,
      description,
      ownerid: req.user.ownid
  };
  if (bagimg) {
      updateData.bagimg = bagimg.filename;
  }
  let product = await productmodel.findOneAndUpdate(
      { _id: req.params.id },
      updateData,
      { new: true }
  );
  res.redirect("/product/editproductslist");
  }
  catch(err){
    console.log("update pdoduct err",err)
    res.redirect(`/product/edit/${req.params.id}`);
  }
})

router.get("/removeproduct",logincheck,async function(req,res){
  let owner = await ownermodel.findOne({_id:req.user.ownid}).populate("products")
  res.render("product/removeproduct",{owner:owner,products:owner.products})
})

router.get("/removeproduct/:id",logincheck,async function(req,res){
  let  product=await productmodel.findOneAndDelete({_id:req.params.id})
  res.redirect("/product/removeproduct");
})

module.exports=router