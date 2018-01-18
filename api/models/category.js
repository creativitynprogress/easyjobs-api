const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categroySchema = new Schema({
    name: {type: String, require: true, unique: true},
    image: { type: String },
    subcategories: [{ type: Schema.Types.ObjectId, ref:"Subcategory" }]
})


module.exports = mongoose.model('Category', categroySchema)