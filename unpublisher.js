const { exec } = require("child_process"),
execute = async() => {
    for(let i = 111; i < 145; i++){
        await new Promise(resolve => exec(`npm unpublish dolfo-angular@1.${i}.0`, function (error, stdout, stderr) {
            console.log("stdout: " + stdout)
            console.log("stderr: " + stderr)

            if (error !== null) 
                console.log("exec error: " + error)

            resolve()
        }))
    }
}

execute()