const post = require('../models/post')
const moment = require('moment')

module.exports.renderer = async (request, response) => {
    const post_data = await post.findById(request.params.post_id)
    response.render('view', {post_data: post_data, moment: moment, logined_user: request.session.email})
}

module.exports.delete_validate = async (request, response, next) => {
    const target_post = await post.findOne({ _id: request.params.post_id, writer: request.session.email} )
    if(!target_post) return response.redirect('/error')

    next()
}

module.exports.delete = async (request, response) => {
    await post.deleteOne({ _id: request.params.post_id} )
    response.redirect('/board/questions')
}