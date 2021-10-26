const exec = require('child_process').exec;


export function analyseSource(names){
    downloadPackages(names);
}

function downloadPackages(packages){
    for(let pkg of packages){
        
        child = exec('npm install '+pkg).stderr.pipe(process.stderr);
        //child_process.exec('npm install '+pkg,{stdio:[0,1,2]});
        /*child = exec('npm install '+pkg,
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });*/
    }
}