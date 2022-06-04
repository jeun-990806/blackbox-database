module.exports.renderer = (request, response) => {
    response.render('test_case', {login_checked: request.session.email})
}