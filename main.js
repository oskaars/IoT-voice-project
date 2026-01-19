import { app, BrowserWindow } from "electron";
import { spawn } from "node:child_process";
import path from 'path'
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let serverProcess


function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })

    mainWindow.loadFile('public/index.html')
}


app.whenReady().then(() => {
    serverProcess = spawn('node', ['server.js'], { 
        cwd: __dirname, //runs an app in a project directory
        stdio: 'inherit'

    })
    createWindow()
})



app.on('window-all-closed', ()=>{
    serverProcess.kill();
    app.quit()
})