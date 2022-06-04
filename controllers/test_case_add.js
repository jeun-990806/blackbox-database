module.exports.renderer = (request, response) => {
    response.render('add_test_case', {login_checked: request.session.email})
}