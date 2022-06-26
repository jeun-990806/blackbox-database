const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')

const app = new express()

app.use(express.static('assets'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

app.set('view engine', 'ejs')

mongoose.connect('mongodb+srv://jeun:returnZeroProj385939@blackbox-database.vnmpj.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});

const controllers = {
    main_page: require('./controllers/main_page'),
    testcase: require('./controllers/testcase'),
    source: require('./controllers/source'),
    board: require('./controllers/board'),
    post: require('./controllers/post'),
    comment: require('./controllers/comment'),
    credit: require('./controllers/credit'),
    login: require('./controllers/login'),
    logout: require('./controllers/logout'),
    join: require('./controllers/join'),
    error: require('./controllers/error'),
}

const crawling_test = require('./test')

let port = process.env.PORT
if(port === null || port === '') port = 4040

app.listen(port)

app.use('/problem/load/', controllers.testcase.search)

app.get('/', controllers.main_page.renderer)
app.get('/index', controllers.main_page.renderer)

app.get('/board/:category', controllers.board.renderer)
app.get('/credits', controllers.credit.renderer)
app.get('/login', controllers.login.renderer)
app.get('/login/:fail_code', controllers.login.renderer)
app.get('/post/view/:post_id', controllers.post.renderer.view_page)
app.get('/post/write', controllers.post.renderer.write_page)
app.post('/post/save', controllers.post.add)
app.get('/post/delete/:post_id', controllers.post.delete)
app.post('/comment/add/:post_id', controllers.comment.add)
app.get('/comment/delete/:post_id/:comment_id', controllers.comment.delete)
app.use('/login/check', controllers.login.check_login_validate)
app.post('/login/check', controllers.login.set_login)
app.get('/logout', controllers.logout.logout)
app.get('/join', controllers.join.renderer)
app.use('/account/add', controllers.join.check_account_validate)
app.post('/account/add', controllers.join.add_account)
app.get('/testcase', controllers.testcase.renderer.search_page)
app.get('/testcase/view/:id', controllers.testcase.renderer.view_page)
app.get('/testcase/add/:id', controllers.testcase.renderer.add_page)
app.use('/testcase/save/:problem_id', controllers.source.validate_testcase)
app.post('/testcase/save/:id', controllers.testcase.add)
app.get('/testcase/recommend/:problem_id/:testcase_id', controllers.testcase.recommend)
app.get('/testcase/report/:problem_id/:testcase_id', controllers.testcase.report)
app.get('/testcase/remove/:problem_id/:testcase_id', controllers.testcase.remove)
app.get('/source/add/:problem_id', controllers.source.renderer)
app.post('/source/save/:problem_id', controllers.source.add)
app.get('/error', controllers.error.renderer)

app.get('/test', crawling_test)

app.use((request, response, next) => {
    console.log('error: ' + request.url)
    response.redirect('/error')
});