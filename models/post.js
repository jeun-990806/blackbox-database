const mongoose = require('mongoose')
const schema = mongoose.Schema

const post_schema = new schema({
    category: {
        type: String,
        required: true
    },
    writer: String,
    title: String,
    posted_date: {
        type: Date,
        default: new Date()
    },
    content: String,
})

const post = mongoose.model('post', post_schema)
module.exports = post