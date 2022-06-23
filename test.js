const selenium = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const problem = require('./models/problem')

module.exports = async (request, response) => {
    problem.findOne({number: request.params.id}, async (error, problem_info) => {
        if(!problem_info){
            const url = 'https://www.acmicpc.net/problem/' + request.params.id
            const service = new chrome.ServiceBuilder('./chromedriver.exe').build()
            try {
                chrome.setDefaultService(service);
            } catch (error) {
                console.log(error)
            }
            
            const driver = new selenium.Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build()
            try {
                await driver.get(url)
                const title = await driver.findElement(selenium.By.css('#problem_title')).getText()
                const answer_ratio = await driver.findElement(selenium.By.css('#problem-info > tbody > tr > td:nth-child(6)')).getText()
                problem.create({
                    source_site: 'baekjoon',
                    number: request.params.id,
                    title: title,
                    answer_ratio: answer_ratio.split('%')[0],
                    link: 'https://www.acmicpc.net/problem/' + request.params.id
                })
                response.write('문제를 긁어왔습니다!')
                return response.end()
            } catch (error) {
                console.log(error)
            } finally {
                await driver.quit()
            }
        }else{
            response.write('이미 긁어온 문제예요!')
            return response.end()
        }
    })

    
}