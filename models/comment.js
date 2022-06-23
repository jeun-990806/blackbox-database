const mongoose = require('mongoose')
const schema = mongoose.Schema

const comment_schema = new schema({
    writer: {
        type: String,
        required: true
    },
    written_date: {
        type: Date,
        default: new Date()
    },
    contents: {
        type: String,
        required: true
    },
    target_post_id: {
        type: String,
        required: true
    }
})

const comment = mongoose.model('comment', comment_schema)
module.exports = comment