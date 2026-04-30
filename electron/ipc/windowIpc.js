const { ipcMain, BrowserWindow } = require('electron');

function registerWindowIpc(state) {
  ipcMain.on('window:minimize', () => BrowserWindow.getFocusedWindow()?.minimize());
  ipcMain.on('window:maximize', () => { BrowserWindow.getFocusedWindow()?.maximize(); });
  ipcMain.on('window:unmaximize', () => { BrowserWindow.getFocusedWindow()?.unmaximize(); });
  ipcMain.on('window:close', () => { BrowserWindow.getFocusedWindow()?.close(); });
  ipcMain.handle('window:isMaximized', () => BrowserWindow.getFocusedWindow()?.isMaximized() || false);
}

module.exports = { registerWindowIpc };
