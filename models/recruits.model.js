var mongoose = require("mongoose");
var recruitSchema = new mongoose.Schema({
  Email: String,
  Name: String,
  Reg_no: String,
  Password: String,
});

// // Method to check the entered password is correct or not
// recruitSchema.methods.validPassword = function (password) {
//   return bcrypt.compareSync(password, this.Password);
// };

module.exports = mongoose.model("Recruit", recruitSchema);
