const { ipcMain, dialog, shell, app } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const LLMService = require('../backend/LLMService');

function registerModelIpc(state) {
  // Get models directory
  function getModelsDir() {
    return state.db?.getSetting('modelsDirectory') || path.join(app.getPath('userData'), 'models');
  }

  // Download model with progress
  ipcMain.handle('model:download', async (event, { url, filename }) => {
    console.log('=== model:download ===');
    console.log('URL:', url);
    console.log('Filename:', filename);

    const modelsDir = getModelsDir();
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }

    const destPath = path.join(modelsDir, filename);
    console.log('Destination:', destPath);

    // Check if already exists
    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      console.log('File already exists:', destPath);
      return { success: true, path: destPath, existed: true, size: stats.size };
    }

    // Check if partial download exists
    const tempPath = destPath + '.download';
    let resumeFrom = 0;
    if (fs.existsSync(tempPath)) {
      resumeFrom = fs.statSync(tempPath).size;
      console.log('Resuming from byte:', resumeFrom);
    }

    // Function to download with redirect handling
    const downloadFile = (downloadUrl, retries = 3) => {
      return new Promise((resolve, reject) => {
        const protocol = downloadUrl.startsWith('https') ? https : http;

        const options = {};
        if (resumeFrom > 0) {
          options.headers = { Range: `bytes=${resumeFrom}-` };
        }

        const request = protocol.get(downloadUrl, options, (response) => {
          // Handle redirects (301, 302, 307, 308)
          if (response.statusCode >= 300 && response.statusCode < 400) {
            const redirectUrl = response.headers.location;
            console.log(
              `Redirect (${response.statusCode}) to:`,
              redirectUrl?.substring(0, 100) + '...',
            );

            if (!redirectUrl) {
              reject(new Error('Redirect without location header'));
              return;
            }

            // Follow redirect
            downloadFile(redirectUrl, retries).then(resolve).catch(reject);
            return;
          }

          if (response.statusCode !== 200 && response.statusCode !== 206) {
            reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
            return;
          }

          const totalBytes = parseInt(response.headers['content-length'], 10) || 0;
          const totalSize = resumeFrom + totalBytes;
          console.log(`Downloading: ${(totalSize / 1e9).toFixed(2)} GB total`);

          // Create write stream (append if resuming)
          const file = fs.createWriteStream(tempPath, { flags: resumeFrom > 0 ? 'a' : 'w' });
          let downloadedBytes = resumeFrom;
          let lastUpdateTime = Date.now();
          let lastUpdateBytes = resumeFrom;

          response.on('data', (chunk) => {
            downloadedBytes += chunk.length;

            // Update progress every 500ms
            const now = Date.now();
            if (now - lastUpdateTime > 500) {
              const speed = (downloadedBytes - lastUpdateBytes) / ((now - lastUpdateTime) / 1000);
              const progress = totalSize > 0 ? Math.round((downloadedBytes / totalSize) * 100) : 0;

              if (event.sender && !event.sender.isDestroyed()) {
                event.sender.send('model:downloadProgress', {
                  filename,
                  progress,
                  downloaded: downloadedBytes,
                  total: totalSize,
                  speed: speed,
                });
              }

              lastUpdateTime = now;
              lastUpdateBytes = downloadedBytes;
            }
          });

          response.pipe(file);

          file.on('finish', () => {
            file.close();

            // Rename temp file to final filename
            try {
              if (fs.existsSync(destPath)) {
                fs.unlinkSync(destPath);
              }
              fs.renameSync(tempPath, destPath);
              console.log('✓ Download complete:', destPath);
            } catch (renameErr) {
              console.error('Rename failed:', renameErr);
              // If rename fails, the file is still at tempPath
              reject(renameErr);
              return;
            }

            resolve({ success: true, path: destPath, size: fs.statSync(destPath).size });
          });

          file.on('error', (err) => {
            file.close();
            console.error('File write error:', err);
            reject(err);
          });
        });

        request.on('error', (err) => {
          console.error('Request error:', err.message);

          if (retries > 0) {
            console.log(`Retrying... (${retries} retries left)`);
            setTimeout(() => {
              downloadFile(downloadUrl, retries - 1)
                .then(resolve)
                .catch(reject);
            }, 3000); // Wait 3 seconds before retry
          } else {
            reject(err);
          }
        });

        // Longer timeout (5 minutes)
        request.setTimeout(300000, () => {
          request.destroy();
          reject(new Error('Download timed out after 5 minutes'));
        });
      });
    };

    try {
      return await downloadFile(url);
    } catch (error) {
      console.error('Download failed:', error.message);
      throw error;
    }
  });

  // Cancel download
  ipcMain.handle('model:cancelDownload', async (event, filename) => {
    const modelsDir = getModelsDir();
    const tempPath = path.join(modelsDir, filename + '.download');
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
      return true;
    }
    return false;
  });

  // List models
  ipcMain.handle('model:list', () => {
    const modelsDir = getModelsDir();
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
      return [];
    }

    try {
      return fs
        .readdirSync(modelsDir)
        .filter((f) => f.endsWith('.gguf') && !f.endsWith('.download'))
        .map((f) => {
          const fullPath = path.join(modelsDir, f);
          return { name: f.replace('.gguf', ''), path: fullPath, size: fs.statSync(fullPath).size };
        });
    } catch {
      return [];
    }
  });

  // Select a model file from anywhere (no copying)
  ipcMain.handle('model:selectFile', async () => {
    console.log('IPC: model:selectFile called');

    const modelsDir = getModelsDir();
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

    const modelPath = result.filePaths[0];
    console.log('Selected:', modelPath);

    return {
      path: modelPath,
      name: path.basename(modelPath, '.gguf'),
      size: fs.statSync(modelPath).size,
    };
  });

  // Load model directly from its path (no copying)
  ipcMain.handle('model:load', async (event, modelPath) => {
    console.log('=== IPC: model:load ===');
    console.log('Path:', modelPath);

    if (!modelPath || !fs.existsSync(modelPath)) {
      return { success: false, error: 'Model file not found' };
    }

    try {
      if (state.llmService.initialized) {
        state.llmService.stopGeneration();
        state.llmService = new LLMService();
      }

      const contextSize = state.db?.getSetting('contextSize') || 4096;
      const threads = state.db?.getSetting('threads') || 4;

      await state.llmService.initialize(modelPath, { contextSize, threads });

      // Save last model path
      state.db?.setSetting('lastModelPath', modelPath);

      return {
        success: true,
        name: state.llmService.modelName,
        path: modelPath,
        contextSize,
        threads,
      };
    } catch (error) {
      console.error('Model load failed:', error.message);
      state.llmService = new LLMService();
      return { success: false, error: error.message };
    }
  });

  // Load last used model
  ipcMain.handle('model:loadLast', async () => {
    const lastPath = state.db?.getSetting('lastModelPath');
    if (!lastPath || !fs.existsSync(lastPath)) {
      return { success: false, error: 'No previous model found' };
    }

    try {
      const contextSize = state.db?.getSetting('contextSize') || 4096;
      const threads = state.db?.getSetting('threads') || 4;

      await state.llmService.initialize(lastPath, { contextSize, threads });

      return { success: true, name: state.llmService.modelName, path: lastPath };
    } catch (error) {
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
    console.log('model:status', status);
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

  // Open models directory in file explorer
  ipcMain.handle('model:openFolder', () => {
    const modelsDir = getModelsDir();
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }
    shell.openPath(modelsDir);
  });

  // Change models directory
  ipcMain.handle('model:changeDirectory', async () => {
    const result = await dialog.showOpenDialog({
      title: 'Select Models Directory',
      properties: ['openDirectory', 'createDirectory'],
    });

    if (result.canceled || result.filePaths.length === 0) return null;

    const newDir = result.filePaths[0];
    state.db.setSetting('modelsDirectory', newDir);

    return { path: newDir };
  });

  // Get recommended models
  ipcMain.handle('model:recommended', () => {
    return LLMService.getRecommendedModels();
  });
}

module.exports = { registerModelIpc };
