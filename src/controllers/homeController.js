const path = require('path')

class Home{
  // 图片上传
  async uploadImg(ctx,next){
    // 使用koa-multer上传文件
    const file = ctx.req.file
    console.log('file',file)
    // 拼接上传url
    file.url = `${ctx.origin}/uploads/${file.filename}`
    ctx.body = file
  }
}

module.exports = new Home()