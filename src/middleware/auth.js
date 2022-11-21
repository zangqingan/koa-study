// 引入jsonwebtoken验证token
const jsonwebtoken = require('jsonwebtoken')
// 签名配置
const {SECRET} = require('../config/config')
// 使用jsonwebtoken查看是否携带token
async function auth(ctx,next){
  // 认证步骤1：获取前端请求头对象的 authorization，前端不设置时默认为空
  const { authorization = ''} = ctx.request.header
  // 认证步骤2：对authorization的值进行拆分，获取其中的token
  const token = authorization.replace('Bearer ','')
  // 认证步骤3：验证token 如果token被修改过或者为空，都是401错误，即没有认证。使用try/catch来捕获错误
  try {
      const user = jsonwebtoken.verify(token,SECRET)
      // 将用户信息挂载到ctx上
      ctx.state.user = user
  } catch (error) {
      ctx.throw(401,error.message)
  }
  // 记得释放
  await next()

}

// 使用koa-jwt中间件验证是否携带token
const jwt = require("koa-jwt")
const jwtAuth = jwt({ SECRET }).unless({path:[/^\/login/,/^\/register/]})//除了登录，注册接口不需要jwt验证，其它都需要。

// 导出登录认证中间件(即函数)
module.exports = {
  auth,
  jwtAuth
}