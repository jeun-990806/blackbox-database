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

mongoose.connect('mongodb://localhost:27017/black_box_database', {useNewUrlParser: true});

const controllers = {
    main_page: require('./controllers/main_page'),
    testcase: require('./controllers/testcase'),
    board: require('./controllers/board'),
    write: require('./controllers/write'),
    view: require('./controllers/view'),
    comment: require('./controllers/comment'),
    credit: require('./controllers/credit'),
    login: require('./controllers/login'),
    logout: require('./controllers/logout'),
    join: require('./controllers/join'),
    error: require('./controllers/error'),
}

const crawling_test = require('./test')

app.listen(4040);

app.use('/problem/load/', controllers.testcase.search)

app.get('/', controllers.main_page.renderer)
app.get('/index', controllers.main_page.renderer)
app.get('/board/:category', controllers.board.renderer)
app.get('/write', controllers.write.renderer)
app.post('/save_post', controllers.write.add_post)
app.get('/credits', controllers.credit.renderer)
app.get('/login', controllers.login.renderer)
app.get('/login/:fail_code', controllers.login.renderer)
app.get('/view/:post_id', controllers.view.renderer)
app.get('/view/:post_id/delete', controllers.view.delete)
app.post('/add_comment/:post_id', controllers.comment.add_comment)
app.use('/login_check', controllers.login.check_login_validate)
app.post('/login_check', controllers.login.set_login)
app.get('/logout', controllers.logout.logout)
app.get('/join', controllers.join.renderer)
app.use('/add_account', controllers.join.check_account_validate)
app.post('/add_account', controllers.join.add_account)
app.get('/testcase', controllers.testcase.renderer.search_page)
app.get('/testcase/view/:id', controllers.testcase.renderer.view_page)
app.get('/testcase/add/:id', controllers.testcase.renderer.add_page)
app.post('/testcase/save/:id', controllers.testcase.add)
app.get('/testcase/recommend/:problem_id/:testcase_id', controllers.testcase.recommend)
app.get('/testcase/report/:problem_id/:testcase_id', controllers.testcase.report)
app.get('/testcase/remove/:problem_id/:testcase_id', controllers.testcase.remove)
app.get('/error', controllers.error.renderer)

app.get('/test/:id', crawling_test)

app.use((request, response, next) => {
    response.redirect('/error')
});