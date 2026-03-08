const { app, BrowserWindow, ipcMain } = require('electron')
const { exec } = require('child_process')
const path = require('path')
app.disableHardwareAcceleration()


// .\node_modules\.bin\electron --no-sandbox electron.js
function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  
 win.loadFile(path.join(__dirname, 'out/index.html'))

  win.webContents.on('did-fail-load', (_event, code, desc) => {
    console.error('Failed to load:', code, desc)
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on("lunch-mode",(_event, mode) => {
  if(mode == "Coding"){
    exec('explorer.exe spotify:')
    exec('cmd /c start "" "C:\\Users\\Asus\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe"')
    exec('cmd /c start steam://rungameid/3548580')
    exec('start chrome --profile-directory="Profile 1" https://claude.ai')
    //the chrome open wihtout cockie
    //stema didn't open properly 
  }

  if(mode == "Game"){
    exec('explorer.exe spotify:')
    exec('start discord://')
    exec('start chrome --profile-directory="Profile 3" https://www.bilibili.com/')
    exec('cmd /c start "" "C:\\Users\\Asus\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Steam\\Steam.lnk"')
  }

  if(mode == "Study"){
    exec('start chrome --profile-directory="Profile 3" https://mytimes.taylors.edu.my/login/index.php')
  }
})
