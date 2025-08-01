const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let currentFilePath = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 20, y: 13 },
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: () => newFile()
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => openFile()
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => saveFile()
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => saveAsFile()
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function newFile() {
  currentFilePath = null;
  mainWindow.webContents.send('new-file');
  updateTitle();
}

async function openFile() {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown Files', extensions: ['md', 'markdown'] },
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      currentFilePath = filePath;
      mainWindow.webContents.send('file-opened', { content, filePath });
      updateTitle();
    } catch (error) {
      dialog.showErrorBox('Error', `Could not open file: ${error.message}`);
    }
  }
}

async function saveFile() {
  if (currentFilePath) {
    mainWindow.webContents.send('save-file', currentFilePath);
  } else {
    await saveAsFile();
  }
}

async function saveAsFile() {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [
      { name: 'Markdown Files', extensions: ['md'] },
      { name: 'Text Files', extensions: ['txt'] }
    ],
    defaultPath: 'untitled.md'
  });

  if (!result.canceled) {
    currentFilePath = result.filePath;
    mainWindow.webContents.send('save-file', currentFilePath);
    updateTitle();
  }
}

function updateTitle() {
  const title = currentFilePath 
    ? `Markdown Editor - ${path.basename(currentFilePath)}`
    : 'Markdown Editor - Untitled';
  mainWindow.setTitle(title);
}

// IPC handlers
ipcMain.handle('save-content', async (event, content, filePath) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// IPC event handlers for toolbar buttons
ipcMain.on('new-file', () => {
  newFile();
});

ipcMain.on('open-file', () => {
  openFile();
});

ipcMain.on('save-file', () => {
  saveFile();
});

ipcMain.on('save-as-file', () => {
  saveAsFile();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
