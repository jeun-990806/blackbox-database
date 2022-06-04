const bcrypt = require('bcrypt')
const account = require('../models/account')

module.exports.renderer = (request, response) => {
    if(request.session.email) response.redirect('/error')
    else {
        var fail_message = ''
        if(request.params.fail_code === '1'){
            fail_message = '해당 계정은 존재하지 않습니다.'
        }else if(request.params.fail_code === '2'){
            fail_message = '비밀번호가 맞지 않습니다.'
        }
        response.render('login', {hint: fail_message})
    }
}

module.exports.set_login = async (request, response) => {
    account.findOne({email: request.body.email}, (error, account_info) => {
        if(account_info){
            bcrypt.compare(request.body.password, account_info.password, (error, result) => {
                if(result) {
                    request.session.email = request.body.email
                    request.session.save((error) => {
                        // usually, redirect() executed before other actions(saving new session data, etc) done.
                        // because redirection is asynchronous function.
                        // so, to ensure that functions are executed in order, we have to use the callback function.
                        return response.redirect('/index')
                    })
                } else response.redirect('/login/2')
            })
        }else response.redirect('/login/1')
    })
}

module.exports.check_login_validate = (request, response, next) => {
    if(request.body.email === '' || request.body.password === '')
        return response.redirect('/login/1')
    next()
}