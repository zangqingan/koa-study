// 具体的业务抽离到控制器中
// 引入集合进行数据的curd
const User = require('../models/users')
// 引入jsonwebtoken生成token
const jsonwebtoken = require('jsonwebtoken')
// 签名配置
const {secret} = require('../config/config')

// 全面拥抱es6，本质上导出一个个函数（中间件）就行，不过为了高级都将这些函数封装成一个类的方法
class Users{
  // 1.获取全部用户
  async findUser(ctx){
    const data = await User.find()
    ctx.body = data
  }
  //2.获取指定id用户
  async findUserById(ctx) {
    // 路由参数会被挂载到ctx.params对象上
    const data = await User.findById(ctx.params.id)
    if(!data){ctx.throw(404,'用户不存在')}
    ctx.body = data
  }
  //3.创建用户
  async createUser(ctx) {
    // 参数校验
    ctx.verifyParams({
      username:{type:'string',required:true},
      password:{type:'string',required:true},
    })
    // 判断唯一性
    const {username}= ctx.request.body
    const unione = await User.findOne({username})
    if(unione){ctx.throw(409,'用户名已存在请修改！')}
    const result = await User.create(ctx.request.body)
    ctx.body = result

  }
  //4.更新指定用户
  async updateUser(ctx) {
    ctx.verifyParams({
      username:{type:'string',required:false},
      password:{type:'string',required:false},
    })
    const data = await User.findByIdAndUpdate(ctx.params.id,ctx.request.body)
    if(! data){ctx.throw(404,'用户不存在')}
    ctx.body={
      message:"修改成功"
    }
  }
  //5.删除用户
  async deleteUser(ctx) {
    const data = await User.findByIdAndRemove(ctx.params.id)
    if(! data){ctx.throw(404,'用户不存在')}
    ctx.body={
          message:"已经删除"
    }
  }
  // 6.用户登录
  async login(ctx){
    ctx.verifyParams({
      username:{type:'string',required:true},
      password:{type:'string',required:true},
    })
    // 登录步骤1 判断用户是否存在
    const user =await User.findOne(ctx.request.body)
    if(!user){ctx.throw(401,'用户名或密码错误')}
    //  登录步骤2 签名生成token
    const {_id,username} = user 
    const token = jsonwebtoken.sign({_id,username},secret,{expiresIn:'1d'})
    //  登录步骤3 返回token给前端
    ctx.body = {token}

  }
  //7.用户授权，即别人用你的token也不能修改你的内容
  async checkOwer(ctx,next){
    // 如果传过来的id不是自己的则不饿能修改
    if(ctx.params.id !== ctx.state.user._id){ctx.throw(403,'没有权限操作')}
    await next()
  }

}

// 将类的实例导出
module.exports = new Users()