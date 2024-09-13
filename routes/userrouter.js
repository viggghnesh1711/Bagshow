const express=require('express')
const router=express.Router()
const {registeruser, loginuser}=require('../controllers/authcontroller')
const generate=require('../utils/generatetoken')
const logincheck=require('../middlewares/loginchecker')
const jwt=require('jsonwebtoken')
const usermodel= require('../models/usermodel')
const productmodel=require('../models/productmodel')
const ordermodel = require('../models/ordermodel')
const Razorpay = require("razorpay");
const config=require('config')
require('dotenv').config();
const crypto = require('crypto');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const razorpayInstance = new Razorpay({
  key_id: process.env.PUBLISHABLE_KEY,
  key_secret: process.env.SECRET_KEY
});

router.get("/register",function(req,res){
    let username = '';
    let email ='';
    let password ='';
    let errorname='';
    let erroremail='';
    let error=req.flash('error');
    res.render('auth/register', {error,username, email, password, errorname, erroremail});
})

router.post("/signup", registeruser)

router.get("/login",function(req,res){
    res.render("auth/login",{error:'',email:'',password:'',errorpassword:''})
 })

router.post("/signin", loginuser)

router.get("/userprofile",logincheck,function(req,res){
    let user=req.user.username
    const messages = req.flash('infosucess');
    res.render("user/userprofile",{owner:req.user.owner,messages,username:user})
})

router.get("/signout",logincheck,function(req,res){
    res.clearCookie('token');
    res.clearCookie('connect.sid');
    res.redirect("/user/login")
})

router.get("/add/:id",logincheck,async function(req,res){
    let user = await usermodel.findOne({_id:req.user._id})
    if(user.cart.includes(req.params.id)){
        console.log("product already exists")
    }
    else{
        user.cart.push(req.params.id)
        await user.save();
    }
    res.redirect("/home")
})

router.get("/remove/:id",logincheck,async function(req,res){
    let user = await usermodel.findOne({_id:req.user._id})
    if(user.cart.includes(req.params.id)){
        let user = await usermodel.findOneAndUpdate({_id:req.user._id}, { $pull: { cart: req.params.id } },{new : true})
    }
    else{
        console.log("already removed")
    }
    res.redirect("/home");
})

router.get("/whishlist",logincheck,async function(req,res){
    let user = await usermodel.findOne({_id:req.user._id})
    let products = await productmodel.find({ '_id': { $in: user.whishlist } });
    res.render("user/whishlist",{whishlist:user.whishlist,products:products})
})

router.get("/addproduct/:id",logincheck,async function(req,res){
    let user = await usermodel.findOne({_id:req.user._id})
    if(user.cart.includes(req.params.id)){
        console.log("product already exists")
    }
    else{
        user.cart.push(req.params.id)
        await user.save();
    }
    res.redirect(`/product/view/${req.params.id}`);
})

router.get("/removeproduct/:id",logincheck,async function(req,res){
    let user = await usermodel.findOne({_id:req.user._id})
    if(user.cart.includes(req.params.id)){
        let user = await usermodel.findOneAndUpdate({_id:req.user._id}, { $pull: { cart: req.params.id } },{new : true})
    }
    else{
        console.log("already removed")
    }
    res.redirect(`/product/view/${req.params.id}`);
})

router.get("/addwhishlist/:id",logincheck,async function(req,res){
    let user = await usermodel.findOne({_id:req.user._id})
    if(user.whishlist.includes(req.params.id)){
        console.log("product already exists")
    }
    else{
        user.whishlist.push(req.params.id)
        await user.save();
    }
    res.redirect(`/product/view/${req.params.id}`);
})

router.get("/removewhishlist/:id",logincheck,async function(req,res){
    let user = await usermodel.findOne({_id:req.user._id})
    if(user.whishlist.includes(req.params.id)){
        let user = await usermodel.findOneAndUpdate({_id:req.user._id}, { $pull: { whishlist: req.params.id } },{new : true})
    }
    else{
        console.log("already removed")
    }
    res.redirect(`/product/view/${req.params.id}`);
})

router.get("/remwhish/:id",logincheck,async function(req,res){
    let user = await usermodel.findOne({_id:req.user._id})
    if(user.whishlist.includes(req.params.id)){
        let user = await usermodel.findOneAndUpdate({_id:req.user._id}, { $pull: { whishlist: req.params.id } },{new : true})
    }
    else{
        console.log("already removed")
    }
    res.redirect("/user/whishlist");
})

router.get("/products/:type",logincheck,async function(req,res){
    try{
        let products=await productmodel.find({type:req.params.type})
        const firstDivProducts = [];
        const secondDivProducts = [];
        products.forEach((product, index) => {
            if (index % 2 === 0) {
                firstDivProducts.push(product);
            } else {
                secondDivProducts.push(product);
            }
        })
        let user = await usermodel.findOne({_id:req.user._id})
        res.render("user/type",{firstDivProducts,secondDivProducts,user,type:req.params.type})
    }
    catch(err){
        console.log("type page err",err)
    }
})

router.get("/cart",logincheck,async function(req,res){
    let user = await usermodel.findOne({_id:req.user._id})
    let products = await productmodel.find({ '_id': { $in: user.cart } });
    res.render("user/cart",{cart:user.cart,products:products})
})

router.post("/create-order",logincheck,async function(req,res){
    try{
        let products=req.body.pros
        let quantity=req.body.quant
        let price=req.body.price
        let productname=req.body.pro
        if (!Array.isArray(products)) {
            products = [products];
        }
        let ans=products.map(function(product,index){
            return{productid: new mongoose.Types.ObjectId(product),
                quantity:quantity[index],
                price:price[index],
            productname:productname[index]}
        })
        let totalamount = 0
        let totalitems = 0
        for(let i=0;i<products.length;i++){
            let product = await productmodel.findOne({_id:products[i]})
            let quant = Number(quantity[i]);
            totalitems = totalitems + quant
            totalamount = totalamount + ((product.price-product.discount)*quant)
        }
        let order=await ordermodel.create({
            amount:totalamount,
            items:totalitems,
            userid:req.user._id,
            products:ans
        })
        // req.session.orderId = order._id;
        res.render("order/orderdeliver",{orderid:order._id});
    }
    catch(err){
        console.log(err)
    }
       
})

router.get("/create-order",logincheck,function(req,res){
    res.redirect("/user/cart")
})

router.get("/checking",function(req,res){
    res.redirect("/user/cart")
})
router.post("/ordercreated",logincheck, async function(req,res){
    try{
       
        let {name,contact,address,email}=req.body
        if(name=='' || contact=='' || address=='' || email==''){
            res.redirect("/user/create-order")
        }
        // let orderId = req.session.orderId;
        let orderId = req.body.orderid;
        if (!orderId) {
            console.log("not getting order")
            return res.status(400).send('Order ID is missing in the session');
          }
        let orderpass=await ordermodel.findOneAndUpdate({_id:orderId},{name,contact,address,email},{new:true})
        let amount=orderpass.amount
        const options = {
            amount: amount*100,
            currency: "INR",
            receipt: "order_rcptid_11" 
          };
          razorpayInstance.orders.create(options, (err, order) => {
            if (err) {
                console.log(err)
              return res.status(500).send("Error occurred while creating the order");
            }
            let newone =orderpass.products
            let productids = newone.map(prid => prid.productid)
            let productqts = newone.map(prqt => prqt.quantity)
            let productpri = newone.map(prpr => prpr.price)
            let productnames = newone.map(prnames => prnames.productname)
            console.log(productnames)
            let prices= new Array();
            for(let i =0;i<productqts.length;i++){ prices[i]=productqts[i]*productpri[i]}
            let products = productnames.map((name, index) => ({
                name: name,
                price: productpri[index]
              }));
              console.log(products)
              console.log(products.name)
            res.render("payment",
                 { key_id: process.env.PUBLISHABLE_KEY,
                     amount: amount,
                      order_id: order.id ,
                   order:orderpass,
                   total:amount,
                   products:products
                });
        })
    }
    catch(err){
        console.log("err",err)
    }
    
})

router.get("/payment",logincheck,function(req,res){
    res.render("/payment")
})

router.post("/verify",logincheck,async function(req,res){
    //took the required ids from payment page
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    //converted to compare
    const hmac = crypto.createHmac('sha256', process.env.SECRET_KEY);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');
  
    //compared them
    if (generated_signature === razorpay_signature) {
        let user = await usermodel.findOne({_id:req.user._id})

        //deleted orders wthat are failed 
       let ans= await ordermodel.findOneAndUpdate({_id:req.body.order},{status:"Success"},{new:true})
       let result = await ordermodel.deleteMany({
        status: 'fail',
        userid: req.user._id
      });

      //pushed orders in userorder
        user.order.push(req.body.order)
        await user.save();

      //pushed products to owner

      //delted products from cart
      const resd = await usermodel.findOneAndUpdate({_id:req.user._id}, { $set: { cart: [] }},{new:true})
      console.log(resd)

    //   let userd = await usermodel.findOne({_id:req.user._id})
    //   let products = await productmodel.find({ '_id': { $in: user.cart } });
      res.redirect('/home')
    } else {
        console.log("failure")
      res.status(400).send("Payment verification failed");
    }
    
})

router.get("/cancelorder",logincheck,async function(req,res){
    let result = await ordermodel.deleteMany({
        status: 'fail',
        userid: req.user._id
      });
      
      res.redirect("/user/cart")
})

router.get("/removecart/:id",logincheck,async function(req,res){
    const itemId = req.params.id;
    req.user.cart = req.user.cart.filter(item => item._id.toString() !== itemId);
    req.user.save()
    res.redirect("/user/cart")
})

router.get("/orders",logincheck,async function(req,res){
    let orders=req.user.order
    const orderprices = [];
    const orderproducts = [];
    const orderdates = [];
    for (const order of orders) {
        try {
            const ordersarray = await ordermodel.findOne({ _id: order }); 
            orderprices.push(ordersarray.amount);
            orderproducts.push(ordersarray.items);
            orderdates.push(ordersarray.createdAt);
        } catch (error) {
            console.error(`Error fetching details for order ${order}:`, error);
        }
    }
    const formattedOrderdates = orderdates.map(date => {
        return new Date(date).toISOString().split('T')[0];
    });
    
res.render("user/orders",{products:orderproducts,prices:orderprices,dates:formattedOrderdates})
})

router.get("/manual",logincheck,function(req,res){
    res.render("user/manual")
})

module.exports=router