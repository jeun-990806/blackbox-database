const post = require('../models/post')
const moment = require('moment')
const { name_translate } = require('./libs/board_category')

module.exports.renderer = async (request, response) => {
    const post_data = await post.find({category: request.params.category}).sort({posted_date: -1})
    response.render('board', {board_title: name_translate(request.params.category), logined_user: request.session.email, posts: post_data, moment: moment})
}