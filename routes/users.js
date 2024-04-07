var express = require('express')
var router = express.Router()
const checkToken = require('../middleWare/checkToken.js')
//用户数据模型
const commentModel = require('../mongodb/userComment/index.js')
/* GET users listing. */
router.post('/comment', checkToken, function (req, res, next) {
  let { id, comment } = req.body
  id = Number(id)
  console.log(comment)
  // console.log(req.body)
  commentModel
    .create({
      id,
      comment,
    })
    .then(
      (r) => {
        console.log('新增评论:' + comment)
        res.send({
          code: 200,
          data: {
            id,
            text: comment,
          },
          msg: '评论成功',
        })
      },
      (e) => {
        console.log('评论失败')
        res.send({
          code: 201,
          msg: 'Add Failed',
        })
      }
    )
})

router.get('/getComment', checkToken, (req, res) => {
  console.log('获取评论')
  commentModel.find().then((r) => {
    res.send({
      code: 200,
      data: r,
      msg: '获取评论成功',
    })
  }),
    (e) => {
      res.send({
        code: 201,
        msg: '失败:获取评论',
      })
    }
})

module.exports = router
