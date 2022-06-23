module.exports.renderer = (request, response) => {
    response.render('credit', {logined_user: request.session.email})
}