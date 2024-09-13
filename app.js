const express=require('express')
const app=express();
const path=require('path')
const db=require('./config/mongoose-connection')
const index=require('./routes/index')
const userRouter=require('./routes/userrouter')
const productRouter=require('./routes/productrouter')
const ownerRouter=require('./routes/ownerrouter')
const flash = require('connect-flash');
const session = require('express-session')
const config=require('config')
const fileupload  = require('express-fileupload')


app.use(fileupload({
 useTempFiles:true
}))

app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'secret', 
    resave: false,
    saveUninitialized: false
  }));
app.use(flash());

app.use("/",index)
app.use("/user",userRouter)
app.use("/product",productRouter)
app.use("/owner",ownerRouter)



app.listen(3000)