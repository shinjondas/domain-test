const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const cookieParser = require('cookie-parser');
require("dotenv").config();
const User = require("./models/user.model");
const Answer = require("./models/answer.model");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use(express.static("public"));
// mongo_uri="mongodb+srv://admin-ieeecas:ieeecasmongodb@cluster0.yozy1.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect("mongodb+srv://admin-ieeecas:ieeecasmongodb@cluster0.yozy1.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once("open", () => {
  console.log("connected to MONGO");
});
var link = "";
var ques = ["What is the full form of HTML?", "What is the primary use of ESLint?", "What is the primary code to establish connection between MySQL database and PHP script?", "What is the meaning of Error 404?", "What is the difference between GET and POST requests?", "Name any frontend framework that doesn't use Javascript.", "Why should one prefer NodeJS over Apache servers?"];
app.get("/", (req, res) => {
  res.render("login");
});

app.post("/", (req, res) => {
  User.findOne({
    username: req.body.username
  }, function (err, user) {
    try {
      if (user.password == req.body.password) {
        logU = true;
        message = "";
        res.cookie("username", req.body.username);
        res.cookie("password",req.body.password);
        console.log(req.cookies);
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

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
  User.create(req.body.user, function (err, user) {
    console.log(user);
    try {
      console.log(user);
      logU = true;
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });

});

app.get("/test", (req, res) => {
  res.render("test", {
    userid: req.cookies['username'],
    pass: req.cookies['password'],
    link: link
  });
  /*userid = userid;
  pass = pass;*/
});

app.get("/test/domain", (req, res) => {
  res.render("domtest", {
    ques:ques
  });
})

app.post("/test/domain", (req, res) => {
  var answers = req.body.a;
  link = " ";
  Answer.create({
    username: req.cookies['username'],
    password: req.cookies['password'],
    question: ques,
    answer: req.body.a
  }, function (err, user) {
    console.log(user);
    res.clearCookie('username');
    res.clearCookie('password');
    try {
      console.log(user);
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });
})

app.get("/test/invalid", (req, res) => {
  res.render("invalid");
})

app.get("/admin-login", (req, res) => {
  res.render("admin-login");
})

app.post("/admin-login", (req, res) => {
  let admin_user = req.body.username;
  let admin_pass = req.body.password;
  if(admin_user==="admin" && admin_pass==="Tr9dasAQ4I"){
    res.redirect('/answers');
  } else {
    res.redirect('/admin-login');
  }
})

app.get('/answers', async (req, res) => {
  const admin_pass= req.cookies['password'];
  const users = await User.find({});
  const usernames = users.map(value => value.name);
  const passwordsArray = users.map(value => value.password);
  res.render('answers', {
    username: admin_pass,
    users: usernames,
    passwords: passwordsArray
  });
})

app.post('/answers', (req, res) => {
  let pass = req.body.users;
  Answer.findOne({
    password: pass
  }, (err, user) => {
    if (!err) {
      res.cookie("answers", user);
      res.redirect("/answers/show");
    } else {
      console.error(err);
      res.redirect('/answers');
    }
  });
})

app.get('/answers/show', (req, res) => {
  let answers = req.cookies['answers'];
  if (answers.answer === null) {
    answers.answer = ['Not Attempted'];
    answers.question=[''];
  }
  res.render('result',{
    questions:answers["question"],
    answers:answers["answer"]
  })
})

app.post('/answers/show', (req, res) => {
  res.redirect('/answers');
})

const port = process.env.PORT || 3000;
app.listen(port, function (err) {
  if (err) throw err;
  console.log("Server started successfully");
});