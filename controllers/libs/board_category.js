module.exports.name_resolve = (category_name) => {
    switch(category_name) {
        case '질문 게시판':
            return 'questions'
        case '건의 게시판':
            return 'advices'
        default:
            return undefined
    }
}

module.exports.name_translate = (category_name) => {
    switch(category_name) {
        case 'questions':
            return '질문 게시판'
        case 'advices':
            return '건의 게시판'
        default:
            throw err
    }
}