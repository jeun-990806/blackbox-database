module.exports.renderer = (request, response) => {
    response.render('error', {logined_user: request.session.email})
}