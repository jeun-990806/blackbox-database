const post = require('../models/post')

module.exports.renderer = (request, response) => {
    if(request.session.email) response.render('write', {login_checked: request.session.email})
    else response.redirect('/error')
}

module.exports.add_post = (request, response) => {
    post.create(
        {
            category: request.body.post_category,
            writer: request.session.email,
            title: request.body.post_title,
            content: request.body.post_content,
        }, 
        (error, account) => {
            if(error) console.log(error)
            if(request.body.post_category === '질문 게시판') response.redirect('/board/questions')
            else response.redirect('board/advices')
        }
    )
}