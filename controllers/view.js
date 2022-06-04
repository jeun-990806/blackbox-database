const post = require('../models/post')
const moment = require('moment')

module.exports.renderer = async (request, response) => {
    const post_data = await post.findById(request.params.post_id)
    response.render('view', {post_data: post_data, moment: moment, logined_user: request.session.email})
}