
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs =  require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require("passport")
const passportLocalMongoose = require('passport-Local-Mongoose');

function generateNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}

const app = express(); 

app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false   
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://admin-nothuman:Test123@gasvans.al1tkul.mongodb.net/Gasvans",{useNewUrlParser:true});

const userSchema =  new mongoose.Schema ({
    name: String,
    email: String,
    password: String,
    userId: Number
})

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const contactSchema = ({
    name: String,
    email: String,
    message: String
})

const Contact = new mongoose.model("Contact" , contactSchema);


const orderSchema = ({
    name: String,
    phone: Number,
    email: String,
    fuelType: String,
    quantity: Number,
    date: String,
    time: String,
    area: String,
    city: String,
    state: String,
    postCode: Number,
    userId: Number
})

const Order = new mongoose.model("Order", orderSchema);


const adminName = "admin@2.com";
// const adminKey = md5(process.env.ADMIN);


app.get("/" , function (req ,res) {
    res.render("home");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/services",function (req,res) {
    // res.render("services");
    if (req.isAuthenticated()){
        res.render("services");
    }else{
        res.redirect("/login");
    }
});

app.get("/logout", function(req, res){
    req.logout(function(err) {
    if (err) {
        return next(err); 
    }
    res.redirect("/");
});
});


app.get("/contact",function (req,res) {
    res.render("contact");
});

app.get("/ourteam",function (req,res) {
    res.render("ourteam");
});

app.get("/loghome",function(req,res){
    res.render("loghome");
});



let curUser;
let curUsername;
let curUseremail;
app.post("/register" , function(req, res){
    curUser = generateNumber();
    curUsername = req.body.username; 
    curUseremail = req.body.useremail; 

    // const newUser = new User({
    //     name: req.body.username,
    //     email: req.body.useremail,
    //     password: md5(req.body.password),
    //     userId: curUser
    // });

    // newUser.save(function (err) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else{
    //         res.render("home");
    //     }
    // });

    User.register({username: req.body.username, useremail: req.body.useremail}, req.body.password , function(err , user){
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/services");
            });
        }
    });
});


app.post("/login", function (req, res) {
    curUsername = req.body.username;
    curUseremail= req.body.useremail;
    PASSword = req.body.password;
//     const password = md5(req.body.password);
    // if (useremail === adminName  &&  password === adminKey) {
    //     res.render("admin");
    // }
//     else{
//     User.findOne({email: useremail} , function (err , foundUser) {
//         if(err){
//             console.log(err);
//         }
//         else{
//             if (foundUser) {
//                 if (foundUser.password === password) {
//                     res.render("home");
//                 }
//             }
//         }
//     })
// }

    const user = new User({
    username: req.body.username,
    useremail: req.body.useremail,
    password: req.body.password
    });
    req.login(user, function(err){
    if (err) {
        console.log(err);
    } else {
        passport.authenticate("local")(req, res, function(){
            res.redirect("/services");
        });
    }
    });



})
app.post("/contact",function(req,res){
    const newContact = new Contact({
        name: req.body.username,
        email: req.body.useremail,
        message: req.body.message
    });
    newContact.save(function (err) {
        if (err) {
            console.log(err);
        }
        else{
            res.render("home");
        }
    });
})


app.post("/services",function(req,res){
    const  name= req.body.username;                                        
    const  phone= req.body.phone;                                        
    const  email= req.body.email;                                        
    const  fuelType= req.body.fuelType;                                        
    const  quantity= req.body.quantity;                                        
    const  date= req.body.date;                                        
    const  time= req.body.time;                                        
    const  area= req.body.area;                                        
    const  city= req.body.city;                                        
    const  state= req.body.state;                                        
    const  postCode= req.body.postCode;

    const newOrder = new Order({
        name: req.body.username,
        phone: req.body.phone,
        email: req.body.email,
        fuelType: req.body.fuelType,
        quantity: req.body.quantity,
        date: req.body.date,
        time: req.body.time,
        area: req.body.area,
        city: req.body.city,
        state: req.body.state,
        postCode: req.body.postCode,
        userId: curUser
    });
    newOrder.save(function (err) {
        if (err) {
            console.log(err);
        }
        else{
            res.render("confirm",{
                Name:name,Phone:phone,Email:email,FuelType:fuelType,Quantity:quantity,Date:date,Time:time,Area:area,City:city,State:state,Postcode:postCode
            });
        }
    });
})

app.post("/confirm",function(req,res){
    res.render("success");
})
app.post("/success", function(req,res){

    // User.findOne({userId: curUser} , function (err , foundUser) {
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         if (foundUser) {
    //             if (foundUser.username === USERname) {
    //                 res.render("myaccount" ,{
    //                     Name:foundUser.name,
    //                     // Email:foundUser.email,
    //                     // UserId:foundUser.userId
    //                 });
    //             }
    //         }
    //     }
    // })

res.render("myaccount",{Name: curUsername, Email:curUseremail});
   
})


app.get("/myaccount", function(req,res){
    res.render("myaccount",{Name: curUsername, Email:curUseremail});
})

app.listen(3000, function () {
    console.log("server has started running on port 3000");
})

