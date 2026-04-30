const path = require('path');
const fs = require('fs');
const { app } = require('electron');

class LLMService {
  constructor() {
    this.llama = null;
    this.model = null;
    this.context = null;
    this.initialized = false;
    this.modelName = null;
    this.modelPath = null;
    this.generating = false;
    this.contextSize = 2048;
  }

  async initialize(modelPath, options = {}) {
    console.log('=== LLMService.initialize ===');
    console.log('Model path:', modelPath);

    if (this.initialized) {
      this.initialized = false;
    }

    if (!modelPath || !fs.existsSync(modelPath)) {
      throw new Error(`Model file not found: ${modelPath}`);
    }

    const stats = fs.statSync(modelPath);
    console.log(`Model size: ${(stats.size / 1e9).toFixed(2)} GB`);

    const contextSize = options.contextSize || 2048;
    const threads = options.threads || 4;
    this.contextSize = contextSize;

    try {
      const { getLlama } = await import('node-llama-cpp');

      this.llama = await getLlama({ gpu: 'auto' });

      console.log('Loading model...');
      this.model = await this.llama.loadModel({ modelPath: modelPath, gpuLayers: 'auto' });

      console.log(`Creating context (size: ${contextSize})...`);
      this.context = await this.model.createContext({
        contextSize: contextSize,
        threads: threads,
        batchSize: 256,
      });

      this.modelName = path.basename(modelPath, '.gguf');
      this.modelPath = modelPath;
      this.initialized = true;

      console.log('✓ Model ready');
      return true;
    } catch (error) {
      console.error('Init failed:', error.message);

      // Fallback: CPU only with smaller context
      if (error.message.includes('VRAM') || error.message.includes('context size')) {
        const fallbackSize = Math.floor(contextSize / 2);
        if (fallbackSize >= 512) {
          try {
            console.log(`Trying fallback with smaller context: , context: ${fallbackSize}`);
            const { getLlama } = await import('node-llama-cpp');
            this.llama = await getLlama({ gpu: true });
            this.model = await this.llama.loadModel({ modelPath });
            this.context = await this.model.createContext({
              contextSize: fallbackSize,
              threads: 4,
              batchSize: 128,
            });
            this.modelName = path.basename(modelPath, '.gguf');
            this.modelPath = modelPath;
            this.initialized = true;
            this.contextSize = fallbackSize;
            console.log('✓ Model ready with smaller context');
            return true;
          } catch (e) {
            console.error('Fallback also failed:', e.message);
          }
        }
      }

      this.llama = null;
      this.model = null;
      this.context = null;
      this.initialized = false;
      throw error;
    }
  }

  async generateResponse(messages, onToken) {
    if (!this.initialized) {
      throw new Error('No model loaded');
    }

    console.log('=== generateResponse ===');

    const { LlamaChatSession } = await import('node-llama-cpp');

    // Create a fresh session for each request
    const sequence = this.context.getSequence();

    if (!sequence) {
      throw new Error('Failed to get context sequence');
    }

    const systemPrompt =
      messages.find((m) => m.role === 'system')?.content ||
      'You are a helpful AI assistant. Keep answers concise and clear.';

    const session = new LlamaChatSession({ contextSequence: sequence, systemPrompt: systemPrompt });

    this.generating = true;
    const conversationMessages = messages.filter((m) => m.role !== 'system');

    try {
      // Build conversation history
      for (let i = 0; i < conversationMessages.length - 1; i++) {
        const msg = conversationMessages[i];
        await session.prompt(msg.content, { temperature: 0.7, maxTokens: 1024 });
      }

      // Generate response for the last message
      const lastMessage = conversationMessages[conversationMessages.length - 1];
      console.log(`Generating for: "${lastMessage.content.slice(0, 80)}..."`);

      const response = await session.prompt(lastMessage.content, {
        temperature: 0.7,
        maxTokens: 1024,
      });

      this.generating = false;
      console.log(`Response: ${response.length} chars`);

      // Send full response
      if (onToken) {
        onToken(response);
      }

      return response;
    } catch (error) {
      console.error('Generation error:', error.message);
      this.generating = false;
      throw error;
    }
  }

  stopGeneration() {
    console.log('Stopping generation...');
    this.generating = false;
  }

  static getAvailableModels() {
    const modelsDir = path.join(app.getPath('userData'), 'models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
      return [];
    }

    try {
      return fs
        .readdirSync(modelsDir)
        .filter((f) => f.endsWith('.gguf'))
        .map((f) => {
          const fullPath = path.join(modelsDir, f);
          return { name: f.replace('.gguf', ''), path: fullPath, size: fs.statSync(fullPath).size };
        });
    } catch (error) {
      return [];
    }
  }

  static getRecommendedModels() {
    return [
      {
        name: 'Llama-3.2-1B-Instruct',
        size: '~1GB',
        url: 'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf',
        description: 'Tiny - Works on 2GB VRAM',
      },
      {
        name: 'Qwen2.5-1.5B-Instruct',
        size: '~1GB',
        url: 'https://huggingface.co/bartowski/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/Qwen2.5-1.5B-Instruct-Q4_K_M.gguf',
        description: 'Small but capable',
      },
      {
        name: 'Llama-3.2-3B-Instruct',
        size: '~2GB',
        url: 'https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf',
        description: 'Needs 4GB+ VRAM',
      },
    ];
  }
}

module.exports = LLMService;
