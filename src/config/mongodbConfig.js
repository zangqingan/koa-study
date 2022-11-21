// 导出函数的形式创建mongodb数据库连接
module.exports = app => {
    // 引入mongoose创建数据库连接
    const mongoose = require('mongoose')
    // 引入数据库地址配置
    const { MONGODB_CONF } = require('./config')
    mongoose.connect(
        MONGODB_CONF,
        {useNewUrlParser:true , useUnifiedTopology: true , useFindAndModify:false},
        (err) => {
            if(err){
                // 数据库连接失败打印错误信息
                console.log('数据库连接失败,错误如下:',err)
                return;
            }
            console.log("数据库连接成功:")
        }
    )

}

