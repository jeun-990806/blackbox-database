const post = require('../models/post')
const moment = require('moment')

module.exports.renderer = async (request, response) => {
    var category = ''

    if(request.params.category === 'advices')
        category = '건의 게시판'
    else if(request.params.category === 'questions')
        category = '질문 게시판'

    const post_data = await post.find({category: category}).sort({posted_date: -1})
    response.render('board', {board_title: category, login_checked: request.session.email, posts: post_data, moment: moment})
}