const mongoose = require('mongoose')
const schema = mongoose.Schema

const problem_schema = new schema({
    source_site: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    answer_ratio: {
        type: Number
    },
    link: {
        type: String,
        required: true
    },
    updated_date: {
        type: Date,
        default: new Date()
    }
})

const problem = mongoose.model('problem', problem_schema)
module.exports = problem