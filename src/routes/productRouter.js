// 引入路由对象
const Router = require('@koa/router')
// 创建一个新的路由对象并设置前缀信息
const router = new Router({
    // 设置路由前缀信息
    prefix:'/api/product'
})

// 引入集合进行数据的curd
const Product = require('../models/products')
/*这里将路由命中时对应的中间件函数放一起，实际应该抽离 */
router.get('/',async ctx => {// responds to "/api/product"
    const data = await Product.find()
    ctx.body = data
})
router.get('/:id',async ctx => {// 路由参数会被挂载到ctx.params对象上
    const data = await Product.findById(ctx.params.id)
    ctx.body = data
})
router.post('/',async ctx => {
    const data = ctx.request.body
    const result = await Product.create(data)
    ctx.body = result

})
router.put('/:id',async ctx => {
    const product = await Product.findById(ctx.params.id)
    product.title = ctx.request.body.title
    product.name = ctx.request.body.name
    product.weight = ctx.request.body.weight
    await product.save()
    ctx.body = product
})

router.delete('/:id',async ctx => {
    const product = await Product.findById(ctx.params.id)
    console.log(product)
    if(product){
        await product.remove()
        ctx.body={
            success:true
        }
    }else{
        ctx.body={
            message:"已经删除"
        }
    }
    
})
// 导出路由实例对象
module.exports = router







