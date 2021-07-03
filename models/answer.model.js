var mongoose = require("mongoose");
var answerSchema = new mongoose.Schema({
  username: String,
  password: String,
  question: Array,
  answer: Array,
});
module.exports = mongoose.model("Answer", answerSchema);
