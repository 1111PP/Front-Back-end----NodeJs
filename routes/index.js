var express = require('express')
var router = express.Router()
let nanoid = require('nanoid')
//用户数据模型
const loginInfoModel = require('../mongodb/loginData/index.js')
//生成token所需
const jwt = require('jsonwebtoken')
const { secret } = require('../config/index.js')
const checkToken = require('../middleWare/checkToken.js')
const getToken = (userData, time) => {
  //生成token
  return jwt.sign(userData, secret, {
    expiresIn: time,
  })
}
router.get('/a', (req, res) => {
  console.log('a请求触发', new Date())
  res.send('/test')
})
//注册
router.post('/login', async (req, res) => {
  console.log('login请求触发', new Date())
  try {
    // console.log(req.body)
    let userLength = 0
    await loginInfoModel.countDocuments({}).then((legnth) => {
      userLength = legnth
    })
    const { username, password } = req.body
    loginInfoModel.find({ username }).then(
      (r) => {
        //查找到用户已存在
        console.log('注册的用户已存在')
        if (r.length !== 0) {
          res.send({
            code: 201,
            data: '用户已存在',
          })
        } else {
          //添加数据
          console.log('注册成功')
          loginInfoModel
            .create({
              username,
              password,
              id: userLength + 1,
              shortToken: '',
              refreshToken: '',
            })
            .then(
              (data) => {
                // console.log(data)
                res.send({
                  code: 200,
                  data: 'Success Add',
                })
              },
              (err) => console.log(err)
            )
        }
      },
      (e) => {
        console.log('error')
        return
      }
    )
  } catch (e) {
    console.log(e)
  }
})
//登录
router.post('/enter', async (req, res) => {
  console.log('登录请求触发', new Date())
  const { username, password } = req.body
  //1.查找账号
  //2.核对密码
  await loginInfoModel
    .find({ username })
    .then(
      (r) => {
        console.log('用户名存在,正在检查密码.....')
        //查找到用户已存在
        if (r.length !== 0) {
          //进一步核对密码
          if (r[0].password === password) {
            //生成token,长短各一个
            let shortToken = getToken({ username, password }, 600)
            let refreshToken = getToken(
              { username, password },
              60 * 60 * 24 * 7
            )
            //将token保存到对应的用户信息中
            loginInfoModel
              .updateOne({ username }, { shortToken, refreshToken })
              .then(
                (r) => {
                  res.send({
                    code: 200,
                    data: {
                      msg: '登录成功!',
                      shortToken: shortToken,
                      refreshToken: refreshToken,
                    },
                  })
                },
                (e) => {
                  res.send({
                    code: 201,
                    data: {
                      msg: 'token更新失败',
                      token,
                    },
                  })
                }
              )
          } else {
            res.send({
              code: 201,
              data: '账号正确,密码错误',
            })
          }
        }
        //用户名不存在,尚未注册
        else {
          console.log('尚未注册,请登录')
          res.send({
            code: 202,
            data: '尚未注册',
          })
        }
      },
      (e) => {
        console.log('error')
        return
      }
    )
    .catch((e) => {
      console.log(e)
    })
})

//返回用户信息 => 1.id
router.get('/userinfo', checkToken, async (req, res) => {
  console.log('Token 校验成功')
  res.send({
    code: 200,
    data: {
      id: '1',
      username: 'admin',
    },
  })
})

//刷新短token
router.get('/refreshToken', checkToken, (req, res) => {
  let shortToken = getToken(
    {
      username: nanoid(),
      password: nanoid(),
    },
    600
  )
  res.send({
    code: 200,
    data: {
      //生成token
      shortToken,
    },
  })
})
module.exports = router
