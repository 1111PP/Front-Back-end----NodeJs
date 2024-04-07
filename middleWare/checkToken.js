// 应用中间件，检测用户的token
const jwt = require('jsonwebtoken')
const { secret } = require('../config/index.js')

module.exports = (req, res, next) => {
  const token = req.headers.token
  if (!token) {
    return res.send({
      code: 2003,
      msg: 'Token is Missing',
      data: '',
    })
  }
  jwt.verify(token, secret, (err, data) => {
    if (err) {
      return res.send({
        code: 2004,
        msg: 'Token verify Failed',
        data: '',
      })
    } else {
      next()
    }
  })
  //   next()
}
