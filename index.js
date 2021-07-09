const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
require("dotenv").config();
const User = require("./models/user.model");
const Answer = require("./models/answer.model");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
// mongo_uri="mongodb+srv://admin-ieeecas:ieeecasmongodb@cluster0.yozy1.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once("open", () => {
  console.log("connected to MONGO");
});
var link = "";
var ques = ["What is the full form of HTML?", "What is the primary use of ESLint?", "What is the primary code to establish connection between MySQL database and PHP script?", "What is the meaning of Error 404?", "What is the difference between GET and POST requests?", "Name any frontend framework that doesn't use Javascript.", "Why should one prefer NodeJS over Apache servers?"];
var username, userid, pass, admin_pass, admin_user, found_answers = [];
app.get("/", (req, res) => {
  res.render("login");
});

app.post("/", (req, res) => {
  userid = req.body.username;
  pass = req.body.password;
  console.log(userid + " " + pass);
  User.findOne({
    username: req.body.username
  }, function (err, user) {
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

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
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

app.get("/test", (req, res) => {
  res.render("test", {
    userid: userid,
    pass: pass,
    link: link
  });
  /*userid = userid;
  pass = pass;*/
});

app.get("/test/domain", (req, res) => {
  var k = 0;
  res.render("domtest", {
    q1: ques[k++],
    q2: ques[k++],
    q3: ques[k++],
    q4: ques[k++],
    q5: ques[k++],
    q6: ques[k++],
    q7: ques[k]
  });
})

app.post("/test/domain", (req, res) => {
  var answers = req.body.a;
  link = "disabled";
  Answer.create({
    username: userid,
    password: pass,
    question: ques,
    answer: req.body.a
  }, function (err, user) {
    console.log(user);
    try {
      console.log(user);
      res.redirect("/test");
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
  admin_user = req.body.username;
  admin_pass = req.body.password;
  User.findOne({
    username: req.body.username
  }, function (err, user) {
    try {
      if (user.password == req.body.password) {
        logU = true;
        message = "";
        res.redirect("/answers");
      } else {
        res.redirect("/admin-login");
        message = "Invalid Password";
        console.log(message);
      }
    } catch (err) {
      res.redirect("/");
      message = "Invalid Username";
      console.log(message);
    }
  });
})

app.get('/answers', async (req, res) => {
  const users = await User.find({});
  const usernames = users.map(value => value.name);
  const passwordsArray = users.map(value => value.password);
  res.render('answers', {
    username: admin_pass,
    users: usernames,
    passwords: passwordsArray
  });
  // res.json(passwordsArray);
})

app.post('/answers', async (req, res) => {
  found_answers = await Answer.findOne({
    password: req.body.users
  }, (err, user) => {
    if (!err) {
      console.log(user);
    } else {
      console.error(err);
      res.redirect('/answers');
    }
  });
  res.redirect('/answers/show');
})

app.get('/answers/show', (req, res) => {
  if (found_answers == null) {
    found_answers = ['Not Attempted'];
    ques = [""];
  }
  res.render('show_result', {
    questions: ques,
    answers: found_answers
  });
})

app.post('/answers/show', (req, res) => {
  res.redirect('/answers');
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server started successfully");
});