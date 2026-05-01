import { useState, useEffect } from "react";
import {
  VscLibrary,
  VscFolderOpened,
  VscCheck,
  VscLoading,
  VscTrash,
  VscSearch,
  VscChip,
  VscStarEmpty,
  VscStarFull,
  VscArrowCircleDown,
} from "react-icons/vsc";
import { useAppContext } from "@context/AppContext";

const RECOMMENDED_MODELS = [
  {
    name: "Llama-3.2-3B-Instruct",
    size: "~3GB",
    type: "chat",
    contextSize: 8192,
    url: "https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf",
    description: "Meta Llama 3.2 - Best overall chat model",
    stars: 5,
  },
  {
    name: "Qwen2.5-7B-Instruct",
    size: "~5GB",
    type: "chat",
    contextSize: 32768,
    url: "https://huggingface.co/bartowski/Qwen2.5-7B-Instruct-GGUF/resolve/main/Qwen2.5-7B-Instruct-Q4_K_M.gguf",
    description: "Alibaba Qwen 2.5 - Excellent reasoning",
    stars: 5,
  },
  {
    name: "DeepSeek-R1-Distill-Qwen-7B",
    size: "~5GB",
    type: "reasoning",
    contextSize: 32768,
    url: "https://huggingface.co/bartowski/DeepSeek-R1-Distill-Qwen-7B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-7B-Q4_K_M.gguf",
    description: "DeepSeek R1 - Advanced chain-of-thought reasoning",
    stars: 4,
  },
  {
    name: "Mistral-7B-Instruct-v0.3",
    size: "~5GB",
    type: "chat",
    contextSize: 32768,
    url: "https://huggingface.co/MaziyarPanahi/Mistral-7B-Instruct-v0.3-GGUF/resolve/main/Mistral-7B-Instruct-v0.3.Q4_K_M.gguf",
    description: "Mistral 7B - Fast and efficient",
    stars: 4,
  },
  {
    name: "Phi-3.5-mini-instruct",
    size: "~3GB",
    type: "chat",
    contextSize: 4096,
    url: "https://huggingface.co/bartowski/Phi-3.5-mini-instruct-GGUF/resolve/main/Phi-3.5-mini-instruct-Q4_K_M.gguf",
    description: "Microsoft Phi 3.5 - Small but powerful",
    stars: 4,
  },
  {
    name: "Gemma-2-9B-it",
    size: "~7GB",
    type: "chat",
    contextSize: 8192,
    url: "https://huggingface.co/bartowski/gemma-2-9b-it-GGUF/resolve/main/gemma-2-9b-it-Q4_K_M.gguf",
    description: "Google Gemma 2 - 9B parameter model",
    stars: 3,
  },
  {
    name: "CodeQwen1.5-7B-Chat",
    size: "~5GB",
    type: "code",
    contextSize: 32768,
    url: "https://huggingface.co/bartowski/CodeQwen1.5-7B-Chat-GGUF/resolve/main/CodeQwen1.5-7B-Chat-Q4_K_M.gguf",
    description: "Specialized for code generation",
    stars: 4,
  },
  {
    name: "Qwen2.5-Coder-7B-Instruct",
    size: "~5GB",
    type: "code",
    contextSize: 32768,
    url: "https://huggingface.co/bartowski/Qwen2.5-Coder-7B-Instruct-GGUF/resolve/main/Qwen2.5-Coder-7B-Instruct-Q4_K_M.gguf",
    description: "Qwen 2.5 Coder - Best code model",
    stars: 5,
  },
  {
    name: "Llama-3.2-1B-Instruct",
    size: "~1GB",
    type: "chat",
    contextSize: 8192,
    url: "https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf",
    description: "Tiny Llama 3.2 - For low-end PCs",
    stars: 3,
  },
  {
    name: "Hermes-2-Pro-Mistral-7B",
    size: "~5GB",
    type: "chat",
    contextSize: 32768,
    url: "https://huggingface.co/bartowski/Hermes-2-Pro-Mistral-7B-GGUF/resolve/main/Hermes-2-Pro-Mistral-7B-Q4_K_M.gguf",
    description: "Nous Hermes 2 - Clean outputs",
    stars: 4,
  },
  {
    name: "OpenHermes-2.5-Mistral-7B",
    size: "~5GB",
    type: "chat",
    contextSize: 32768,
    url: "https://huggingface.co/bartowski/OpenHermes-2.5-Mistral-7B-GGUF/resolve/main/OpenHermes-2.5-Mistral-7B-Q4_K_M.gguf",
    description: "OpenHermes 2.5 - Great instruction following",
    stars: 4,
  },
];

export default function ModelsPage() {
  const { modelStatus, checkModelStatus } = useAppContext();
  const [installedModels, setInstalledModels] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | chat | code | reasoning
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setInstalledModels(await window.api.getModels());
    } catch (e) {}
  };

  const handleLoadModel = async (path) => {
    setLoading(true);
    const result = await window.api.loadModel(path);
    if (result?.success) checkModelStatus();
    setLoading(false);
  };

  const handleOpenFolder = () => {
    window.api.openModelsFolder();
    setTimeout(loadModels, 1500);
  };

  const filteredModels = RECOMMENDED_MODELS.filter((m) => {
    if (filter !== "all" && m.type !== filter) return false;
    if (
      search &&
      !m.name.toLowerCase().includes(search.toLowerCase()) &&
      !m.description.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const isInstalled = (name) => installedModels.some((m) => m.name === name);
  const isLoaded = (name) => modelStatus?.modelName === name;

  return (
    <div className="w-full px-6 lg:px-40 py-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Models</h1>
        <button
          onClick={handleOpenFolder}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
        >
          <VscFolderOpened className="w-5 h-5" /> Open Models Folder
        </button>
      </div>

      {/* Installed Models */}
      {installedModels.length > 0 && (
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">Installed Models</h2>
          <div className="space-y-2">
            {installedModels.map((m) => (
              <div
                key={m.path}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <VscLibrary className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-300 truncate">{m.name}</p>
                    <p className="text-xs text-gray-500">{(m.size / 1e9).toFixed(1)} GB</p>
                  </div>
                </div>
                <button
                  onClick={() => handleLoadModel(m.path)}
                  disabled={isLoaded(m.name) || loading}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${isLoaded(m.name) ? "bg-green-900/30 text-green-400 border border-green-800" : "bg-indigo-900/30 text-indigo-400 hover:bg-indigo-900/50 border border-indigo-800"}`}
                >
                  {isLoaded(m.name) ? "✓ Loaded" : loading ? "Loading..." : "Load"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Models */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-300">Recommended Models</h2>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-800 rounded-lg p-0.5">
              {["all", "chat", "code", "reasoning"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-[11px] rounded transition-colors capitalize ${filter === f ? "bg-gray-700 text-gray-200" : "text-gray-400 hover:text-gray-300"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative">
              <VscSearch className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search models..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-7 pr-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 w-48"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredModels.map((model) => (
            <div
              key={model.name}
              className={`p-4 rounded-lg border transition-colors ${isLoaded(model.name) ? "bg-green-900/10 border-green-800" : isInstalled(model.name) ? "bg-indigo-900/10 border-indigo-800" : "bg-gray-800 border-gray-700 hover:border-gray-600"}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-gray-200 truncate">{model.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-700 rounded text-gray-400 uppercase">
                      {model.type}
                    </span>
                    <span className="text-xs text-gray-500">{model.size}</span>
                    <span className="text-xs text-gray-500">{model.contextSize} ctx</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(model.stars)].map((_, i) => (
                    <VscStarFull key={i} className="w-3 h-3 text-yellow-500" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3">{model.description}</p>
              <div className="flex items-center gap-2">
                <a
                  href={model.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
                >
                  <VscArrowCircleDown className="w-3.5 h-3.5" /> Download
                </a>
                {isInstalled(model.name) && (
                  <button
                    onClick={() => {
                      const installed = installedModels.find((m) => m.name === model.name);
                      if (installed) handleLoadModel(installed.path);
                    }}
                    disabled={isLoaded(model.name)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${isLoaded(model.name) ? "text-green-400" : "text-indigo-400 hover:text-indigo-300"}`}
                  >
                    {isLoaded(model.name) ? <VscCheck className="w-5 h-5" /> : "Load"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
