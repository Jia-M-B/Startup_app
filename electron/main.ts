import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import { fileURLToPath } from 'node:url'
import { exec } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')
const categoriesPath = path.join(__dirname, '../categories.json')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    title: 'Lazy Person Startup Apps',
    icon: path.join(process.env.APP_ROOT, 'buttonImage', 'startup.png'),
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0a0a2e',
      symbolColor: '#ffffff',
      height: 36,
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// -------------------

function loadCategories() {
  const data = readFileSync(categoriesPath, 'utf-8')
  return JSON.parse(data)
}

function saveCategories(data: any) {
  writeFileSync(categoriesPath, JSON.stringify(data, null, 2))
}

// Launch apps from JSON
ipcMain.on('lunch-mode', (_event, categoryId: string) => {
  const { categories } = loadCategories()
  const category = categories.find((c: any) => c.id === categoryId)
  if (category) {
    category.programs.forEach((program: any) => {
      exec(program.location)
    })
  }
})

// Load categories
ipcMain.handle('get-categories', () => {
  return loadCategories()
})

// Save categories
ipcMain.handle('save-categories', (_event, data: any) => {
  saveCategories(data)
  return true
})

// Test a program location
ipcMain.handle('test-program', (_event, location: string) => {
  exec(location, (error) => {
    if (error) console.error('Test failed:', error)
  })
  return true
})


Menu.setApplicationMenu(null)
app.whenReady().then(createWindow)

