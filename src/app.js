// 日志
const logger = require('koa-logger')
const morgan = require('koa-morgan')
const fs = require('fs')
const  path = require('path')
// 把env文件中的设置到process.env对象中
require('dotenv').config()
// console.log('env is',env)
// 1.引入koa模块
const Koa = require('koa')
//2.实例化koa
const app = new Koa()

/*****挂载路由，业务代码，其它中间件等开始 *****/



/*全局相关的配置 */
// 引入端口配置
const { PORT } = require('./config/config')

/*第三方中间件配置 */

/* 跨域 */
// 自己编写跨域中间件,可以抽离出来的。
// app.use(async (ctx, next) => {
//     // 允许来自所有域名请求
//     ctx.set("Access-Control-Allow-Origin", "*");
//     // 设置所允许的HTTP请求方法
//     ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
//     // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
//     ctx.set("Access-Control-Allow-Headers", "authorization, x-requested-with, accept, origin, content-type");
//     // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。
//     // Content-Type表示具体请求中的媒体类型信息
//     ctx.set("Content-Type", "application/json;charset=utf-8");
//     // 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。
//     // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
//     ctx.set("Access-Control-Allow-Credentials", true);
//     // 该字段可选，用来指定本次预检请求的有效期，单位为秒。
//     // 当请求方法是PUT或DELETE等特殊方法或者Content-Type字段的类型是application/json时，服务器会提前发送一次请求进行验证
//     // 下面的的设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证
//     ctx.set("Access-Control-Max-Age", 300);
//     await next();
//   })

// 使用第三方跨域中间件 kcors
// const cors = require('@koa/cors')
// app.use(cors())
// 一步简写 
app.use(require('@koa/cors')())

/* 解析请求体 */
// 引入koa-body中间件并注册到app实例上 koa-body中间件(注意必须在router.routes()之前注册)
// const koaBody = require('koa-body')
// app.use(koaBody())
// 缩写
app.use(require('koa-body')())

/* 日志start*/
app.use(logger())
// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`HTTP Method is ${ctx.method} --- url is ${ctx.url} --- time consuming ${ms}ms`)
  })
  
const ENV = process.env.NODE_ENV
if (ENV !== 'dev') {
    // 开发环境 / 测试环境
    app.use(morgan('dev'));
} else {
    // 线上环境,导出为访问日志
    const logFileName = path.join(__dirname, 'logs', 'access.log')
    const accessLogWriteStream = fs.createWriteStream(logFileName, {
        flags: 'a'
    })
    // setup the logger
    app.use(morgan('combined', {
        stream: accessLogWriteStream
    }));
}
/* 日志end*/
/* 检验请求体参数 */
// const parameter = require('koa-parameter')
// app.use(parameter(app))
// 缩写
app.use(require('koa-parameter')(app))

/* 静态资源托管服务 */
//写法一
// const koaStatic = require('koa-static')
// app.use(koaStatic(
//     path.join(__dirname,'public')
// ))
// 写法二，相对路径只能在当前app.js目录下启动koa服务，在其它目录会找不到静态资源服务目录
app.use(require('koa-static')('public'))

/* 引入连接mongodb数据库的配置 */
require('./config/mongodbConfig')(app)

/*koa路由配置 */
// 引入productRouter并注册路由中间件
// const productRouter = require('./routers/product')
// app.use(productRouter.routes()).use(productRouter.allowedMethods())

// 引入userRouter并注册路由中间件 
// const userRouter = require('./routers/user')
// app.use(userRouter.routes()).use(userRouter.allowedMethods())

//很明显当路由很多时这样引入注册过于低级，使用中转者批量注册。
require('./routes/index')(app)


/*错误处理中间件配置 */
//koa原生错误处理
// app.use(async (ctx,next) => {
//     try{
//         await next()
//     }catch(error){
//         ctx.status = error.status || error.statusCode || 500
//         ctx.body = {
//             message:error.message
//         }
//     }
// })
// 也可监听error事件
// error-handling
// app.on('error', (err, ctx) => {
//     console.error('server error', err, ctx)
// });
// 第三方中间件错误处理
//错误处理koa-json-error
const error = require('koa-json-error')
app.use(error({
    // 如果生产环境就不返回错误堆栈
    postFormat:(e,{stack,...rest})  =>  process.env.NODE_ENV === 'production'?rest:{stack,...rest} })
)
app.


/*挂载路由，业务代码，其它中间件等结束 */

// 3.监听端口并开启服务
app.listen(PORT,() => {
    console.log(`server is running on port ${PORT}`)
})

