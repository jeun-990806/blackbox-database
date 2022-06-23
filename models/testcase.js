const mongoose = require('mongoose')
const schema = mongoose.Schema

const testcase_schema = new schema({
    problem_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    writer: {
        type: String,
        required: true
    },
    input_value: {
        type: String,
        required: true
    },
    output_value: {
        type: String,
        required: true
    },
    recommendation: {
        type: Number,
        default: 0
    },
    reported_count: {
        type: Number,
        default: 0
    }
})

const testcase = mongoose.model('testcase', testcase_schema)
module.exports = testcase