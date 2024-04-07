var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
//解决跨域插件
const cors = require('cors')
var app = express()
//连接数据库
const useData = require('./mongodb/index.js')
//解析请求数据插件
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
// 使用 CORS 中间件
app.use(cors())
//🟥匹配URL中的BaseURL
// 若'/'则表示所有路由都会在indexRouter内匹配并处理
app.use('/', indexRouter)
// url中若存在/users则会进入👇定义的路由规则中，usersRouter内匹配的都是'user/xxx'的url了
app.use('/user', usersRouter)

// 404处理，也可用app.all("*")
app.use(function (req, res, next) {
  next(createError(404))
})

// 错误处理
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
