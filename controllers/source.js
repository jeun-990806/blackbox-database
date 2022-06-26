const child_process = require('child_process')
const fs = require('fs')

const problem = require('../models/problem')
const source = require('../models/source')

module.exports.renderer = (request, response) => {
    problem.findById(request.params.problem_id,
        (error, result) => {
            if(error) console.log(error)
            if(result) response.render('add_source', {logined_user: request.session.email, problem: result})
            else response.redirect('/error')
        }
    )
}

module.exports.add = (request, response) => {
    // to-do: answer check

    source.create(
        {
            problem_id: request.params.problem_id,
            writer: request.session.email,
            content: request.body.source
        }
        , (error, result) => {
            if(error) console.log(error)
        }
    )
    response.redirect('/testcase')
}

module.exports.validate_testcase = async (request, response, next) => {
    const source_code = await get_source(request.params.problem_id)
    if(source_code === undefined) next()
    else {
        const input = request.body.input
        const output = request.body.output
        
        const tmp_file_name = process.env.TMP_DIR + 'tmp_code'

        make_c_file(tmp_file_name, source_code)
        compile(tmp_file_name)
        
        var real_output = await Promise.race([
            execute(tmp_file_name + '.exe', input),
            new Promise(resolve => {
              setTimeout(() => resolve(undefined), 10000)
            })
          ])

        if(output === real_output) next()
        else response.redirect('/testcase/add/' + request.params.problem_id + '?is_failed=true')
    }
}

const get_source = async (problem_id) => {
    return new Promise((resolve, reject) => {
        source.findOne({problem_id: problem_id}, 
            (error, result) => {
                if(error) console.log(error)
                if(result) resolve(result.content)
                else resolve(undefined)
            }
        )
    })
    
}

const make_c_file = (file_name, source_code) => {
    fs.writeFileSync(file_name + '.c', source_code, 'utf-8', (error, stdout, stderr) => {
        if(error) console.log(error)
        if(stdout) console.log(stdout)
        if(stderr) console.log(stderr)
    })
}

const compile = (file_name) => {
    child_process.execSync('gcc ' + file_name + '.c -o ' + file_name + '.exe')
}

const execute = (file_name, input) => {
    return new Promise((resolve, reject) => {
        const child = child_process.spawn(file_name)
        child.stdin.write(input)
        child.stdin.end()

        child.stdout.on('data', (data) => { resolve(data + '') } )
    });
}