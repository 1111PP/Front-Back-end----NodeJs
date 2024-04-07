const mongoose = require('mongoose')

let commentSchema = new mongoose.Schema({
  comment: String,
  id: Number,
})
let commentModel = mongoose.model('usercomments', commentSchema)

module.exports = commentModel
