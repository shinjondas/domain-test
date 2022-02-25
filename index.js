const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const { validateUserInput } = require("./util/validators");
require("dotenv").config();
const User = require("./models/user.model");
const Answer = require("./models/answer.model");
const Recruit = require("./models/recruits.model");
const bcrypt = require("bcryptjs");

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
  "Registration number:",
  "Name:",
  //Aptitude
  "If p times the pth term of an A.P. is equal to q times the qth term, find (p + q)th term.",
  "A bird flying at a height of 200 m is moving downwards to touch the floor. Then it rises to half of the height (i.e.) 100 m. Each time it further touches the floor, it rises to the height of half the height it fell from before the previous attempt. Find the total distance traveled by that bird.",
  "Which of the following is correct for [P ≥ Q, N ≤ S, Q > N, S< T].",
  "In two class rooms A and B, if 5 students are sent from room A to B, then the number of students in each room is the same. If 15 candidates are sent from room B to A, then the number of students in A is triple the number of students in B. The number of students in room A is:",
  "The least perfect square, which is divisible by each of 26, 36 and 48 is:",
  "Look at this series: 21, 9, 21, 11, 21, 13, 21. What number should come next? ",
  "Find the number of 3-digit numbers that can be formed from the digits 3, 4, 5, 6, 7, 8, 9. Which are divisible by 5 and none of the digits is repeated?",
  "Smith’s present age is two-fifth of the age of his Father. After 8 years, he will be one-half of the age of his Father. How old is the Father at present?",
  "Two trains having equal lengths take 10 seconds and 15 seconds respectively to cross a telegraph post. If the length of each train is 150 meters, in what time (in seconds) will they cross each other traveling in opposite directions?",
  "Six bells commence tolling together and toll at intervals of 2, 4, 6, 8, 10 and 12 seconds respectively. In 1 hour, how many times do they toll together?",
  //Hardware
  "What is the difference between a microcontroller and microprocessor?",
  "If a signal passing through a gate is inhibited by sending a LOW into one of the inputs, and the output is LOW, the gate is a(n):",
  "Determine the values of A, B, C, and D that make the sum term A’ + B + C’ + D  equal to ONE",
  "For an automatic car trying to navigate automatically, certain sensors must be used. Mention the parameters that could be measured that would help the car navigate and function itself, in simple terms.",
  "A PN junction at a temperature of 20°C has a reverse saturation current of 25 pA. The reverse saturation current at 30°C for the same bias is approximately.",
  //Software
  "Give the output of the following python:",
  "Python program to find the factorial of a number using recursion.",
  "In a table Apply, there is a column namely Experience that can only store one of these values:‘Fresher’, ‘Private-sector-experience’, ‘Public-sector-experience’, ‘Govt.-sector-experience’. You want to sort the data of the table based on column Experience as per this order: ‘Govt.-sector-experience’, ‘Public-sector- experience’, ‘Private-sector-experience’, ‘Fresher’. Write an SQL statement to achieve this.",
  "Rewrite the following code in python after removing all syntax error(s):",
  "Rewrite the following code in python after removing all the error(s):",
  //Management
  "You are asked to perform a task you have never done before. Then would you take up the responsibility? If yes, then explain how you would go about it?",
  "If you have been given a responsibility and you are having a conflict in opinion with one of your club-mates. How will you handle it?",
  "If you are having a big '2hr' DA submission at 12am and also have pending '1hr' work from your chapter/club and it's already 9pm. What would you do?",
  "If you could change ‘two’ things about your personality, what would it be?",
  "How would you handle criticism?",
  //Editorial
  "Write a creative caption for “Independence Day”.",
  "Do you have any previous literary works like blogs or publications? If so, specify what they are, put them in a drive link and attach the link below",
  "Give a brief description of a blog idea that you would like to get published in future",
  "What literary works and publications have inspired you?",
  "Do you have any experience in content writing? If so, please specify"
];

var answers;
app.get("/smarty", (req, res) => {
  res.render("smarty");
});

app.get("/", (req, res, next) => {
  res.render("login");
});

app.get("/", (req, res, next) => {
  res.render("insert");
});

app.post("/", (req, res) => {
  let { errors, valid } = validateUserInput(
    req.body.Email,
    req.body.Reg_no
  );
  console.log(errors)
  if (valid) {
    Recruit.findOne(
      {
        Reg_no: req.body.Reg_no,
      },
      function (err, rec) {
        try {
          if (rec) {
            logU = true;
            message = "";
            res.cookie("Email", req.body.Email);
            res.cookie("Reg_no", req.body.Reg_no);
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
          console.log(err);
        }
      }
    );
  } else {
    res.redirect("/");
  }
});

// app.get("/signup", (req, res) => {
//   res.render("signup");
// });

// app.post("/signup", (req, res) => {
//   console.log(req.body.user.password);
//   var recruit = new Recruit();
//   recruit.Name = req.body.user.Name;
//   recruit.Email = req.body.user.Email;
//   recruit.Password = bcrypt.hashSync(req.body.user.Password, 10); // Add the hashed password to the db
//   recruit.save((err, User) => {
//     if (err) {
//       console.log(err);
//     } else {
//       logU = true;
//       res.redirect("/");
//     }
//   });
// });
app.get("/test", (req, res) => {
  /*console.log(req.cookies['username']);*/
  if (
    req.cookies["Email"] !== undefined &&
    req.cookies["Reg_no"] !== undefined
  ) {
    res.render("test", {
      userid: req.cookies["Email"],
      pass: req.cookies["Reg_no"],
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
    req.cookies["Email"] !== undefined &&
    req.cookies["Reg_no"] !== undefined
  ) {
    var now = new Date().getTime();
    //start time
    var activ = new Date("February 25 2022 20:00:00").getTime();
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
      username: req.cookies["Email"],
      password: req.cookies["Reg_no"],
      question: ques,
      answer: req.body.a,
    },
    function (err, user) {
      console.log(user);
      res.clearCookie("Email");
      res.clearCookie("Reg_no");
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
  answers = found_user.answer;
  res.cookie("datetime", dt);
  res.redirect("/answers/show");
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
  answers = [];
  res.redirect("/answers");
});

const port = process.env.PORT || 3000;
app.listen(port, function (err) {
  if (err) throw err;
  console.log(`Server started successfully at http://localhost:${port}`);
});
