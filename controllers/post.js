const post = require('../models/post')
const comment = require('../models/comment')
const moment = require('moment')
const { name_resolve } = require('./libs/board_category')

module.exports.renderer = {
    view_page: async (request, response) => {
        const post_data = await post.findById(request.params.post_id)
        const comment_data = await comment.find({target_post_id: request.params.post_id})
        response.render('view_post', {post_data: post_data, comments: comment_data, moment: moment, logined_user: request.session.email})
    },
    write_page: (request, response) => {
        if(request.session.email) response.render('write_post', {logined_user: request.session.email})
        else response.redirect('/error')
    }
}

module.exports.add = (request, response) => {
    post.create(
        {
            category: name_resolve(request.body.post_category),
            writer: request.session.email,
            title: request.body.post_title,
            content: request.body.post_content,
        }, 
        (error, result) => {
            if(error) console.log(error)
            if(result) response.redirect('/board/' + name_resolve(request.body.post_category))
            else response.redirect('/error')
        }
    )
}

module.exports.delete = async (request, response) => {
    post.findOne({ _id: request.params.post_id, writer: request.session.email},
        (error, target) => {
            if(error) console.log(error)
            if(target)  {
                post.deleteOne({ _id: target._id },
                    (error, result) => {
                        if(error) console.log(error)
                        if(result) response.redirect('/board/' + target.category)
                        else response.redirect('/error')
                    })
            }else response.redirect('/error')
        })
}