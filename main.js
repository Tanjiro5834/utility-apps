const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

//const FILE_PATH = path.join(app.getPath('userData'), 'records.json');
const FILE_PATH = path.join(process.cwd(), 'records.json');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

ipcMain.on('save-data', (event, data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  event.reply('save-status', 'Saved to: ' + FILE_PATH);
});

// Listener to load data
ipcMain.on('load-data', (event) => {
  if (fs.existsSync(FILE_PATH)) {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    event.reply('loaded-data', JSON.parse(data));
  }
});

app.whenReady().then(createWindow);