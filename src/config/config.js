// 设置端口号，实际应该放到全局的配置文件中
const PORT = process.env.APP_PORT || 5000;
// console.log(PORT)
// jwt密钥
const SECRET = process.env.SECRET_KEY ||'koa-study-secret';
// console.log(secret)
// 数据库地址配置
let MONGODB_CONF
if(process.env.NODE_ENV === "dev"){
  MONGODB_CONF = 'mongodb://127.0.0.1:27017/koa-study'
}

// production环境实际应该是线上地址
if(process.env.NODE_ENV === 'production'){
  MONGODB_CONF = 'mongodb://127.0.0.1:27017/koa-study'
}

module.exports = {
  PORT,
  SECRET,
  MONGODB_CONF
}