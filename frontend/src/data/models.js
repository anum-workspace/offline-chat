export const RECOMMENDED_MODELS = [
  // ============================================
  // META LLAMA MODELS
  // ============================================
  {
    name: 'Llama-3.2-1B-Instruct',
    size: '~1GB',
    type: 'chat',
    contextSize: 8192,
    url: 'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf',
    description: 'Meta Llama 3.2 - Smallest Llama model. Great for low-end PCs',
    stars: 4,
    family: 'Llama',
    parameters: '1B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Llama-3.2-3B-Instruct',
    size: '~2GB',
    type: 'chat',
    contextSize: 8192,
    url: 'https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf',
    description: 'Meta Llama 3.2 - Best overall chat model for 4GB+ VRAM',
    stars: 5,
    family: 'Llama',
    parameters: '3B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Llama-3.1-8B-Instruct',
    size: '~5GB',
    type: 'chat',
    contextSize: 8192,
    url: 'https://huggingface.co/bartowski/Llama-3.1-8B-Instruct-GGUF/resolve/main/Llama-3.1-8B-Instruct-Q4_K_M.gguf',
    description: 'Meta Llama 3.1 - 8B parameter, excellent quality',
    stars: 5,
    family: 'Llama',
    parameters: '8B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Llama-2-7B-Chat',
    size: '~4GB',
    type: 'chat',
    contextSize: 4096,
    url: 'https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf',
    description: 'Meta Llama 2 - Stable, well-tested 7B chat model',
    stars: 4,
    family: 'Llama',
    parameters: '7B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Llama-2-13B-Chat',
    size: '~8GB',
    type: 'chat',
    contextSize: 4096,
    url: 'https://huggingface.co/TheBloke/Llama-2-13B-Chat-GGUF/resolve/main/llama-2-13b-chat.Q4_K_M.gguf',
    description: 'Meta Llama 2 - Powerful 13B for high-end systems',
    stars: 5,
    family: 'Llama',
    parameters: '13B',
    quantization: 'Q4_K_M',
  },

  // ============================================
  // QWEN MODELS (Alibaba)
  // ============================================
  {
    name: 'Qwen2.5-0.5B-Instruct',
    size: '~0.4GB',
    type: 'chat',
    contextSize: 32768,
    url: 'https://huggingface.co/bartowski/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/Qwen2.5-0.5B-Instruct-Q4_K_M.gguf',
    description: 'Alibaba Qwen 2.5 - Ultra-tiny, works on any GPU',
    stars: 3,
    family: 'Qwen',
    parameters: '0.5B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Qwen2.5-1.5B-Instruct',
    size: '~1GB',
    type: 'chat',
    contextSize: 32768,
    url: 'https://huggingface.co/bartowski/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/Qwen2.5-1.5B-Instruct-Q4_K_M.gguf',
    description: 'Alibaba Qwen 2.5 - Small but very capable',
    stars: 4,
    family: 'Qwen',
    parameters: '1.5B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Qwen2.5-3B-Instruct',
    size: '~2GB',
    type: 'chat',
    contextSize: 32768,
    url: 'https://huggingface.co/bartowski/Qwen2.5-3B-Instruct-GGUF/resolve/main/Qwen2.5-3B-Instruct-Q4_K_M.gguf',
    description: 'Alibaba Qwen 2.5 - Great 3B model with huge context',
    stars: 4,
    family: 'Qwen',
    parameters: '3B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Qwen2.5-7B-Instruct',
    size: '~5GB',
    type: 'chat',
    contextSize: 32768,
    url: 'https://huggingface.co/bartowski/Qwen2.5-7B-Instruct-GGUF/resolve/main/Qwen2.5-7B-Instruct-Q4_K_M.gguf',
    description: 'Alibaba Qwen 2.5 - Excellent 7B reasoning model',
    stars: 5,
    family: 'Qwen',
    parameters: '7B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Qwen2.5-14B-Instruct',
    size: '~9GB',
    type: 'chat',
    contextSize: 32768,
    url: 'https://huggingface.co/bartowski/Qwen2.5-14B-Instruct-GGUF/resolve/main/Qwen2.5-14B-Instruct-Q4_K_M.gguf',
    description: 'Alibaba Qwen 2.5 - Powerful 14B for high-end systems',
    stars: 5,
    family: 'Qwen',
    parameters: '14B',
    quantization: 'Q4_K_M',
  },

  // ============================================
  // QWEN CODER MODELS
  // ============================================
  {
    name: 'Qwen2.5-Coder-1.5B-Instruct',
    size: '~1GB',
    type: 'code',
    contextSize: 32768,
    url: 'https://huggingface.co/bartowski/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/Qwen2.5-Coder-1.5B-Instruct-Q4_K_M.gguf',
    description: 'Qwen 2.5 Coder - Small code specialist',
    stars: 4,
    family: 'Qwen',
    parameters: '1.5B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Qwen2.5-Coder-7B-Instruct',
    size: '~5GB',
    type: 'code',
    contextSize: 32768,
    url: 'https://huggingface.co/bartowski/Qwen2.5-Coder-7B-Instruct-GGUF/resolve/main/Qwen2.5-Coder-7B-Instruct-Q4_K_M.gguf',
    description: 'Qwen 2.5 Coder - Best open-source code model',
    stars: 5,
    family: 'Qwen',
    parameters: '7B',
    quantization: 'Q4_K_M',
  },

  // ============================================
  // DEEPSEEK MODELS
  // ============================================
  {
    name: 'DeepSeek-R1-Distill-Qwen-1.5B',
    size: '~1GB',
    type: 'reasoning',
    contextSize: 32768,
    url: 'https://huggingface.co/bartowski/DeepSeek-R1-Distill-Qwen-1.5B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-1.5B-Q4_K_M.gguf',
    description: 'DeepSeek R1 - Small reasoning model with chain-of-thought',
    stars: 4,
    family: 'DeepSeek',
    parameters: '1.5B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'DeepSeek-R1-Distill-Qwen-7B',
    size: '~5GB',
    type: 'reasoning',
    contextSize: 32768,
    url: 'https://huggingface.co/bartowski/DeepSeek-R1-Distill-Qwen-7B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-7B-Q4_K_M.gguf',
    description: 'DeepSeek R1 - Advanced reasoning with chain-of-thought',
    stars: 5,
    family: 'DeepSeek',
    parameters: '7B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'DeepSeek-R1-Distill-Llama-8B',
    size: '~5GB',
    type: 'reasoning',
    contextSize: 32768,
    url: 'https://huggingface.co/bartowski/DeepSeek-R1-Distill-Llama-8B-GGUF/resolve/main/DeepSeek-R1-Distill-Llama-8B-Q4_K_M.gguf',
    description: 'DeepSeek R1 - 8B reasoning on Llama architecture',
    stars: 5,
    family: 'DeepSeek',
    parameters: '8B',
    quantization: 'Q4_K_M',
  },

  // ============================================
  // MISTRAL MODELS
  // ============================================
  {
    name: 'Mistral-7B-Instruct-v0.3',
    size: '~5GB',
    type: 'chat',
    contextSize: 32768,
    url: 'https://huggingface.co/MaziyarPanahi/Mistral-7B-Instruct-v0.3-GGUF/resolve/main/Mistral-7B-Instruct-v0.3.Q4_K_M.gguf',
    description: 'Mistral 7B - Fast, efficient, and reliable',
    stars: 5,
    family: 'Mistral',
    parameters: '7B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Mistral-Nemo-12B-Instruct',
    size: '~8GB',
    type: 'chat',
    contextSize: 32768,
    url: 'https://huggingface.co/bartowski/Mistral-Nemo-Instruct-2407-GGUF/resolve/main/Mistral-Nemo-Instruct-2407-Q4_K_M.gguf',
    description: 'Mistral Nemo - 12B model with excellent multilingual support',
    stars: 5,
    family: 'Mistral',
    parameters: '12B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Mistral-Small-22B-Instruct',
    size: '~13GB',
    type: 'chat',
    contextSize: 32768,
    url: 'https://huggingface.co/bartowski/Mistral-Small-Instruct-2409-GGUF/resolve/main/Mistral-Small-Instruct-2409-Q4_K_M.gguf',
    description: 'Mistral Small - Powerful 22B for high-end systems',
    stars: 5,
    family: 'Mistral',
    parameters: '22B',
    quantization: 'Q4_K_M',
  },

  // ============================================
  // HERMES MODELS (Nous Research)
  // ============================================
  {
    name: 'Hermes-2-Pro-Mistral-7B',
    size: '~5GB',
    type: 'chat',
    contextSize: 32768,
    url: 'https://huggingface.co/bartowski/Hermes-2-Pro-Mistral-7B-GGUF/resolve/main/Hermes-2-Pro-Mistral-7B-Q4_K_M.gguf',
    description: 'Nous Hermes 2 Pro - Clean, detailed outputs',
    stars: 4,
    family: 'Hermes',
    parameters: '7B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Hermes-3-Llama-3.1-8B',
    size: '~5GB',
    type: 'chat',
    contextSize: 8192,
    url: 'https://huggingface.co/bartowski/Hermes-3-Llama-3.1-8B-GGUF/resolve/main/Hermes-3-Llama-3.1-8B-Q4_K_M.gguf',
    description: 'Nous Hermes 3 - Latest on Llama 3.1 architecture',
    stars: 4,
    family: 'Hermes',
    parameters: '8B',
    quantization: 'Q4_K_M',
  },

  // ============================================
  // MICROSOFT PHI MODELS
  // ============================================
  {
    name: 'Phi-3-mini-4k-Instruct',
    size: '~2GB',
    type: 'chat',
    contextSize: 4096,
    url: 'https://huggingface.co/bartowski/Phi-3-mini-4k-instruct-GGUF/resolve/main/Phi-3-mini-4k-instruct-Q4_K_M.gguf',
    description: 'Microsoft Phi-3 Mini - Small but surprisingly powerful',
    stars: 4,
    family: 'Phi',
    parameters: '3.8B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Phi-3.5-mini-Instruct',
    size: '~2GB',
    type: 'chat',
    contextSize: 4096,
    url: 'https://huggingface.co/bartowski/Phi-3.5-mini-instruct-GGUF/resolve/main/Phi-3.5-mini-instruct-Q4_K_M.gguf',
    description: 'Microsoft Phi-3.5 - Improved mini model',
    stars: 4,
    family: 'Phi',
    parameters: '3.8B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Phi-3-medium-4k-Instruct',
    size: '~8GB',
    type: 'chat',
    contextSize: 4096,
    url: 'https://huggingface.co/bartowski/Phi-3-medium-4k-instruct-GGUF/resolve/main/Phi-3-medium-4k-instruct-Q4_K_M.gguf',
    description: 'Microsoft Phi-3 Medium - 14B quality in smaller package',
    stars: 4,
    family: 'Phi',
    parameters: '14B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Phi-4-mini-Instruct',
    size: '~3GB',
    type: 'chat',
    contextSize: 4096,
    url: 'https://huggingface.co/bartowski/Phi-4-mini-instruct-GGUF/resolve/main/Phi-4-mini-instruct-Q4_K_M.gguf',
    description: 'Microsoft Phi-4 Mini - Latest generation small model',
    stars: 4,
    family: 'Phi',
    parameters: '3.8B',
    quantization: 'Q4_K_M',
  },

  // ============================================
  // GOOGLE GEMMA MODELS
  // ============================================
  {
    name: 'Gemma-2-2B-it',
    size: '~2GB',
    type: 'chat',
    contextSize: 8192,
    url: 'https://huggingface.co/bartowski/gemma-2-2b-it-GGUF/resolve/main/gemma-2-2b-it-Q4_K_M.gguf',
    description: 'Google Gemma 2 - Small 2B model from Google',
    stars: 4,
    family: 'Gemma',
    parameters: '2B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Gemma-2-9B-it',
    size: '~6GB',
    type: 'chat',
    contextSize: 8192,
    url: 'https://huggingface.co/bartowski/gemma-2-9b-it-GGUF/resolve/main/gemma-2-9b-it-Q4_K_M.gguf',
    description: 'Google Gemma 2 - Powerful 9B model',
    stars: 5,
    family: 'Gemma',
    parameters: '9B',
    quantization: 'Q4_K_M',
  },

  // ============================================
  // CODE SPECIALIST MODELS
  // ============================================
  {
    name: 'CodeQwen1.5-7B-Chat',
    size: '~5GB',
    type: 'code',
    contextSize: 32768,
    url: 'https://huggingface.co/bartowski/CodeQwen1.5-7B-Chat-GGUF/resolve/main/CodeQwen1.5-7B-Chat-Q4_K_M.gguf',
    description: 'CodeQwen 1.5 - Specialized for code generation',
    stars: 4,
    family: 'Qwen',
    parameters: '7B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'DeepSeek-Coder-V2-Lite-Instruct',
    size: '~9GB',
    type: 'code',
    contextSize: 16384,
    url: 'https://huggingface.co/bartowski/DeepSeek-Coder-V2-Lite-Instruct-GGUF/resolve/main/DeepSeek-Coder-V2-Lite-Instruct-Q4_K_M.gguf',
    description: 'DeepSeek Coder V2 - Advanced code generation',
    stars: 5,
    family: 'DeepSeek',
    parameters: '16B',
    quantization: 'Q4_K_M',
  },

  // ============================================
  // OPENCHAT / OTHER POPULAR MODELS
  // ============================================
  {
    name: 'OpenChat-3.5-7B',
    size: '~5GB',
    type: 'chat',
    contextSize: 8192,
    url: 'https://huggingface.co/bartowski/openchat-3.5-7B-GGUF/resolve/main/openchat-3.5-7B-Q4_K_M.gguf',
    description: 'OpenChat 3.5 - Well-rounded 7B chat model',
    stars: 4,
    family: 'OpenChat',
    parameters: '7B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Zephyr-7B-Beta',
    size: '~5GB',
    type: 'chat',
    contextSize: 8192,
    url: 'https://huggingface.co/TheBloke/zephyr-7B-beta-GGUF/resolve/main/zephyr-7b-beta.Q4_K_M.gguf',
    description: 'Zephyr 7B - Fine-tuned Mistral with great instruction following',
    stars: 4,
    family: 'Mistral',
    parameters: '7B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Starling-LM-7B-Beta',
    size: '~5GB',
    type: 'chat',
    contextSize: 8192,
    url: 'https://huggingface.co/bartowski/Starling-LM-7B-beta-GGUF/resolve/main/Starling-LM-7B-beta-Q4_K_M.gguf',
    description: 'Starling LM - Optimized for helpful, harmless responses',
    stars: 4,
    family: 'Mistral',
    parameters: '7B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Dolphin-2.9.1-Mistral-7B',
    size: '~5GB',
    type: 'chat',
    contextSize: 8192,
    url: 'https://huggingface.co/TheBloke/dolphin-2.9.1-mistral-7B-GGUF/resolve/main/dolphin-2.9.1-mistral-7b.Q4_K_M.gguf',
    description: 'Dolphin - Uncensored Mistral fine-tune',
    stars: 3,
    family: 'Mistral',
    parameters: '7B',
    quantization: 'Q4_K_M',
  },

  // ============================================
  // TINY / SPECIAL PURPOSE MODELS
  // ============================================
  {
    name: 'TinyLlama-1.1B-Chat',
    size: '~0.7GB',
    type: 'chat',
    contextSize: 2048,
    url: 'https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf',
    description: 'TinyLlama - Very small, runs on anything',
    stars: 3,
    family: 'Llama',
    parameters: '1.1B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'SmolLM2-1.7B-Instruct',
    size: '~1GB',
    type: 'chat',
    contextSize: 2048,
    url: 'https://huggingface.co/bartowski/SmolLM2-1.7B-Instruct-GGUF/resolve/main/SmolLM2-1.7B-Instruct-Q4_K_M.gguf',
    description: 'SmolLM2 - Tiny but effective instruction model',
    stars: 3,
    family: 'SmolLM',
    parameters: '1.7B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Qwen2.5-0.5B-Math',
    size: '~0.4GB',
    type: 'reasoning',
    contextSize: 32768,
    url: 'https://huggingface.co/bartowski/Qwen2.5-Math-0.5B-GGUF/resolve/main/Qwen2.5-Math-0.5B-Q4_K_M.gguf',
    description: 'Qwen 2.5 Math - Tiny math specialist',
    stars: 3,
    family: 'Qwen',
    parameters: '0.5B',
    quantization: 'Q4_K_M',
  },

  // ============================================
  // CHINESE / MULTILINGUAL MODELS
  // ============================================
  {
    name: 'Yi-1.5-6B-Chat',
    size: '~4GB',
    type: 'chat',
    contextSize: 4096,
    url: 'https://huggingface.co/bartowski/Yi-1.5-6B-Chat-GGUF/resolve/main/Yi-1.5-6B-Chat-Q4_K_M.gguf',
    description: '01.AI Yi 1.5 - Strong bilingual (EN/CN) model',
    stars: 4,
    family: 'Yi',
    parameters: '6B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'Yi-1.5-9B-Chat',
    size: '~6GB',
    type: 'chat',
    contextSize: 4096,
    url: 'https://huggingface.co/bartowski/Yi-1.5-9B-Chat-GGUF/resolve/main/Yi-1.5-9B-Chat-Q4_K_M.gguf',
    description: '01.AI Yi 1.5 - Powerful 9B bilingual model',
    stars: 4,
    family: 'Yi',
    parameters: '9B',
    quantization: 'Q4_K_M',
  },
  {
    name: 'InternLM2-Chat-7B',
    size: '~5GB',
    type: 'chat',
    contextSize: 32768,
    url: 'https://huggingface.co/bartowski/internlm2-chat-7b-GGUF/resolve/main/internlm2-chat-7b-Q4_K_M.gguf',
    description: 'InternLM2 - Strong multilingual capabilities',
    stars: 4,
    family: 'InternLM',
    parameters: '7B',
    quantization: 'Q4_K_M',
  },
];

// Filter helpers
export const MODEL_FAMILIES = [...new Set(RECOMMENDED_MODELS.map((m) => m.family))];
export const MODEL_TYPES = [...new Set(RECOMMENDED_MODELS.map((m) => m.type))];
export const MODEL_SIZES = [
  '0.5B',
  '1B',
  '1.5B',
  '2B',
  '3B',
  '7B',
  '8B',
  '9B',
  '12B',
  '13B',
  '14B',
  '16B',
  '22B',
];

export function filterModels(models, { search, type, family, size, stars }) {
  return models.filter((m) => {
    if (
      search &&
      !m.name.toLowerCase().includes(search.toLowerCase()) &&
      !m.description.toLowerCase().includes(search.toLowerCase()) &&
      !m.family.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    if (type && type !== 'all' && m.type !== type) return false;
    if (family && family !== 'all' && m.family !== family) return false;
    if (size && size !== 'all' && m.parameters !== size) return false;
    if (stars && m.stars < stars) return false;
    return true;
  });
}
