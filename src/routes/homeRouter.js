const Router = require('@koa/router')
const router = new Router()

const { uploadImg } = require('../controllers/homeController')

// 使用koa-multer中间件实现文件上传功能
const multer = require('koa-multer')
// 设置文件上传目录,是一个对象也算是一个中间件、在上传文件路由前加上
const upload = multer({dest:'public/uploads'})
router.post('/upload',upload.single('file'),uploadImg)

// 主页
router.get('/',async ctx => {
  ctx.body = "hello www";
})

module.exports = router