const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // window
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  unmaximizeWindow: () => ipcRenderer.send('window:unmaximize'),
  closeWindow: () => ipcRenderer.send('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  onMaximizeChange: (cb) => {
    const handler = (e, v) => cb(v);
    ipcRenderer.on('window:maximizeChange', handler);
    return () => ipcRenderer.removeListener('window:maximizeChange', handler);
  },
  // chat
  sendMessage: (msg) => ipcRenderer.invoke('chat:send', msg),
  streamMessage: (msg, cb) => {
    const handler = (e, token) => cb(token);
    ipcRenderer.on('chat:token', handler);
    ipcRenderer.invoke('chat:sendStream', msg);
    return () => ipcRenderer.removeListener('chat:token', handler);
  },
  stopGeneration: () => ipcRenderer.send('chat:stop'),

  // RAG
  processFile: (filePath) => ipcRenderer.invoke('rag:process', filePath),
  selectFile: () => ipcRenderer.invoke('dialog:selectFile'),

  // Models
  getModels: () => ipcRenderer.invoke('model:list'),
  selectModelFile: () => ipcRenderer.invoke('model:selectFile'),
  loadModel: (path) => ipcRenderer.invoke('model:load', path),
  unloadModel: () => ipcRenderer.invoke('model:unload'),
  getModelStatus: () => ipcRenderer.invoke('model:status'),
  openModelsFolder: () => ipcRenderer.invoke('model:openFolder'),
  deleteModel: (path) => ipcRenderer.invoke('model:delete', path),
  getRecommendedModels: () => ipcRenderer.invoke('model:recommended'),

  // Model downloads
  downloadModel: (url) => ipcRenderer.invoke('model:download', url),
  onDownloadProgress: (cb) => {
    const handler = (e, v) => cb(v);
    ipcRenderer.on('model:downloadProgress', handler);
    return () => ipcRenderer.removeListener('model:downloadProgress', handler);
  },

  // history
  getChats: () => ipcRenderer.invoke('history:list'),
  getChat: (id) => ipcRenderer.invoke('history:get', id),
  getMessages: (chatId) => ipcRenderer.invoke('history:messages', chatId),
  createChat: (id, title, model) => ipcRenderer.invoke('history:createChat', id, title, model),
  addMessage: (id, chatId, role, content, attachments) =>
    ipcRenderer.invoke('history:addMessage', id, chatId, role, content, attachments),
  updateChatTitle: (id, title) => ipcRenderer.invoke('history:updateTitle', id, title),
  deleteChat: (id) => ipcRenderer.invoke('history:delete', id),

  // settings
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (s) => ipcRenderer.invoke('settings:save', s),
});
