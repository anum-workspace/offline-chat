const { ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

function registerRagIpc(state) {
  ipcMain.handle('rag:process', async (event, filePath) => {
    try {
      const ext = path.extname(filePath).toLowerCase();
      let text = '';

      if (ext === '.txt' || ext === '.md' || ext === '.json' || ext === '.js' || ext === '.py') {
        text = fs.readFileSync(filePath, 'utf8');
      } else {
        text = `[Binary file: ${path.basename(filePath)}]`;
      }

      return { text: text.slice(0, 5000), name: path.basename(filePath) };
    } catch (error) {
      return { text: '', error: error.message };
    }
  });

  ipcMain.handle('dialog:selectFile', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'All Supported', extensions: ['txt', 'pdf', 'md', 'json', 'js', 'py', 'png', 'jpg', 'jpeg', 'gif'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    if (result.canceled) return null;
    const filePath = result.filePaths[0];
    return {
      path: filePath,
      name: path.basename(filePath),
      type: path.extname(filePath),
      size: fs.statSync(filePath).size,
    };
  });
}

module.exports = { registerRagIpc };
