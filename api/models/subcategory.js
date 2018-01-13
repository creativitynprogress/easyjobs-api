const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subcategroySchema = new Schema({
    name:{type: String, require: true},
    activities: [{ type: Schema.Types.ObjectId, ref:"Activity" }]
})


module.exports = mongoose.model('Subcategory', subcategroySchema)