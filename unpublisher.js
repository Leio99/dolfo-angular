const { exec } = require("child_process"),
execute = async() => {
    for(let i = 199; i < 237; i++){
        // Eseguire prima npm config set //registry.npmjs.org/:_authToken=IL_TUO_TOKEN_COPIATO con un token di NPM
        await new Promise(resolve => exec(`npm deprecate dolfo-angular@1.${i}.0 "Versione vecchia"`, function (error, stdout, stderr) {
            console.log("stdout: " + stdout)
            console.log("stderr: " + stderr)

            if (error !== null) 
                console.log("exec error: " + error)

            resolve()
        }))
    }
}

execute()