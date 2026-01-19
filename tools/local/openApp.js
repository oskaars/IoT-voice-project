import { exec } from 'child_process';

async function openApp({ appName }) {
    // We need a Promise wrapper because 'exec' is not async by default (unlike axios)
    return new Promise((resolve, reject) => {

        // TODO: Define the command
        const command = `open -a "${appName}"`;

        // TODO: Execute the command
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return resolve("error opening app: " + error.message)
            }
            resolve("Success, fully opened" + appName)
            console.log(`child process information: ${stdout}`);
        });
    });
}

export { openApp };
