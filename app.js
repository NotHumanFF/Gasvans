//jshint esversion:6
require('dotenv').config();
const md5 = require('md5');
const express = require('express');
const bodyParser = require('body-parser');
const ejs =  require('ejs');
const mongoose = require('mongoose');

let isLogin = false;
const allUser = ["user"];
const allpw = ["password"];

const app = express(); 

app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/Gasvans");

const userSchema = ({
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema);

const adminName = "admin@2.com";
const adminKey = md5(process.env.ADMIN);

// console.log(adminKey);

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
    res.render("services");
});

app.get("/contact",function (req,res) {
    res.render("contact");
});



app.post("/register" , function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    // allUser.push(String(req.body.username));
    // allpw.push(String(req.body.password));
    newUser.save(function (err) {
        if (err) {
            console.log(err);
        }
        else{
            res.render("home");
        }
    });
});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);

    if (username === adminName  &&  password === adminKey) {
        res.render("admin");
    }
    else{

    User.findOne({email: username} , function (err , foundUser) {
        if(err){
            console.log(err);
        }
        else{
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("home");
                    isLogin = true;
                    
                }
            }
        }
    })
}
})




// console.log(allUser[0]);
// console.log(allpw[0]);




app.listen(3000, function () {
    console.log("server has started running on port 3000");
})

