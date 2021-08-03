const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const { validateUserInput } = require("./util/validators");
require("dotenv").config();
const User = require("./models/user.model");
const Answer = require("./models/answer.model");

const app = express();

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

app.use(express.static("public"));
// mongo_uri="mongodb+srv://admin-ieeecas:ieeecasmongodb@cluster0.yozy1.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(
  "mongodb+srv://admin-ieeecas:ieeecasmongodb@cluster0.yozy1.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.connection.once("open", () => {
  console.log("connected to MONGO");
});
var link = "";
var ques = [
  "While using ExpressJS alongside NodeJS, there is one particular package that has to be installed to get access to all data input in the front-end. Name the package. Elucidate use of package using 1 HTML view and a server-side data processing code.",
  "Elaborate how to fetch data from an API (say https://stats.nba.com/stats/boxscore) using XML HTTP requests. Display data in a table using JS.",
  "Whether using No-SQL or SQL based database processing languages, one thing to remember is to extract data from the database/collection when certain conditions are set. In MongoDB/SQL/SQL+ , elaborate how to fetch one entry corresponding to the following conditions: collection/table name is Customers; data to be fetched should have all names starting with “S” and should have number of orders greater than or equal to 500.",
  "You are given to create a simple application involving multiple users one a single platform. Should you prefer creating individual thread access for each user, or have single thread cater to all user-based needs one by one. Elaborate.",
  "Elaborate on the needs of EJS/Pug over regular HTML when creating larger applications involving multiple common points and similar codebase.",
  "For a particular application, you are required to develop a server side using PHP, SQL. Given that a form’s data is to be submitted to a MySQL database table, write code to establish connection between server-side and the database, before which data is checked using regex. Example: OrderNo. should be 11 digits, and should consider FLIP as it’s first 4 characters.",
  "According to the latest ES6 conventions, what does async, await and promise mean? Elaborate each’s functionalities. In React, which JS compiler is used to convert JSX to Vanilla? Why?"
];
var answers;
app.get("/smarty", (req, res) => {
  res.render("smarty");
});

app.get("/", (req, res, next) => {
  res.render("login");
});

app.post("/", (req, res) => {
  let { errors, valid } = validateUserInput(
    req.body.username,
    req.body.password
  );
  if (valid) {
    User.findOne(
      {
        username: req.body.username,
      },
      function (err, user) {
        try {
          if (user.password == req.body.password) {
            logU = true;
            message = "";
            res.cookie("username", req.body.username);
            res.cookie("password", req.body.password);
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
      }
    );
  } else {
    console.log(errors);
    res.redirect("/");
  }
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
  /*console.log(req.cookies['username']);*/
  if (
    req.cookies["username"] !== undefined &&
    req.cookies["password"] !== undefined
  ) {
    res.render("test", {
      userid: req.cookies["username"],
      pass: req.cookies["password"],
      link: link,
    });
  } else {
    res.redirect("/smarty");
  }

  /*userid = userid;
  pass = pass;*/
});

app.get("/test/invalid", (req, res) => {
  res.render("invalid");
});

app.get("/test/domain", (req, res) => {
  if (
    req.cookies["username"] !== undefined &&
    req.cookies["password"] !== undefined
  ) {
    var now = new Date().getTime();
    var activ= new Date("August 03, 2021 20:00:00").getTime();
    console.log(now);
    console.log(activ);

    if (now >= activ) {
      res.render("domtest", {
        ques: ques,
      });
    } else {
      res.redirect("/test/invalid");
    }
  } else {
    res.redirect("/smarty");
  }
});

app.post("/test/domain", (req, res) => {
  var answers = req.body.a;
  link = " ";
  Answer.create(
    {
      username: req.cookies["username"],
      password: req.cookies["password"],
      question: ques,
      answer: req.body.a,
    },
    function (err, user) {
      console.log(user);
      res.clearCookie("username");
      res.clearCookie("password");
      try {
        console.log(user);
        res.redirect("/");
      } catch (err) {
        console.log(err);
      }
    }
  );
});

app.get("/admin-login", (req, res) => {
  res.render("admin-login");
});

app.post("/admin-login", (req, res) => {
  let admin_user = req.body.username;
  let admin_pass = req.body.password;
  if (admin_user === "admin" && admin_pass === "Tr9dasAQ4I") {
    res.cookie("adminPass", admin_pass);
    res.cookie("adminID", admin_user);
    res.redirect("/answers");
  } else {
    res.redirect("/admin-login");
  }
});

app.get("/answers", async (req, res) => {
  let admin_user = req.cookies["adminID"];
  let admin_pass = req.cookies["adminPass"];
  console.log(admin_user, admin_pass);
  if (admin_user !== undefined && admin_pass !== undefined) {
    const adminRegisterNumber = req.cookies["password"];
    const answers = await Answer.find({});
    const usernames = answers.map((value) => value.username);
    const passwordsArray = answers.map((value) => value.password);
    res.render("answers", {
      username: adminRegisterNumber,
      users: usernames,
      passwords: passwordsArray,
    });
  } else {
    res.redirect("/smarty");
  }
});

app.post("/answers", async (req, res) => {
  let pass = req.body.users;
  let found_user = await Answer.findOne({ password: pass });
  let d = found_user._id.getTimestamp();
  let dt =
    d.getFullYear() +
    "-" +
    (d.getMonth() + 1) +
    "-" +
    d.getDate() +
    " " +
    (d.getHours() + 5) +
    ":" +
    (d.getMinutes() + 30) +
    ":" +
    d.getSeconds();
  if (d.getMinutes() >= 30) {
    dt =
      d.getFullYear() +
      "-" +
      (d.getMonth() + 1) +
      "-" +
      d.getDate() +
      " " +
      (d.getHours() + 6) +
      ":" +
      (d.getMinutes() - 30) +
      ":" +
      d.getSeconds();
  }
  answers=found_user.answer;
  res.cookie("datetime", dt);
  res.redirect('/answers/show');
});

app.get("/answers/show", (req, res) => {
  let admin_user = req.cookies["adminID"];
  let admin_pass = req.cookies["adminPass"];
  if (admin_user != undefined && admin_pass != undefined) {
    let datetime = req.cookies["datetime"];
    // let answers = req.cookies["answers"];
    // if (answers === null || answers === undefined) {
    //   answers = ["Not Attempted"];
    // }
    res.render("result", {
      questions: answers === ["Not Attempted"] ? [""] : ques,
      answers: answers,
      datetime: datetime,
    });
  } else {
    res.redirect("/smarty");
  }
});

app.post("/answers/show", (req, res) => {
  answers=[];
  res.redirect("/answers");
});

const port = process.env.PORT || 3000;
app.listen(port, function (err) {
  if (err) throw err;
  console.log(`Server started successfully at http://localhost:${port}`);
});
