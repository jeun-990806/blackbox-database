module.exports.renderer = (request, response) => {
    response.render('index', {logined_user: request.session.email})
}