module.exports.renderer = (request, response) => {
    response.render('error', {login_checked: request.session.email})
}