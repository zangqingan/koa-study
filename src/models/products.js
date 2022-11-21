const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    name:{
        type:String
    },
    title:{
        type:String
    },
    weight:{
        type:Number
    }
})
module.exports = mongoose.model('Product',schema)