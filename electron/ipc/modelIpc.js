const { ipcMain, dialog, shell, app } = require('electron');
const path = require('path');
const fs = require('fs');
const LLMService = require('../backend/LLMService');

function registerModelIpc(state) {
  // List installed models
  ipcMain.handle('model:list', () => {
    console.log('IPC: model:list called');
    const models = LLMService.getAvailableModels();
    console.log('Found models:', models.length);
    return models;
  });

  // Select model file
  ipcMain.handle('model:selectFile', async () => {
    console.log('IPC: model:selectFile called');

    const modelsDir = path.join(app.getPath('userData'), 'models');
    console.log('Models dir:', modelsDir);

    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }

    const result = await dialog.showOpenDialog({
      title: 'Select GGUF Model File',
      filters: [
        { name: 'GGUF Model Files', extensions: ['gguf'] },
        { name: 'All Files', extensions: ['*'] },
      ],
      defaultPath: modelsDir,
      properties: ['openFile'],
    });

    if (result.canceled || result.filePaths.length === 0) {
      console.log('File selection canceled');
      return null;
    }

    const sourcePath = result.filePaths[0];
    console.log('Selected file:', sourcePath);

    // Check file exists
    if (!fs.existsSync(sourcePath)) {
      console.error('Selected file does not exist!');
      return { success: false, error: 'File not found' };
    }

    // Copy to models folder if not already there
    const destPath = path.join(modelsDir, path.basename(sourcePath));

    if (sourcePath !== destPath) {
      console.log('Copying model to models folder...');
      fs.copyFileSync(sourcePath, destPath);
      console.log('Copied to:', destPath);
    }

    return {
      path: destPath,
      name: path.basename(destPath, '.gguf'),
      size: fs.statSync(destPath).size,
    };
  });

  // Load model
  ipcMain.handle('model:load', async (event, modelPath, options = {}) => {
    console.log('=== IPC: model:load ===');
    console.log('Path:', modelPath);
    console.log('Options:', options);

    if (!modelPath || !fs.existsSync(modelPath)) {
      return { success: false, error: 'Model file not found' };
    }

    try {
      if (state.llmService.initialized) {
        state.llmService.stopGeneration();
        state.llmService = new LLMService();
      }

      // Get settings for context size
      let contextSize = options.contextSize;
      if (!contextSize) {
        const saved = state.db?.getSetting('contextSize');
        contextSize = saved || 2048;
      }

      await state.llmService.initialize(modelPath, { contextSize });

      return {
        success: true,
        name: state.llmService.modelName,
        path: modelPath,
        contextSize: contextSize,
      };
    } catch (error) {
      console.error('Model load failed:', error.message);
      state.llmService = new LLMService();
      return { success: false, error: error.message };
    }
  });

  // Get model status
  ipcMain.handle('model:status', () => {
    const status = {
      initialized: state.llmService?.initialized || false,
      modelName: state.llmService?.modelName || null,
      modelPath: state.llmService?.modelPath || null,
    };
    console.log('IPC: model:status', status);
    return status;
  });

  // Unload model
  ipcMain.handle('model:unload', () => {
    console.log('IPC: model:unload');
    if (state.llmService) {
      state.llmService.stopGeneration();
    }
    state.llmService = new LLMService();
    return true;
  });

  // Open models folder
  ipcMain.handle('model:openFolder', () => {
    const modelsDir = path.join(app.getPath('userData'), 'models');
    if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });
    shell.openPath(modelsDir);
  });

  // Delete model
  ipcMain.handle('model:delete', async (event, modelPath) => {
    console.log('IPC: model:delete', modelPath);
    try {
      if (fs.existsSync(modelPath)) {
        // Unload if this model is loaded
        if (state.llmService?.modelPath === modelPath) {
          state.llmService = new LLMService();
        }
        fs.unlinkSync(modelPath);
        return { success: true };
      }
      return { success: false, error: 'File not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Get recommended models
  ipcMain.handle('model:recommended', () => {
    return LLMService.getRecommendedModels();
  });
}

module.exports = { registerModelIpc };
