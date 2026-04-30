const { registerWindowIpc } = require('./windowIpc');
const { registerChatIpc } = require('./chatIpc');
const { registerModelIpc } = require('./modelIpc');
const { registerRagIpc } = require('./ragIpc');
const { registerHistoryIpc } = require('./historyIpc');
const { registerSettingsIpc } = require('./settingsIpc');
const AppDatabase = require('../backend/Database');
const LLMService = require('../backend/LLMService');

const state = { db: null, llmService: null, mainWindow: null };

function registerAllIpc() {
  console.log('Registering IPC handlers...');

  state.db = new AppDatabase();
  state.llmService = new LLMService();

  const { BrowserWindow } = require('electron');
  const windows = BrowserWindow.getAllWindows();
  if (windows.length > 0) state.mainWindow = windows[0];

  registerWindowIpc(state);
  registerChatIpc(state); // Make sure this is registered!
  registerModelIpc(state);
  registerRagIpc(state);
  registerHistoryIpc(state);
  registerSettingsIpc(state);

  console.log('All IPC handlers registered');
  console.log('  - Window: ✓');
  console.log('  - Chat: ✓');
  console.log('  - Model: ✓');
  console.log('  - RAG: ✓');
  console.log('  - History: ✓');
  console.log('  - Settings: ✓');
}

module.exports = { registerAllIpc, state };
