// 路由中转者，用来批量自动引入并注册路由，这样也不会暴露路由实例出去。
module.exports = app => {
  // 引入fs模块
  const fs = require('fs')
  // 使用readdir()方法读取当前文件所在目录所以文件名，它返回的是一个数组
  fs.readdir(__dirname,(err,data) => {
    // 判断是否读取成功
    if(err == null && err == undefined){
      // 读取成功对data数组里每一项进行引入并注册，除了index.js
      data.forEach(val => {
        // 如果是index.js直接返回
        if(val == 'index.js'){return;}
        // 其它则引入并注册
        const router = require(`./${val}`)
        app.use(router.routes()).use(router.allowedMethods())
      })
    }else{
      // 读取失败返回错误信息
      console.log('router read fail!',err)
    }
  })
  
}