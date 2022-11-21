// 引入mongoose
const mongoose = require('mongoose')
// 定义schema方法
const schema =  new mongoose.Schema({
    username:{type:String,require:true},
    email:{type:String},
    password:{type:String,require:true,},//select:false字段不显示
    avatar:{type:String},

},{timestamps:true})

// 导出集合对象User
module.exports = mongoose.model('User',schema)