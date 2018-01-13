const mongoose = require('mongoose')
const Schema = mongoose.Schema


const infoSchema = new Schema({
    profilePicture: { type: String },
    name: {type: String, required: true },
    department: {type: String, required: true}, // especialidad
    residence: {type: String, required: true},
    birthDate: { type: Date, require: true},
    sex: {type: String, enum: ['H','M','No'], required: true},
    activities: [{ type: Schema.Types.ObjectId, ref:"Activity" }]
})

const docsSchema = new Schema({
    docimages: []
})

const photosSchema = new Schema({
    photos: []
})

const portfolioSchema = new Schema({
    information: {infoSchema, required: true},
    documents: {docsSchema},
    photos: {photosSchema}
})

module.exports = mongoose.model('Portfolio', portfolioSchema)