module.exports.logout = (request, response) => {
    request.session.destroy(() => {
        response.redirect('/index')
    })
}