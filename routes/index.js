const express=require('express')
const cookieparser=require('cookie-parser')
const router=express.Router()
const logincheck=require('../middlewares/loginchecker')
const productmodel=require('../models/productmodel')
const usermodel= require('../models/usermodel')


router.use(cookieparser())

router.get("/",function(req,res){
    res.render("auth/main")
})

router.get("/home",logincheck,async function(req,res){
    try{
        let products=await productmodel.find()
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
        res.render("home",{firstDivProducts,secondDivProducts,user})
    }
    catch(err){
        console.log("Home page err",err)
    }
})

router.post("/submit",logincheck,async function(req,res){
    let price=req.body.sortPrice;
    let collection = req.body.sortCollection;
    if(!price && collection){
        if(collection == 'oldToNew'){
            let products=await productmodel.find()
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
            res.render("home",{firstDivProducts,secondDivProducts,user})
        }
        else{
            let productsnormal=await productmodel.find()
            let products=productsnormal.reverse();
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
            res.render("home",{firstDivProducts,secondDivProducts,user})
        }
    }
    else{
        if(!collection && price){
            if(price == 'highToLow'){
                let products = await productmodel.find().sort({ price: -1 });
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
                res.render("home",{firstDivProducts,secondDivProducts,user})
            }
            if(price == 'lowToHigh'){
                let products = await productmodel.find().sort({ price: 1 });
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
                res.render("home",{firstDivProducts,secondDivProducts,user})
            }
        }
        else{
            if(collection && price){
                if(collection == 'oldToNew' && price=='highToLow'){
                    let products = await productmodel.find().sort({ price: -1 });
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
                    res.render("home",{firstDivProducts,secondDivProducts,user})
                }else if(collection == 'oldToNew' && price=='lowToHigh'){
                    let products = await productmodel.find().sort({ price: 1 });
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
                    res.render("home",{firstDivProducts,secondDivProducts,user})
                }
                else{
                    if(collection == 'newToOld' && price=='highToLow'){
                        let products = await productmodel.find().sort({ price: -1 });
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
                        res.render("home",{firstDivProducts,secondDivProducts,user})
                    }else if(collection == 'newToOld' && price=='lowToHigh'){
                        let products = await productmodel.find().sort({ price: 1 });
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
                    res.render("home",{firstDivProducts,secondDivProducts,user})
                }
                }
                }
        }
    }
   
})

module.exports=router