const { ipcMain } = require('electron');

function registerSettingsIpc(state) {
  ipcMain.handle('settings:get', () => ({
    temperature: state.db.getSetting('temperature') || 0.7,
    maxTokens: state.db.getSetting('maxTokens') || 2048,
    contextSize: state.db.getSetting('contextSize') || 8192,
    systemPrompt: state.db.getSetting('systemPrompt') || '',
  }));

  ipcMain.handle('settings:save', (event, settings) => {
    Object.entries(settings).forEach(([key, value]) => state.db.setSetting(key, value));
    return true;
  });
}

module.exports = { registerSettingsIpc };
