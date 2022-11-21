const path = require('path')

class Home{
  // 图片上传
  async uploadImg(ctx,next){
    // 使用koa-body上传文件
    // const file = ctx.request.files.file
    // const basename = path.basename(file.path)
    // ctx.body = {
    //   url:`${ctx.origin}/uploads/${basename}`
    // }

    // 使用koa-multer上传文件
    const file = ctx.req.file
    file.url = `${ctx.origin}/uploads/${file.filename}`
    ctx.body = file
  }
}

module.exports = new Home()