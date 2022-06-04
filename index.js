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
    test_case: require('./controllers/test_case'),
    add_test_case: require('./controllers/test_case_add'),
    add_source: require('./controllers/source_add'),
    board: require('./controllers/board'),
    write: require('./controllers/write'),
    view: require('./controllers/view'),
    credit: require('./controllers/credit'),
    login: require('./controllers/login'),
    logout: require('./controllers/logout'),
    join: require('./controllers/join'),
    error: require('./controllers/error')
}

app.listen(4040);

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
app.use('/login_check', controllers.login.check_login_validate)
app.post('/login_check', controllers.login.set_login)
app.get('/logout', controllers.logout.logout)
app.get('/join', controllers.join.renderer)
app.use('/add_account', controllers.join.check_account_validate)
app.post('/add_account', controllers.join.add_account)
app.get('/testcases', controllers.test_case.renderer)
app.get('/error', controllers.error.renderer)

app.use((request, response, next) => {
    response.redirect('/error')
});
