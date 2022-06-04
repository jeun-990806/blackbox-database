module.exports.renderer = (request, response) => {
    response.render('add_source', {login_checked: request.session.email})
}