const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categroySchema = new Schema({
    name: {type: String, require: true, unique: true},
    image: { type: String }
})


module.exports = mongoose.model('Category', categroySchema)