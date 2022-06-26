const selenium = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const account = require('../models/account')
const problem = require('../models/problem')
const testcase = require('../models/testcase')
const source = require('../models/source')

module.exports.renderer = {
    search_page: (request, response) => { response.render('testcase', {logined_user: request.session.email}) },
    view_page: async (request, response) => {
        problem.findById(request.params.id, 
            async (error, element) => {
                if(error) console.log(error)
                if(element){
                    const answer_source = await source.findOne({problem_id: element._id})
                    testcase.find({problem_id: element._id}).sort({recommendation: -1}).exec(
                        (error, testcase_data) => {
                            if(error) console.log(error)
                            if(testcase_data) response.render('testcase', {logined_user: request.session.email, problem: element, testcases: testcase_data, source: answer_source})
                            else response.render('testcase', {logined_user: request.session.email, problem: element, source: answer_source})
                        }
                    )
                } else response.redirect('/error')
        })
    },
    add_page: (request, response) => {
        var message = ''
        if(request.query.is_failed === 'true') message = '잘못된 테스트케이스입니다.'
        problem.findById(request.params.id, 
            async (error, element) => {
                const answer_source = await source.findOne({problem_id: element._id})
                if(error) console.log(error)
                if(element) response.render('add_testcase', {logined_user: request.session.email, problem: element, has_answer: answer_source, test_result: message})
                else response.redirect('/testcase')
            }
        )
    }
}

module.exports.search = async (request, response, next) => {
    await problem.findOne({link: request.query.problem_url}).then(
        async (element) => {
            if(element) return response.redirect('/testcase/view/' + element._id)
            else {
                console.log('데이터를 불러옵니다.')
                const new_problem_id = await load_problem(request.query.problem_url)
                return response.redirect('/testcase/view/' + new_problem_id)
            }
        }
    )
}

module.exports.add = (request, response) => {
    testcase.create(
        {
            problem_id: request.params.id,
            writer: request.session.email,
            input_value: request.body.input,
            output_value: request.body.output
        },
        (error, element) => {
            if(error) console.log(error)
            if(!element) response.redirect('/error')
            else response.redirect('/testcase/view/' + request.params.id)
        }
    )
}

module.exports.recommend = (request, response) => {
    testcase.findById(request.params.testcase_id, (error, target) => {
        if(error){
            console.log(error)
            response.redirect('/error')
        } else {
            testcase.updateOne({_id: request.params.testcase_id}, {$set: {recommendation: target.recommendation + 1}}, 
                (error, result) => {
                    if(error){
                        console.log(error)
                        response.redirect('/error')
                    }
                    else response.redirect('/testcase/view/' + request.params.problem_id)
            })
        }
    })
}

module.exports.report = (request, response) => {
    if(!request.session.email) response.redirect('/error')
    else {
        testcase.findById(request.params.testcase_id, (error, target) => {
            if(!target) response.redirect('/error')
            else {
                testcase.updateOne({_id: request.params.testcase_id}, )
                account.findOne({email: target.writer}, (error, result) => {
                    if(result) account.updateOne({_id: result._id}, {$set: {reported_count: result.reported_count + 1}})
                    response.redirect('/testcase/view/' + request.params.problem_id)
                })
            }
        })
    }
}

module.exports.remove = (request, response) => {
    if(!request.session.email) response.redirect('/error')
    else {
        testcase.deleteOne({_id: request.params.testcase_id, writer: request.session.email}, 
            (error, result) => {
                if(error){
                    console.log(error)
                    response.redirect('/error')
                }else{
                    response.redirect('/testcase/view/' + request.params.problem_id)
                }
            })
    }
}

const load_problem = async (problem_url) => {
    const service = new chrome.ServiceBuilder(process.env.CHROMEDRIVER_PATH).build()
    
    try {
        chrome.setDefaultService(service)
    } catch (error) {
        console.log(error)
    }
    const driver = new selenium.Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless().setChromeBinaryPath(process.env.GOOGLE_CHROME_BIN)).build()
    try {
        await driver.get(problem_url)
        const title = await driver.findElement(selenium.By.css('#problem_title')).getText()
        const answer_ratio = await driver.findElement(selenium.By.css('#problem-info > tbody > tr > td:nth-child(6)')).getText()

        const new_problem = await problem.create({
            source_site: 'baekjoon',
            number: problem_url,
            title: title,
            answer_ratio: answer_ratio.split('%')[0],
            link: problem_url
        })
        if(new_problem) return new_problem._id
        else return ''
    } catch (error) {
        console.log(error)
        return ''
    } finally {
        await driver.quit()
    }
}