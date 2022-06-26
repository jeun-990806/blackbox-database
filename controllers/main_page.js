const testcase = require('../models/testcase')

module.exports.renderer = (request, response) => {
    testcase.count().exec(
        (error, result) =>{
            if(error) console.log(error)
            if(result) response.render('index', {logined_user: request.session.email, testcases_count: result})
            else response.render('index', {logined_user: request.session.email})
        }
    )
    
}