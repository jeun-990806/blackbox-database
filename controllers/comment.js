const comment = require('../models/comment')

module.exports.add = (request, response) => {
    comment.create(
        {
            writer: request.session.email,
            contents: request.body.comment_content,
            target_post_id: request.params.post_id
        }, 
        (error, account) => {
            if(error) console.log(error)
            response.redirect('/post/view/' + request.params.post_id)
        }
    )
}

module.exports.delete = (request, response) => {
    comment.deleteOne(
        {
            _id: request.params.comment_id,
            writer: request.session.email
        },
        (error, result) => {
            if(error) console.log(error)
            response.redirect('/post/view/' + request.params.post_id)
        }
    )
}