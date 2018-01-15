const mongoose = require('mongoose')
const Schema = mongoose.Schema


const subcategroySchema = new Schema({
    name:{type: String, require: true},
    activities: [ {type: String} ]
})


module.exports = mongoose.model('Subcategory', subcategroySchema)