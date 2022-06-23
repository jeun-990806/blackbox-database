const comment = require('../models/comment')

module.exports.add_comment = (request, response) => {
    comment.create(
        {
            writer: request.session.email,
            contents: request.body.comment_content,
            target_post_id: request.params.post_id
        }, 
        (error, account) => {
            if(error) console.log(error)
            response.redirect('/view/' + request.params.post_id)
        }
    )
}