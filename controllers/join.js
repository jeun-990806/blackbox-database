const account = require('../models/account')

module.exports.renderer = (request, response) => {
    if(request.session.email) response.redirect('/error')
    else response.render('join')
}

module.exports.add_account = (request, response) => {
    account.create(
        {
            email: request.body.email,
            name: request.body.name,
            password: request.body.password
        }, 
        (error, account) => response.redirect('/')
    )
}

module.exports.check_account_validate = async (request, response, next) => {
    var email_check = await account.findOne({email: request.body.email})
    if(email_check !== null || request.body.email === '' || request.body.name === '' || request.body.password === '')
        return response.redirect('/join')
    next()
}