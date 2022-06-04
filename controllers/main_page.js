module.exports.renderer = (request, response) => {
    response.render('index', {login_checked: request.session.email})
}