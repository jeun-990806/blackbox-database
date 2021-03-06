const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')

/* default setting */
if(!process.env.MONGODB_URL) process.env.MONGODB_URL = 'mongodb://localhost:27017/black_box_database'
if(!process.env.TMP_DIR) process.env.TMP_DIR = ''

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

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true});

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

let port = !process.env.PORT ? 4040 : process.env.PORT

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

app.use((request, response, next) => {
    console.log('error: ' + request.url)
    response.redirect('/error')
});