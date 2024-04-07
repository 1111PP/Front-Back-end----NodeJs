;(function () {
  const userData = require('./loginData/index.js')
  const mongoose = require('mongoose')

  mongoose.connect('mongodb://127.0.0.1:27017/userData')
  // mongoose.connect('mongodb://127.0.0.1/userData')
  mongoose.connection.once('open', () => {
    console.log('数据库连接成功')
  })
  mongoose.connection.once('error', () => {
    console.log('数据库连接失败')
  })
})()
