const Router = require('koa-router')
const router = new Router()

const {uploadImg} = require('../controllers/homeController')

// 使用koa-multer中间件实现文件上传功能
const multer = require('koa-multer')
const upload = multer({dest:'public/uploads'})
router.post('/upload',upload.single('file'),uploadImg)

// 使用koa-body
// router.post('/upload',uploadImg)

// 主页
router.get('/',async ctx => {
  ctx.body = "hello";
})

module.exports = router