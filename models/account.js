const mongoose = require('mongoose')
const schema = mongoose.Schema

const bcrypt = require('bcrypt')

const account_schema = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    source_contribution_count: {
        type: Number,
        default: 0
    },
    tc_contribution_count: {
        type: Number,
        default: 0
    },
    reported_count: {
        type: Number,
        default: 0
    }
})

account_schema.pre('save', function(next) {
    const user = this

    bcrypt.hash(user.password, 10, (error, hash) => {
        user.password = hash
        next()
    })
})

const account = mongoose.model('account', account_schema)
module.exports = account