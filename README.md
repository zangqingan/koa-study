# 一、 Koa简介
koa 是基于nodejs平台的下一代web开发框架，它是由 Express 原班人马打造的，致力于成为一个更小、更富有表现力、更健壮的 Web 框架。所以跟express是很相似的，底层也都是共用的同一套 HTTP 基础库，不过koa都是使用es6及以上版本的语法，同时对于异步解决方法koa选择的是异步函数。而且koa本身是没有捆绑任何的中间件,就做http服务器，其它功能都需要通过使用第三方中间件解决。
官网:https://koajs.com/
中间件列表:https://github.com/koajs/koa/wiki

# 二、 koa安装和使用
## 2.1 使用 koa-generator 脚手架快速生成目录结构。
安装脚手架语法：npm install koa-generator -g，安装脚手架之后就可以使用koa2命令了。
koa2 项目名 即可创建并启动项目。
使用脚手架创建一般会使用模板引擎后面再看一般不使用。
## 2.2 使用npm，自己定义项目结构。
跟express-study基本一样，初始化为node项目并安装koa
初始化为node项目：npm init -y
安装语法：npm install koa
项目名/
    public/ 静态资源的存放目录
        images,本地图片资源存放目录
        uoload,图片上传目录
    src/
        config---操作数据库相关配置，全局密钥配置等目录
        models---monngodb数据库的集合目录
        middleware---自定义中间件或者第三方中间件目录
        routers---路由相关只做路由的匹配跳转工作目录
        controllers---控制器目录，可以把路由命中时对应的处理函数抽离出来即是控制器。
        app.js---入口文件名字随便起，约定app或者index
注意：这个目录结构是自己定义的，可随自己意愿设计。
## 2.3 开启服务器(创建koa应用)
在入口文件app.js，主要是三步。
//1.引入Koa
const Koa = require('koa');
//2.实例化
const app = new Koa();

/*****挂载路由，业务代码，其它中间件等开始 *****/

这里一般都是引入挂载路由，业务代码，错误处理等其它中间件代码即可，实际编写都抽离到具体的文件中。

/*****挂载路由，业务代码，其它中间件等结束 *****/

//3.开启监听
app.listen(5000,() => {
    console.log('server is running on port 5000')
});
这就是一个简单的Koa 应用，它创建并返回了一个监听在5000端口的 HTTP 服务器。
注意：入口文件一定要简洁，一般只做初始化的操作，具体业务都分发下去由对应的中间件执行。
## 2.4 koa应用配置
koa应用配置就是koa实例的配置，即koa实例所拥有的属性和方法，本质上是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组织和执行的。
跟express的实例app是类似的，常用属性和方法如下：
app.env 设置环境变量，默认为 NODE_ENV or "development"
app.listen(port,callback) 用来创建并返回一个 HTTP 服务器
app.use(function) 为应用注册并添加指定的中间件，本质是一个函数。
跟express中学的是一样的。不过返回的是 this即当前koa应用实例, 因此可以链式表达。
app.use().use().use()等等。

* Context(上下文)
    Koa Context 是将 node 的 request 和 response 对象封装在一个单独的对象里面，并为编写 web 应用和 API 提供了很多有用的方法的一个http请求上下文对象。其实就是express的req和res封装到一个对象ctx里了，之前req,res提供的api也变成了ctx提供。
    ctx在每个 request 请求中被创建，在中间件中作为接收器(receiver)来引用。即有http网络请求ctx就会被创建并且ctx要在异步函数里使用。
ctx.req，原生Node 的 request 对象，可以看作是express的req。
ctx.res，原生Node 的 response 对象，可以看作是express的res。
ctx.request，Koa 的 Request 对象，它是对 原生Node 的 request对象的 进一步抽象和封装。
ctx.response，Koa 的 Response 对象，它是对 原生Node 的 response对象的 进一步抽象和封装。
注意它们是不一样的东西。

提供的常见API如下：注意 Koa 不支持直接调用底层 res 进行响应处理。
所以请避免直接使用以下 node 属性：
    res.statusCode
    res.writeHead()
    res.write()
    res.end()
而是使用ctx提供的方法属性。
下面就是ctx提供的各种api，这些api是获取前端传过来的数据，它可以写在路由匹配时对应的中间件(处理函数)里用来处理相应的业务。
而且下面的 ctx.xxx === ctx.request.xxx 为true，也就是说它们是一样的。
只是说为了方便可以直接使用 ctx.xxx。
ctx.header 获取或设置请求头对象信息,如：Accept，cookie，请求体数据类型等。
ctx.url，获取请求的url，它是对node相关模块url等的进一步封装
ctx.method，获取HTTP请求的方法
ctx.path，获取请求路径名
ctx.query，将查询参数字符串进行解析并以对象的形式返回，如果没有查询参数字字符串则返回一个空对象。
ctx.querystring，获取查询参数字符串(url中?后面的部分)，不包含?符号。
ctx.hostname，获取 hostname。
ctx.origin，获取URL原始地址, 包含 protocol 和 host，如：=> http://example.com
ctx.href，获取完整的请求URL, 包含 protocol, host 和 url， 如：=> http://example.com/foo/bar?q=1
ctx.params，获取Router的 params(路由参数) 如：/users/:id，params是一个对象。
ctx.request.body，获取body(请求体)即前端传过来数据 如：{name:'李磊'}常用格式json。注意：它是前端传过来的值需要安装第三方中间件koa-body或者koa-bodyparser来解析请求体和ctx.body是不一样的。

实际例子：http://localhost:5000/api/blog/list?auther=wanggeng&id=1
    console.log('ctx.url',ctx.url)   /api/blog/list?auther=wanggeng&id=1
    console.log('ctx.method',ctx.method) GET
    console.log('ctx.path',ctx.path)  /api/blog/list
    console.log('ctx.query',ctx.query)  [Object: null prototype] { auther: 'wanggeng', id: '1' }
    console.log('ctx.querystring',ctx.querystring)  auther=wanggeng&id=1
    console.log('ctx.hostname',ctx.hostname)  localhost
    console.log('ctx.origin',ctx.origin) http://localhost:5000
    console.log('ctx.href',ctx.href) http://localhost:5000/api/blog/list?auther=wanggeng&id=1


ctx.response，Koa 的 Response 对象是对 node 的 response 进一步抽象和封装,这些方法是服务端在异步函数里编写返回给前端的数据，
而且下面的 ctx.xxx == ctx.response.xxx，为true。也就是说它们是一样的。
只是为了方便也直接使用 ctx.xxx。
ctx.body=x，设置响应体并返回给前端。注意和获取前端请求体数据的ctx.request.body做区分。
ctx.status=状态码数字，设置响应状态码返回给前端。默认情况下，response.status 设置为 404  
ctx.message，获取响应状态消息。
ctx.type，获取 response Content-Type，不包含像"charset"这样的参数。
ctx.redirect('url')，重定向到对应 url。
ctx.set('响应头字段','字段对应的值')，设置响应头信息返回给前端。
ctx.set('Allow','GET,POST,PUT,DELETE')设置响应头信息,HTTP允许的请求方法
ctx.set('Content-Type','application/json')设置响应头信息,请求体的数据格式
tips：常见http响应状态码如下。
200 "ok"
304 "not modified"
400 "bad request"
401 "unauthorized"
403 "forbidden"
404 "not found"
500 "internal server error"
502 "bad gateway"
503 "service unavailable"


# 三、koa中间件
## 3.1 koa中间件概述
在https://github.com/koajs/koa上面的就是官方维护的中间件，不在就是第三方开发的中间件。
koa中间件和express中间件是很相似的，不过它有两种方式实现一种是普通函数,一种是异步函数。
但是不管哪种实现方式它本质还是一个函数。中间件通常带有两个参数(ctx,next),ctx是一个请求的上下文（context）,该对象封装了一个传入的 http 消息，并对该消息进行了相应的响应。 next 是调用执行下游(下一个)中间件的函数,在代码执行完成后通过then方法返回一个 Promise。
不过Koa 选择了洋葱圈模型，即在koa里中间件的执行顺序跟洋葱一样一层一层的。如下图所示：
![img](./public/images/middlewareModel.png)

也就是说当一个中间件调用了await next()时，它自己就会变为等待状态停止执行，并将控制权传递给下一中间件并执行，在下一个中间件执行完成之后再回到之前的中间件继续执行，如果下一个也执行了await next()，重复上一个步骤，这样不断嵌套使用就会变成像洋葱一样一层一层的。
注意：要执行下一个中间件一定记得把next参数加上并执行await next()。

洋葱模型：即遇到next()后会先执行下一个中间件，只有下一个中间件执行结束后才会再回到当前中间件。
具体例子如下：
    app.use(async (ctx,next) => {
        console.log(1)
        await next() //next()是一个异步操作，所有要await一下。
        console.log(2)
    });
    app.use(async (ctx,next)=> {
        console.log(3)
        await next()
        console.log(4)
    });
    app.use(async ctx => {
        console.log(5)
    }); 
输出结果：1，3，5，4，2
## 3.2 koa环境变量设置中间件
和express是一样的在window平台上通过cross-env中间件设置环境变量。
当设置环境变量为 NODE_ENV=production 时，易造成 Windows 命令的阻塞。
在运行时，脚本通过检查 process.env.NODE_ENV 查找该值。通过 NODE_ENV 的值 判断服务器应在 开发 还是 生产模式下运行。
本质是通过process的env属性对象获取自己设置的变量值,可以给NODE环境设置一个变量，通过process.env.xxxxx来获取。
安装:npm install --save-dev cross-env,
使用:在包管理文件package.json文件的scripts选项中设置。
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "serve": "cross-env NODE_ENV=dev nodemon ./src/app.js",
    "prd": "cross-env NODE_ENV=production  pm2 ./src/app.js"
  },
## 3.3 koa跨域中间件
koa也可以自己编写原生跨域中间件，本质其实就是设置http头部信息。
不过一般使用社区提供的中间件
app.use(async (ctx, next) => {
    // 允许来自所有域名请求
    ctx.set("Access-Control-Allow-Origin", "*");
    // 设置所允许的HTTP请求方法
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
    // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
    ctx.set("Access-Control-Allow-Headers", "authorization, x-requested-with, accept, origin, content-type");
    // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。
    // Content-Type表示具体请求中的媒体类型信息
    ctx.set("Content-Type", "application/json;charset=utf-8");
    // 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。
    // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
    ctx.set("Access-Control-Allow-Credentials", true);
    // 该字段可选，用来指定本次预检请求的有效期，单位为秒。
    // 当请求方法是PUT或DELETE等特殊方法或者Content-Type字段的类型是application/json时，服务器会提前发送一次请求进行验证
    // 下面的的设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证
    ctx.set("Access-Control-Max-Age", 300);
    await next();
})
第三方中间件跨域：kcors
安装：$ npm install @koa/cors --save
使用：引入注册即可
const cors = require('@koa/cors')
app.use(cors())
一步简写：app.use(require('@koa/cors')())
这种默认的配置一般就行了。
    origin: request Origin header
    allowMethods: GET,HEAD,PUT,POST,DELETE,PATCH
可以传入一个配置对象，具体更细致的约束条件请查看官网。
## 3.4 koa处理请求体中间件
koa本身是不能获取前端传过来的请求体数据的，但是通过安装第三方插件即可实现。
有很多这样的中间件，比较常用的如：koa-bodyparser、koa-body等。
但是推荐使用koa-body,因为它是一个功能齐全的koa体解析器中间件。
支持multipart/form-data、urlencoded和json请求主体,还支持文件上传。
注意的是要在路由注册前注册。
安装语法：npm install koa-body
    //在入口文件引入koa-bodyparser
    const koaBody = require('koa-body');
    //注册到app上
    app.use(koaBody())
在注册之后，就可以直接使用ctx.request.body 来获取前端传过来的请求体的值了。
通常又使用JSON.stringify(ctx.request.body)将其转换成json字符串格式再返回。
    //返回响应数据给前端
    ctx.body = JSON.stringify(ctx.request.body);
设置图片上传的目录
const  path = require('path')
app.use(koaBody({
    // 启用文件传输选项默认是false，因为文件的类型就是 multipart/form-data
    multipart:true,
    // formidable是一个包,koa-body引用了它，本身又是一个对象。
    formidable:{
        // 上传目录
        uploadDir:'../public/uploads',
        // 保留文件扩展名
        keepExtensions:true
    }
}))
设置这些配置之后，会在ctx.request.files.uploadfile 对象上挂载相关的文件信息。
其中uploadfile是前端上传页面input元素的name属性定义的属性值，这里前后端要统一的，不然查找不到。
uploadfile(上传文件对象)对象常见属性如下：
{
    size: 上传文件的大小,
    path: 上传文件的本地绝对路径
    name: 'index.jpg' 上传文件名
    type: 'image/jpeg',上传文件类型
}
这时文件已经实现了上传，但是只能本地访问，如果想要使用http协议地址访问，就要使用koa静态资源托管服务。
注意：虽然这个中间件也能实现文件上传，但是一般也不用，而是使用社区中其它轮子可以更加方便的实现一样的功能。
如：koa-multer
## 3.5 koa上传图片资源
用户头像，封面图片等等主要是上传图片，生成图片链接，限制上传图片的大小类型
通过koa-body加上koa-stati已经可以实现文件的上传了，但是社区中还有其它轮子可以更加方便的实现一样的功能，如：koa-multer
安装：npm install --save koa-multer
引入const multer = require('koa-multer')
const upload = multer({ dest: 'public/uploads' })设置文件上传目录,是一个对象也算是一个中间件
在上传文件路由前加上
router.post('/upload',upload.single('filename'),middleware)
upload.single('filename')方法接受一个以 fieldname 命名的文件即前端input元素的name属性值，这个文件的信息会保存在 ctx.req.file 对象上，注意是ctx.req而不是ctx.request。
文件信息主要有一下部分
{
    fieldname: 'file',
    originalname: 'index.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: 'public/uploads',
    filename: 'd8479c482718937ae9f0d31e8520a071',
    path: 'public\\uploads\\d8479c482718937ae9f0d31e8520a071',
    size: 18650
}
## 3.6 koa检验请求体参数中间件
使用第三方中间件 koa-parameter 校验前端传过来的请求体中的数据是否符合类型要求了。注意要在请求体中间件后面注册，
安装：$ npm install koa-parameter --save
// parameter检验请求体参数
const parameter = require('koa-parameter')
// 注册到app实例，就会将parameter的verifyParams()方法挂载到ctx上
parameter(app)，这种注册不会添加参数验证错误捕获中间件到app中。
app.use(parameter(app))这样注册会添加参数验证错误捕获中间件到app中。
ctx.verifyParams({
    name:{type:'string',require:true},
    age:{type:'number',require:true}
})
## 3.7 koa静态资源托管中间件
可以使用koa-static中间件设置静态资源服务目录,然后就可以通过网络请求访问这个静态资源目录里所有的资源。跟express.static()类似。
安装：npm i koa-static
const koaStatic = require('koa-static')
app.use(koaStatic(
    <!-- 设置目录 -->
    path.join(__dirname,'public')
))
// 写法二
app.use(require('koa-static')(root, opts))，现在访问静态资源目录上传文件的路径是：ctx.origin + /uploads + 文件的basename。
具体如下：http://localhost:5000/uploads/upload_e455507973fe4290c1e3d159e4a8dc72.jpg。
生成的每一个文件对应的静态资源访问连接，通过 ctx.origin，获取URL原始地址(协议+主机)，通过原生path模块的basename()方法获取basename，最后拼接返回即可。
## 3.8 koa路由中间件
koa也可以有原生路由，实际是对node的url等模块的封装，在node里需要通过解析url的组成获取到path和http请求的方法类型。
在koa中可以直接通过ctx.url获取url，ctx.method获取HTTP请求的方法继形成路由如下：
app.use(async ctx => {
    if(ctx.url === '/' && ctx.method === 'GET'){
        ctx.body = 'Hello World 主页get请求'
    }else if(ctx.url === '/product' && ctx.method === 'GET'){
        ctx.body = '这是通过get请求获取的产品列表信息页'
    }else{
        ctx.status = 404
    }

});
可以自己编写但是没必要重复造轮子，直接使用社区中的koa-router即可。
在koa中路由的本质也是一个中间件(函数)，是用来决定不同的url被不同的中间件(异步处理函数)执行，只要路由命中就会执行对应的中间件。
同时不同的HTTP请求方法也执行不一样的中间件。
安装：npm i @koa/router 
* koa-router路由中间件的使用
    // 引入koa-router
    const Router = require('koa-router')
    // 实例化路由
    const router = new Router({
        //当url过长或者想方便替换都可以通过prefix配置前缀信息
         prefix: '/api'
    })
    module.exports = router
    // 在入口文件引入并注册路由中间件到app上，使用路由实例的routes()方法返回。
    app.use(router.routes()).use(router.allowedMethods())或者分开写
    app.use(router.routes())，不添加前缀
    app.use(router.allowedMethods())，当所有路由中间件执行完成之后,如果ctx.status为空或者404时才会执行这个方法用来丰富响应头信息。 如：
        相应地返回405(不允许即还没写)501(没实现即koa不支持的http方法)
        响应options方法，告知它所支持的http请求方法类型有哪些
    http的options方法作用如下：  
        检测服务器支持的请求方法有哪些
        cors(跨域)时预检请求
    注意：当路由很多时一个一个在入口文件引入并注册明显过于繁琐且重复，所以需要一个中转者index.js
    从引入注册步骤不难看出，第一需要根据路由文件所在路径引入，第二使用app.use注册，第三index.js不需要执行这些步骤而是由它在入口文件挂载执行。需要到node原生的fs模块即可。
* koa路由增删改查响应
    router.get(),最好返回一个数组 [{},{},....]
    router.post(),返回新增的那个数据
    router.put(),返回新增的那个数据
    router.delete(),返回状态码204表示删除成功没有返回内容。
注意：如果需要进行验证授权，只需将对应验证授权中间件放在路由对应中间件之前同时记得执行next即可。
同时为了形成mvc模型，会将回调中间件抽离出来成控制器。

* 路由参数获取
在定义路由时使用 /:路由参数名，来表示一个路由参数，直接通过ctx.params获取它是一个对象，具体通过ctx.params.路由参数名 来获取指定的路由参数。
## 3.9 koa控制器
人为抽离的一个功能，拿到路由分配的任务并执行，本质也是一个中间件(函数)。其实就是命中路由时对应的回调函数，它可以获取HTTP请求的参数即前端传过来的数据如分页信息，每一页数据总条数，路由参数，请求体等，处理业务逻辑对数据库进行curd操作，发送HTTP响应返回给前端如状态码，响应头，响应体等。
每个资源的控制器分别存放controllers文件夹里的不同js文件中，将路由和具体实现分离出来。
在使用es5时是定义一个一个函数并导出，而在使用es6后将这些函数封装成类和类方法来实现控制器，导出的是类的实例对象。
同时对数据的 curd操作也是放到这里实现。
## 3.10 koa操作数据库中间件
和原生node和express一样在koa中也是通过第三方插件 mongoose 实现对mongodb数据库的操作。
* 安装:npm i mongoose
    //引入
    const mongoose = require('mongoose')
    //建立链接  mongoose.connect(数据库地址,{配置对象},callback)
    mongoose.connect('mongodb://127.0.0.1:27017/本地数据库名',{useNewUrlParser:true , useUnifiedTopology: true},err => {//输出数据库连接错误})
这个配置一般会抽离出来放到一个单独的配置文件里，然后在入口文件引入即可。
到此数据有了，但是与mysql不同的是不需要建表，只需要定义集合即可也就是一个js文件它就是一个资源对应的表，也就是说一个js文件就是一个集合(表)，操作集合也就是操作表了，所以很方便。
* 设计集合(表)对应的schema，也就是数据的json结构
    数据库连接存放到config配置文件夹，而设计的schema(模型)存放到models文件夹中。
    主要用到mongoose的 Schema()类和model()方法
    // 引入mongoose
    const mongoose = require('mongoose')
    // 可以解构出来也可以直接点运算符操作。
    const schema =  new mongoose.Schema({
        字段名:{字段类型约束，必要性约束等和mysql声明表结构时的约束是一样的}
        username:{type:String,required:true},
        email:{type:String},
        password:{type:String},
        avatar:{type:String},

    },{timestamps:true//添加时间戳})

    // 生成并导出集合对象User
    module.exports = mongoose.model('User',schema)

    // 定义schema方法二 
    // const {Schema,model} =mongoose
    // const userSchema =  new Schema({
    //     username:{type:String,required:true},
    // })
    // 导出集合对象User
    // module.exports = model('User',userSchema)
## 3.11 koa认证与授权
用户的认证和授权问题：认证就是让服务器知道你是谁，授权就是服务器知道你是谁后确认你能干什么，不能干什么。而这一切的源头是因为：HTTP协议是非连接性的，使用浏览器访问页面的内容会在关闭浏览器后丢失，HTTP链接也会断开，没有任何机制去记录访问的页面信息也就是会话信息。
所以必须要有一种机制让页面知道原来页面的会话内容，这也是session的原理。
    认证：在服务器端对客户端传回来的token进行验证并获取用户信息
    授权：使用中间件保护接口，即不同的用户只能访问不同的接口。
* 传统的cookie和session
    session在计算机中，尤其是在网络应用中，称为“会话控制”。
    意思是当用户使用浏览器访问网页向服务器通信的时候，服务器会在内存里(或者redis中)开辟一块内存区域用来存储了当前用户会话相关的属性及配置信息，这块内存区域就叫做session，它本质是一个对象。
    然后服务器会将其引用地址通过响应头的set-cookie字段返回给客户端，客户端一般将这个值命名为sessionid并存储在cookie中(这是一种方法)，而cookie是浏览器中一个可以保存数据的内存区域。
    此后用户再向服务器端请求时都会在请求头的cookie字段携带这个sessionid发给服务器，服务器根据sessionid在自己内存里找到唯一对应的内存区域即session对象并解析，解析后就知道当前用户的权限能干什么不能干什么最后将信息再次返回给前端。
    客户端要退出当前会话只需要把cookie清空即可，或者在服务器主动清除session。

    优点：
        相比于jwt，session可以被服务器主动清除。
        session保存在服务器端，相对更加安全。
        和浏览器的cookie结合使用，比较灵活，兼容比较好。
    缺点：
        cookie+session在跨域场景中不好，因为cookie不可跨域。
        如果是分布式部署，需要做多机session共享机制
        基于cookie的机制很容易被CSRF攻击
    客户端存储数据的方法：
        sessionStorage：仅在当前会话有效，关闭页面或关闭浏览器就会被清除。
        localStorage：除非被手动清除不然永久存在，jwt生成的token(令牌)就一般存储在这里。

* JWT
    JWT是json web token的缩写，它是RFC(网络请求意见稿)的一个开放标准RFC7519。
    它定义了一种紧凑且独立的方式，用来将各方之间的信息作为JSON对象进行安全传输。
    该信息是可以被验证和信任的，因为这个信息是经过数字签名的。它也是为了实现客户端和服务器端之前的鉴权和认证的一种方法，本质是一串字符串。

    JWT构成：头部(header)+有效载荷(payload)+签名(signature)，它们之间使用 . 分隔。

    头部(header)：本质是一个json有两个字段，在生成token时使用 base64 进行了编码。
        typ(type):token(令牌)的类型，这里固定是JWT
        alg(algorithm):使用何种hash算法加密，如RSA，SHA256等
    类似：{"typ":"JWT","alg":"HS256"} base64 编码后就变成了一堆字符串如下：'eyjhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9'

    有效载荷(payload)：本质也是一个json，字段是真实存储需要传递的信息，如用户id，用户名等。还有一个元数据信息，如过期时间，发布人等等。与header不同，除了base64编码外有效载荷还可以再次进行加密。
    类似：{"user_id":"zhangsan"} base64url 编码后如下： 'eyJ1c2VyX2lkIjoiemhhbmdzYM4ifQ'

    签名(signature)：对头部和有效载荷这两部分进行签名(即使用密钥再加密一次)，目的是保证token在传输的过程中没有被篡改或者损坏。而且在签名之后还要再进行一次base64编码。
    完整的签名算法是：signature = HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload),secret密钥)

    JWT工作流程：
    首先客户端向服务器发送请求时会携带有效载荷，服务器端接收到后进行验证，验证成功就将需要返回的信息加入到有效载荷中，再对有效载荷和jwt头部一起进行base64编码。
    然后使用密钥对编码之后的有效载荷和jwt头部进行签名，签名完成之后再进行一次base64编码就形成一个token(令牌本质就是一串字符串)返回给客户端。{token:'xxxx'}
    最后客户端将token保存在localStorage或者sessionStorage中，在下次请求时在请求头中的 authorization字段带上这个token就可以验证用户信息了。
    而退出只需要将token删除即可，也就是将localStorage或者sessionStorage中的token删除。
    而前端对localStorage或者sessionStorage的操作都是有浏览器提供的api接口的。

* JWT和session比较
    可扩展性，jwt更好不需要在服务器端存储token。
    安全性，都有可能会遭受攻击，要自己注意防范，不要把重要信息放在token里。
    性能，jwt存储大量信息时开销比较大，而session多时后端也需要根据id查找。
    时效性，jwt差一点，而session可以在服务器端主动删除。

* 在nodejs中使用JWT
    方法一：在nodejs中通过第三方库jsonwebtoken来实现签名生成token。
    安装：npm i jsonwebtoken
    引入：const jsonwebtoken = require('jsonwebtoken')
    引入之后jwt对象会提供如下的api：
        decode(token):对token进行解码就能得到payload信息,有一个iat字段表示签名时的时间。
        verify(token,secret): 对token进行验证，需要传入签名时的密钥。输出和decode()方法是一样的，不过这个输出结果是经过验证的所以一般使用这个方法。
        sign(json,secret):签名方法，第一个参数是要签名的json对象，第二个参数是密钥
        JsonWebTokenError(): 如果密钥不对，或者token不对就会报这个错误
        TokenExpiredError: 
        NotBeforeError: 

    不难看出jwt本身是没有权限的功能的，所以需要自己写一个中间件来实现身份的认证和授权。
    
    登录认证流程：首先前端需要把用户名密码等标识信息传递给后端，然后后端先判断数据库是否存在该用户。存在用户后端对不敏感的信息添加到有效载荷中签名生成token，最后返回token给前端。之后前端对其它接口的请求都带上这个token。
    实际操作：在middleware文件夹新建一个auth.js，
    认证步骤1：获取前端请求头对象的 authorization，前端不设置时默认为空
    认证步骤2：对authorization的值进行拆分，获取其中的token
    认证步骤3：验证token 如果token被修改过或者为空，都是401错误，即没有认证。使用try/catch来捕获错误。验证成功把信息挂载到ctx.state.user上。然后哪个接口需要认证即登录之后才能访问)就把这个中间件放到对应的路由即可，本质就是发送请求我这个接口必须有token，如果前端你每传过来那我就报错不给你执行下一步操作。而如果有人拿了你的token想要冒充你进而修改你的信息这时还想需要一步就是检查你是不是你，即通过id等唯一标识进行匹配。

    前端传递jwt token的标准是在请求头的Authorization 字段中传递，注意Bearer后面有一个空格。
    Authorization:Bearer token (这是http请求头这个字段的规范写法)
    Bearer:送信人的意思
    后端获取前端返回的token就很简单了，从ctx.request.header对象中解构authorization出来即可，注意请求头中的字段都会变为小写的。

    方法二：使用koa-jwt中间件这个中间件还可以和其它组合使用，具体看文档。
    这个中间件只是用来认证的，生成token用的还是jsonwebtoken这个中间件。
    由于 koa-jwt 从 koa-v2 分支开始不再导出 jsonwebtoken 的 sign 、 verify 和 decode 方法，若要单独生成 token 、验证 token 等，需另从 jsonwebtoken 中将其引入：
    安装：npm i koa-jwt
    const jwt = require("koa-jwt")
    const auth = jwt({secret}) 这样就生成了一个认证中间件了
    验证后的信息也是挂载到ctx.state.user上的。
## 3.12 koa日志管理中间件
使用koa-logger控制台输出，使用koa-morgan输出到文件中。
1.koa-logger它是一个development style logger，默认Transporter是console输出的，可以自定义。
安装：$ npm install koa-logger
使用：引入注册
const logger = require('koa-logger')
app.use(logger())

2.koa-morgan
npm install --save koa-morgan
const morgan = require('koa-morgan')
//创建存储日志文件的位置
const logFileName = path.join(__dirname, 'logs', 'access.log')
//创建写入流
const accessLogWriteStream = fs.createWriteStream(logFileName, {flags: 'a'})
//使用morgan写入
app.use(morgan('combined', { stream: accessLogWriteStream }))
## 3.13 koa错误处理中间件
错误处理是编程语言里的一种机制，用来处理软件或信息系统中出现的异常状况，防止程序挂掉。
告诉开发者哪里出错了，错误信息是什么，以便于开发者调试。
一般错误信息会保存到一个文件中，所有文件的读写操作常常会一起使用。
如：
    运行时错误表示服务器出错(语法没错)：返回500状态码，会自动抛出错误
    逻辑错误：如找不到(404)，无法处理的实体(参数格式不对422)

1.koa自带有错误处理
    如：请求的接口不存在返回404 not found等。
    可以通过ctx.throw(412,'先决条件失败，这个文本也会被返回')手动抛出错误。
自己编写错误处理中间件
在try{}catch(err){err就是一个 错误对象，里面的属性是ctx.throw抛出的信息}

2.使用第三方中间件 koa-json-error 处理错误
    它会帮忙返回json格式的错误信息，错误名，堆栈信息，状态吗等，也可以自己设置返回的字段信息
或者根据环境变量返回错误信息，生产环境不返回错误堆栈。
安装：npm install --save koa-json-error
引用：const error = require('koa-json-error')
注册：error()方法就是返回一个错误处理中间件
app.use(error({
    //配置对象
    postFormat:( e, {stack,...rest}) => {
        process.env.NODE_ENV === 'production'?rest:{stack,...rest}
        第一个参数 e 是原来的错误对象
        第二个参数 {} 是一个过滤对象即应该返回的内容，stack是错误堆栈信息，
    }
}))
## 3.14 koa配置读取中间件
dotenv是一个零依赖模块，它将环境变量从.env文件加载到process.env中。
这样在其它文件中就可以通过 process.env.环境变量名 来访问指定的环境变量了。
安装：npm install dotenv
在根目录下创建一个 .env文件在里面保存要传入process.env对象的字段名
在要使用的地方引入：require('dotenv').config()



