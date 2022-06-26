const account = require('../models/account')

module.exports.renderer = (request, response) => {
    var best_tc_contributor = 'no one'
    var best_ac_contributor = 'no one'
    account.find().sort({source_contribution_count: -1}).exec(
        (error, result) => {
            if(error) console.log(error)
            if(result && result[0].source_contribution_count > 0) best_ac_contributor = result[0].email
            account.find().sort({tc_contribution_count: -1}).exec(
                (error, result) => {
                    if(error) console.log(error)
                    if(result && result[0].tc_contribution_count > 0) best_tc_contributor = result[0].email
                    response.render('credit', {logined_user: request.session.email, best_tc_contributor: best_tc_contributor, best_ac_contributor: best_ac_contributor})
            })
        }
    )
    
}