const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categroySchema = new Schema({
    name: {type: String, require: true},
    subcategory: [{ type: Schema.Types.ObjectId, ref:"subcategory" }]
})


module.exports = mongoose.model('Category', categroySchema)