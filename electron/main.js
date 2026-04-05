const { app, BrowserWindow, ipcMain, clipboard, shell, screen } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let isPinned = false;
let isMiniMode = false;
const DATA_FILE = path.join(app.getPath('userData'), 'ibag-data.json');
const IMAGES_DIR = path.join(app.getPath('userData'), 'images');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function createWindow() {
  const { width: screenW, height: screenH } = screen.getPrimaryDisplay().workAreaSize;
  
  mainWindow = new BrowserWindow({
    width: 420,
    height: 750,
    minWidth: 320,
    minHeight: 500,
    frame: false,
    transparent: false,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'icon.png'),
    title: 'iBag',
  });

  mainWindow.loadFile(path.join(__dirname, 'www', 'index.html'));
  
  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// IPC Handlers
ipcMain.handle('save-data', async (event, data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Save error:', e);
    return false;
  }
});

ipcMain.handle('load-data', async () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Load error:', e);
  }
  return null;
});

ipcMain.handle('toggle-pin', () => {
  isPinned = !isPinned;
  mainWindow.setAlwaysOnTop(isPinned);
  mainWindow.webContents.send('pin-state-changed', isPinned);
  return isPinned;
});

ipcMain.handle('get-pin-state', () => isPinned);
ipcMain.handle('get-mini-mode', () => isMiniMode);

ipcMain.handle('toggle-mini-mode', () => {
  isMiniMode = !isMiniMode;
  if (isMiniMode) {
    mainWindow.setSize(280, 400);
    mainWindow.setMinimumSize(280, 300);
  } else {
    mainWindow.setSize(420, 750);
    mainWindow.setMinimumSize(320, 500);
  }
  mainWindow.webContents.send('mini-mode-changed', isMiniMode);
  return isMiniMode;
});

ipcMain.handle('minimize-window', () => {
  mainWindow.minimize();
});

ipcMain.handle('close-window', () => {
  mainWindow.close();
});

ipcMain.handle('copy-to-clipboard', (event, text) => {
  clipboard.writeText(text);
  return true;
});

ipcMain.handle('open-external', (event, url) => {
  shell.openExternal(url);
  return true;
});

ipcMain.handle('save-image', async (event, id, base64Data, mimeType) => {
  try {
    const ext = mimeType?.includes('png') ? '.png' : '.jpg';
    const filePath = path.join(IMAGES_DIR, `${id}${ext}`);
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);
    return `file://${filePath}`;
  } catch (e) {
    console.error('Save image error:', e);
    return null;
  }
});

ipcMain.handle('load-image', async (event, id) => {
  try {
    const pngPath = path.join(IMAGES_DIR, `${id}.png`);
    const jpgPath = path.join(IMAGES_DIR, `${id}.jpg`);
    const filePath = fs.existsSync(pngPath) ? pngPath : fs.existsSync(jpgPath) ? jpgPath : null;
    if (filePath) {
      const data = fs.readFileSync(filePath);
      const ext = path.extname(filePath);
      const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
      return `data:${mime};base64,${data.toString('base64')}`;
    }
  } catch (e) {
    console.error('Load image error:', e);
  }
  return null;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
