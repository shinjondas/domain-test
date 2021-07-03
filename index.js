const express=require("express");
const bodyParser=require("body-parser");
const mongoose = require("mongoose");
const ejs=require("ejs");
require("dotenv").config();
const User = require("./models/user.model");
const Answer= require("./models/answer.model");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
mongoose.connection.once("open", () => {
  console.log("connected to MONGO");
});
var link="";
var ques=["What is the full form of HTML?","What is the primary use of ESLint?","What is the primary code to establish connection between MySQL database and PHP script?","What is the meaning of Error 404?","What is the difference between GET and POST requests?","Name any frontend framework that doesn't use Javascript.","Why should one prefer NodeJS over Apache servers?"];
var username,userid,pass;
app.get("/",(req,res)=>{
    res.render("login");
});

app.post("/",(req,res)=>{
    userid=req.body.username;
    pass=req.body.password;
    console.log(userid+" "+pass);
    User.findOne({ username: req.body.username }, function (err, user) {
        try {
          if (user.password == req.body.password) {
            logU = true;
            message = "";
            res.redirect("/test");
          } else {
            res.redirect("/");
            message = "Invalid Password";
            console.log(message);
          }
        } catch (err) {
          res.redirect("/");
          message = "Invalid Username";
          console.log(message);
        }
      });
    
});

app.get("/signup",(req,res)=>{
    res.render("signup");
});

app.post("/signup",(req,res)=>{
    User.create(req.body.user, function (err, user) {
        console.log(user); 
        try {
          console.log(user);
          logU = true;
          res.redirect("/test");
        } catch (err) {
          console.log(err);
        }
      });
    
});

app.get("/test",(req,res)=>{
    res.render("test",{userid:userid,pass:pass,link:link});
    userid=userid;
    pass=pass;
});

app.get("/test/domain",(req,res)=>{
    var k=0;
    res.render("domtest",{q1:ques[k++],q2:ques[k++],q3:ques[k++],q4:ques[k++],q5:ques[k++],q6:ques[k++],q7:ques[k]});
})

app.post("/test/domain",(req,res)=>{
  var answers=req.body.a;
  link="disabled";
  Answer.create({username: userid, password: pass, question: ques, answer:req.body.a},function(err,user){
    console.log(user);
    try{
      console.log(user);
      res.redirect("/test");
    }
    catch(err){
      console.log(err);
    }
  });
})

app.get("/test/invalid",(req,res)=>{
    res.render("invalid");
})
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  