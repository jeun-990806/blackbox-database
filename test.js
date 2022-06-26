const child_process = require('child_process')
const fs = require('fs')

module.exports = async (request, response) => {
    const source_code =
`
#include <stdio.h>

int main(int argc, char *argv){
    int a, b;
    scanf("%d", &a);
    scanf("%d", &b);
    printf("%d", a+b);

    return 0;
}
`
    const input = '1 2'
    const output = '4'
    var real_output = ''
    
    const tmp_file_name = 'tmp_code'

    make_c_file(tmp_file_name, source_code)
    compile(tmp_file_name)
    
    response.write('input: ' + input)
    response.write('\nexpected output: ' + output)

    real_output = await execute(tmp_file_name + '.exe', input)
    response.write('\nreal output: ' + real_output)
    if(output === real_output) response.write('\ngood!\n')
    else response.write('\nwrong...\n')
    response.end()
}

const get_source = async (problem_id) => {
    await source.findOne({problem_id: problem_id}, 
        (error, result) => {
            if(error) console.log(error)
            return result.content
        }
    )
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