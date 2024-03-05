// 引入路由对象
const Router = require('@koa/router')
// 创建一个新的路由对象并设置前缀信息
const router = new Router({
    // 设置路由前缀信息
    prefix:'/api/user'
})

/*这里将路由命中时对应的中间件函数抽离成控制器*/
// 用户curd控制器
const {findUser,findUserById,createUser,updateUser,deleteUser,login,checkOwer} = require('../controllers/userController')
// 登录认证中间件
const {auth,jwtAuth} = require('../middleware/auth')
// 用户curd
router.get('/',findUser)
router.get('/:id',auth,findUserById)
router.post('/',createUser)
router.patch('/:id',jwtAuth,checkOwer,updateUser)
router.delete('/:id',jwtAuth,checkOwer,deleteUser)
// 用户登录 
router.post('/login',login)

// 导出路由实例对象
module.exports = router







