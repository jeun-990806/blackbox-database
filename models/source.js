const mongoose = require('mongoose')
const schema = mongoose.Schema

const source_schema = new schema({
    problem_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true
    },
    writer: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

const source = mongoose.model('source', source_schema)
module.exports = source