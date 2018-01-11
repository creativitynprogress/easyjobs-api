const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subcategroySchema = new Schema({
    name:{type: string},
})


module.exports = mongoose.model('Subcategory', subcategroySchema)