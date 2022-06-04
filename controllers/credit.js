module.exports.renderer = (request, response) => {
    response.render('credit', {login_checked: request.session.email})
}