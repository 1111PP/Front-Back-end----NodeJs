const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
  username: String,
  password: String,
  id: Number,
  shortToken: String,
  refreshToken: String,
})
let loginInfoModel = mongoose.model('loginInfos', userSchema)

module.exports = loginInfoModel
