const { ipcMain } = require('electron');

function registerHistoryIpc(state) {
  ipcMain.handle('history:list', () => state.db.getChats());
  ipcMain.handle('history:get', (event, id) => state.db.getChat(id));
  ipcMain.handle('history:messages', (event, chatId) => state.db.getMessages(chatId));
  ipcMain.handle('history:createChat', (event, id, title, model) => state.db.createChat(id, title, model));
  ipcMain.handle('history:addMessage', (event, id, chatId, role, content, attachments) => state.db.addMessage(id, chatId, role, content, attachments));
  ipcMain.handle('history:updateTitle', (event, id, title) => state.db.updateChatTitle(id, title));
  ipcMain.handle('history:delete', (event, id) => state.db.deleteChat(id));
}

module.exports = { registerHistoryIpc };
