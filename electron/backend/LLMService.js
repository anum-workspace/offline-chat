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

    const modelSize = fs.statSync(modelPath).size;
    const modelSizeGB = modelSize / 1e9;
    console.log(`Model size: ${modelSizeGB.toFixed(2)} GB`);

    // Smart defaults based on model size
    let contextSize = options.contextSize || 4096;
    const threads = options.threads || 4;

    // For Q8_0 models (< 1GB), use smaller context
    if (modelSizeGB < 1.5) {
      contextSize = Math.min(contextSize, 2048);
    }

    console.log(`Config: context=${contextSize}, threads=${threads}`);

    // Try configurations from smallest to largest
    const configs = [
      { contextSize, sequences: 1, batchSize: 256 },
      { contextSize: Math.floor(contextSize / 2), sequences: 1, batchSize: 256 },
      { contextSize: 1024, sequences: 1, batchSize: 128 },
    ];

    let lastError = null;

    for (const config of configs) {
      try {
        console.log(`Trying: context=${config.contextSize}, sequences=${config.sequences}`);

        const { getLlama } = await import('node-llama-cpp');

        if (!this.llama) {
          this.llama = await getLlama({ gpu: 'auto' });
        }

        if (!this.model) {
          console.log('Loading model...');
          this.model = await this.llama.loadModel({ modelPath: modelPath, gpuLayers: 'auto' });
        }

        console.log('Creating context...');
        this.context = await this.model.createContext({
          contextSize: config.contextSize,
          threads: threads,
          batchSize: config.batchSize,
          sequences: config.sequences,
        });

        this.modelName = path.basename(modelPath, '.gguf');
        this.modelPath = modelPath;
        this.initialized = true;

        console.log('✓ Model ready');
        console.log(`  Name: ${this.modelName}`);
        console.log(`  Context: ${config.contextSize}`);
        console.log(`  Sequences: ${config.sequences}`);
        console.log(`  Threads: ${threads}`);
        return true;
      } catch (error) {
        console.log(`  Failed: ${error.message}`);
        lastError = error;

        if (error.message.includes('VRAM') || error.message.includes('too large')) {
          continue; // Try next smaller config
        }
        throw error; // Different error, don't retry
      }
    }

    // All configs failed
    throw new Error(
      `Cannot load model: ${lastError?.message || 'Unknown error'}. Try a smaller model or lower context size.`,
    );
  }

  async generateResponse(messages, onToken) {
    if (!this.initialized) {
      throw new Error('No model loaded');
    }

    console.log('=== generateResponse ===');

    const { LlamaChatSession } = await import('node-llama-cpp');

    // Get a fresh sequence
    let sequence;
    try {
      sequence = this.context.getSequence();
    } catch (e) {
      console.log('No sequences left, recreating context with same size...');

      // Recreate context with same settings
      const contextSize = this.context?.contextSize || 2048;

      this.context = await this.model.createContext({
        contextSize: contextSize,
        threads: 4,
        batchSize: 256,
        sequences: 1, // Use single sequence for reliability
      });

      sequence = this.context.getSequence();
    }

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
      // Load conversation history
      for (let i = 0; i < conversationMessages.length - 1; i++) {
        const msg = conversationMessages[i];
        await session.prompt(msg.content, {
          temperature: 0.7,
          maxTokens: 128, // Even smaller for history
        });
      }

      // Generate response
      const lastMessage = conversationMessages[conversationMessages.length - 1];
      const preview = lastMessage.content.slice(0, 80);
      console.log(`Prompt: "${preview}${lastMessage.content.length > 80 ? '...' : ''}"`);

      const response = await session.prompt(lastMessage.content, {
        temperature: 0.7,
        maxTokens: 1024, // Smaller max tokens for small models
      });

      this.generating = false;
      console.log(`Response: ${response.length} chars`);
      console.log(`Preview: "${response.slice(0, 100)}${response.length > 100 ? '...' : ''}"`);

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
    } catch {
      return [];
    }
  }

  static getRecommendedModels() {
    return [
      {
        name: 'Qwen2.5-0.5B-Instruct',
        size: '~0.4GB',
        url: 'https://huggingface.co/bartowski/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/Qwen2.5-0.5B-Instruct-Q4_K_M.gguf',
        description: 'Ultra-tiny - Works on any GPU',
      },
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
        description: 'Small but capable - Use Q4_K_M for lower VRAM',
      },
      {
        name: 'Llama-3.2-3B-Instruct',
        size: '~2GB',
        url: 'https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf',
        description: 'Great quality - Use Q4_K_M quantization',
      },
    ];
  }
}

module.exports = LLMService;
