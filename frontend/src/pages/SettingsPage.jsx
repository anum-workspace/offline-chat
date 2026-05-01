import { useState, useEffect } from "react";
import {
  VscSettings,
  VscSave,
  VscRefresh,
  VscChip,
  VscFolderOpened,
  VscTrash,
  VscAdd,
  VscCheck,
  VscLoading,
} from "react-icons/vsc";
import { useAppContext } from "@context/AppContext";

export default function SettingsPage() {
  const { modelStatus, checkModelStatus } = useAppContext();
  const [settings, setSettings] = useState({
    temperature: 0.7,
    maxTokens: 2048,
    contextSize: 4096, // Default to 4096
    systemPrompt: "",
    autoLoadModel: false,
    lastModelPath: "",
    threads: 4, // Add threads setting
  });
  const [saved, setSaved] = useState(false);
  const [installedModels, setInstalledModels] = useState([]);
  const [loadingModel, setLoadingModel] = useState(false);

  useEffect(() => {
    loadSettings();
    loadModels();
  }, []);

  const loadSettings = async () => {
    try {
      const s = await window.api.getSettings();
      if (s) setSettings(s);
    } catch (e) {}
  };

  const loadModels = async () => {
    try {
      setInstalledModels(await window.api.getModels());
    } catch (e) {}
  };

  const handleSave = async () => {
    await window.api.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSelectModel = async () => {
    const result = await window.api.selectModelFile();
    if (result) {
      setLoadingModel(true);
      const loadResult = await window.api.loadModel(result.path);
      if (loadResult?.success) {
        checkModelStatus();
        setSettings((prev) => ({ ...prev, lastModelPath: result.path }));
      }
      setLoadingModel(false);
      loadModels();
    }
  };

  const handleLoadInstalledModel = async (path) => {
    setLoadingModel(true);
    const result = await window.api.loadModel(path);
    if (result?.success) {
      checkModelStatus();
      setSettings((prev) => ({ ...prev, lastModelPath: path }));
    }
    setLoadingModel(false);
  };

  const handleUnloadModel = async () => {
    await window.api.unloadModel();
    checkModelStatus();
  };

  const handleOpenModelsFolder = () => {
    window.api.openModelsFolder();
    setTimeout(loadModels, 1500);
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    if (bytes > 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
    if (bytes > 1e6) return `${(bytes / 1e6).toFixed(0)} MB`;
    return `${(bytes / 1e3).toFixed(0)} KB`;
  };

  return (
    <div className="w-full px-6 lg:px-40 py-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Settings</h1>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            saved ? "bg-green-800 text-green-200" : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {saved ? (
            <>
              <VscCheck className="w-5 h-5" /> Saved
            </>
          ) : (
            <>
              <VscSave className="w-5 h-5" /> Save
            </>
          )}
        </button>
      </div>

      {/* Model Selection Section */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-5 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <VscChip className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-semibold text-gray-300">Model Selection</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Select the AI model to use for chat. Download GGUF models from HuggingFace.
        </p>

        {/* Current Model Status */}
        <div
          className={`p-3 rounded-lg border mb-3 ${
            modelStatus?.initialized
              ? "bg-green-900/10 border-green-800"
              : "bg-gray-800 border-gray-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <VscChip
                className={`w-5 h-5 ${modelStatus?.initialized ? "text-green-400" : "text-gray-500"}`}
              />
              <span
                className={`text-sm ${modelStatus?.initialized ? "text-green-300" : "text-gray-400"}`}
              >
                {modelStatus?.initialized
                  ? `✓ Loaded: ${modelStatus.modelName}`
                  : "No model loaded"}
              </span>
            </div>
            {modelStatus?.initialized && (
              <button
                onClick={handleUnloadModel}
                className="flex items-center gap-1 text-xs px-2 py-1 bg-red-900/20 text-red-400 hover:bg-red-900/30 rounded transition-colors"
              >
                <VscTrash className="w-3 h-3 inline mr-1" />
                Unload
              </button>
            )}
          </div>
        </div>

        {/* Model Actions */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={handleSelectModel}
            disabled={loadingModel}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-800 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {loadingModel ? (
              <VscLoading className="w-5 h-5 animate-spin" />
            ) : (
              <VscAdd className="w-5 h-5" />
            )}
            Add Model File
          </button>
          <button
            onClick={handleOpenModelsFolder}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
          >
            <VscFolderOpened className="w-5 h-5" />
            Models Folder
          </button>
        </div>

        {/* Installed Models List */}
        {installedModels.length > 0 && (
          <div>
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Installed Models
            </h3>
            <div className="space-y-1">
              {installedModels.map((m) => (
                <div
                  key={m.path}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                    modelStatus?.modelName === m.name
                      ? "bg-green-900/10 border-green-800"
                      : "bg-gray-800 border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <VscChip
                      className={`w-3.5 h-3.5 flex-shrink-0 ${modelStatus?.modelName === m.name ? "text-green-400" : "text-gray-500"}`}
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-300 truncate">{m.name}</p>
                      <p className="text-[10px] text-gray-600">{formatSize(m.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {modelStatus?.modelName === m.name ? (
                      <span className="text-[10px] px-2 py-0.5 bg-green-900/20 text-green-400 rounded">
                        Active
                      </span>
                    ) : (
                      <button
                        onClick={() => handleLoadInstalledModel(m.path)}
                        className="text-[10px] px-2 py-0.5 bg-indigo-900/20 text-indigo-400 hover:bg-indigo-900/30 rounded transition-colors"
                      >
                        Load
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generation Parameters */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">Generation Parameters</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-gray-400">Temperature</label>
              <span className="text-xs text-gray-500">{settings.temperature?.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature || 0.7}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, temperature: parseFloat(e.target.value) }))
              }
              className="w-full accent-indigo-500 h-2 rounded-lg appearance-none bg-gray-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-600 mt-1">
              <span>Precise (0)</span>
              <span>Balanced (1)</span>
              <span>Creative (2)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Max Tokens</label>
              <input
                type="number"
                value={settings.maxTokens || 2048}
                min={100}
                max={32768}
                step={100}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, maxTokens: parseInt(e.target.value) }))
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Context Size</label>
              <select
                value={settings.contextSize || 8192}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, contextSize: parseInt(e.target.value) }))
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="2048">2,048</option>
                <option value="4096">4,096</option>
                <option value="8192">8,192</option>
                <option value="16384">16,384</option>
                <option value="32768">32,768</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* System Prompt */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">System Prompt</h2>
        <textarea
          value={settings.systemPrompt || ""}
          onChange={(e) => setSettings((prev) => ({ ...prev, systemPrompt: e.target.value }))}
          placeholder="Custom system prompt (leave empty for default AI behavior)..."
          rows={4}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
        />
        <p className="text-[10px] text-gray-600 mt-1.5">
          The system prompt sets the behavior and personality of the AI assistant.
        </p>
      </div>

      {/* Auto-load */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-3">Preferences</h2>
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm text-gray-300">Auto-load last model</p>
            <p className="text-xs text-gray-500">
              Automatically load the previously used model on startup
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.autoLoadModel || false}
            onChange={(e) => setSettings((prev) => ({ ...prev, autoLoadModel: e.target.checked }))}
            className="w-9 h-5 bg-gray-700 rounded-full appearance-none cursor-pointer relative
                       checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5
                       after:bg-white after:w-5 after:h-5 after:rounded-full after:transition-transform
                       checked:after:translate-x-4"
          />
        </label>
      </div>
    </div>
  );
}
