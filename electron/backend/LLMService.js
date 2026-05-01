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
  }

  async initialize(modelPath, options = {}) {
    console.log('=== LLMService.initialize ===');
    console.log('Model:', path.basename(modelPath));

    if (this.initialized) {
      this.initialized = false;
    }

    if (!modelPath || !fs.existsSync(modelPath)) {
      throw new Error(`Model file not found: ${modelPath}`);
    }

    const contextSize = options.contextSize || 4096;
    const threads = options.threads || 4;

    console.log(`Config: context=${contextSize}, threads=${threads}`);

    try {
      const { getLlama } = await import('node-llama-cpp');

      this.llama = await getLlama({ gpu: 'auto' });

      console.log('Loading model...');
      this.model = await this.llama.loadModel({
        modelPath: modelPath,
        gpuLayers: 'auto',
      });

      console.log('Creating context...');
      this.context = await this.model.createContext({
        contextSize: contextSize,
        threads: threads,
        batchSize: 512,
        sequences: 2, // Create 2 sequences so we have a spare
      });

      this.modelName = path.basename(modelPath, '.gguf');
      this.modelPath = modelPath;
      this.initialized = true;

      console.log('✓ Model ready');
      console.log(`  Name: ${this.modelName}`);
      console.log(`  Context: ${contextSize}`);
      console.log(`  Threads: ${threads}`);
      return true;

    } catch (error) {
      console.error('Failed to initialize:', error.message);
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

    // Create a NEW context sequence for each generation
    let sequence;
    try {
      sequence = this.context.getSequence();
    } catch (e) {
      // If no sequences left, recreate the context
      console.log('No sequences left, recreating context...');
      
      const contextSize = this.context?.contextSize || 4096;
      
      this.context = await this.model.createContext({
        contextSize: contextSize,
        threads: 4,
        batchSize: 512,
        sequences: 2,
      });
      
      sequence = this.context.getSequence();
    }

    if (!sequence) {
      throw new Error('Failed to get context sequence');
    }

    const systemPrompt = messages.find(m => m.role === 'system')?.content ||
      'You are a helpful AI assistant. Keep answers concise and clear.';

    const session = new LlamaChatSession({
      contextSequence: sequence,
      systemPrompt: systemPrompt,
    });

    this.generating = true;
    const conversationMessages = messages.filter(m => m.role !== 'system');

    try {
      // Load conversation history
      for (let i = 0; i < conversationMessages.length - 1; i++) {
        const msg = conversationMessages[i];
        await session.prompt(msg.content, {
          temperature: 0.7,
          maxTokens: 256, // Smaller for history
        });
      }

      // Generate response for the last message
      const lastMessage = conversationMessages[conversationMessages.length - 1];
      const preview = lastMessage.content.slice(0, 80);
      console.log(`Prompt: "${preview}${lastMessage.content.length > 80 ? '...' : ''}"`);

      const response = await session.prompt(lastMessage.content, {
        temperature: 0.7,
        maxTokens: 2048,
      });

      this.generating = false;
      console.log(`Response: ${response.length} chars`);
      console.log(`Preview: "${response.slice(0, 100)}${response.length > 100 ? '...' : ''}"`);

      // Send to callback if streaming
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
      return fs.readdirSync(modelsDir)
        .filter(f => f.endsWith('.gguf'))
        .map(f => {
          const fullPath = path.join(modelsDir, f);
          return {
            name: f.replace('.gguf', ''),
            path: fullPath,
            size: fs.statSync(fullPath).size,
          };
        });
    } catch {
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
        description: 'Great balance of speed and quality',
      },
    ];
  }
}

module.exports = LLMService;