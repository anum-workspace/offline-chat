import { useState, useEffect } from 'react';
import {
  VscSettings,
  VscSave,
  VscCheck,
  VscFolderOpened,
  VscChip,
  VscTrash,
  VscAdd,
} from 'react-icons/vsc';
import { useAppContext } from '@context/AppContext';

export default function SettingsPage() {
  const { modelStatus, checkModelStatus } = useAppContext();
  const [settings, setSettings] = useState({
    temperature: 0.7,
    maxTokens: 2048,
    contextSize: 4096,
    threads: 4,
    systemPrompt: '',
    autoLoadModel: false,
    lastModelPath: '',
    modelsDirectory: '',
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

  const handleSelectModelsDirectory = async () => {
    const result = await window.api.selectModelsDirectory();
    if (result?.path) {
      setSettings((prev) => ({ ...prev, modelsDirectory: result.path }));
      await window.api.saveSettings({ modelsDirectory: result.path });
      loadModels();
    }
  };

  const handleSelectModelFile = async () => {
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

  const handleLoadModel = async (path) => {
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

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes > 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
    if (bytes > 1e6) return `${(bytes / 1e6).toFixed(0)} MB`;
    return `${(bytes / 1e3).toFixed(0)} KB`;
  };

  return (
    <div className='max-w-3xl mx-auto p-6 h-full overflow-y-auto'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-gray-100'>Settings</h1>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            saved ? 'bg-green-800 text-green-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {saved ? (
            <>
              <VscCheck className='w-4 h-4' /> Saved
            </>
          ) : (
            <>
              <VscSave className='w-4 h-4' /> Save
            </>
          )}
        </button>
      </div>

      {/* Models Directory */}
      <div className='bg-gray-900 rounded-lg border border-gray-800 p-5 mb-4'>
        <h2 className='text-sm font-semibold text-gray-300 mb-3'>Models Directory</h2>
        <p className='text-xs text-gray-500 mb-3'>
          Choose where your GGUF model files are stored. Models will be loaded directly from this
          folder.
        </p>
        <div className='flex gap-2 mb-3'>
          <button
            onClick={handleSelectModelsDirectory}
            className='flex items-center gap-2 px-4 py-2.5 bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-800 rounded-lg text-sm transition-colors'
          >
            <VscFolderOpened className='w-4 h-4' />
            Select Models Folder
          </button>
          <button
            onClick={() => window.api.openModelsFolder()}
            className='flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors'
          >
            <VscFolderOpened className='w-4 h-4' />
            Open Folder
          </button>
        </div>
        {settings.modelsDirectory && (
          <div className='p-3 bg-gray-800 rounded-lg'>
            <p className='text-xs text-gray-400'>Current location:</p>
            <p className='text-sm text-gray-300 truncate'>{settings.modelsDirectory}</p>
          </div>
        )}
      </div>

      {/* Model Selection */}
      <div className='bg-gray-900 rounded-lg border border-gray-800 p-5 mb-4'>
        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-sm font-semibold text-gray-300'>Model Selection</h2>
          <button
            onClick={handleSelectModelFile}
            disabled={loadingModel}
            className='flex items-center gap-1.5 px-3 py-1.5 bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-800 rounded text-xs transition-colors disabled:opacity-50'
          >
            <VscAdd className='w-3.5 h-3.5' />
            Browse for Model
          </button>
        </div>

        {/* Current Model */}
        <div
          className={`p-3 rounded-lg border mb-3 ${
            modelStatus?.initialized
              ? 'bg-green-900/10 border-green-800'
              : 'bg-gray-800 border-gray-700'
          }`}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <VscChip
                className={`w-4 h-4 ${modelStatus?.initialized ? 'text-green-400' : 'text-gray-500'}`}
              />
              <span
                className={`text-sm ${modelStatus?.initialized ? 'text-green-300' : 'text-gray-400'}`}
              >
                {modelStatus?.initialized ? `✓ ${modelStatus.modelName}` : 'No model loaded'}
              </span>
            </div>
            {modelStatus?.initialized && (
              <button
                onClick={handleUnloadModel}
                className='text-xs px-2 py-1 bg-red-900/20 text-red-400 hover:bg-red-900/30 rounded transition-colors'
              >
                <VscTrash className='w-3 h-3 inline mr-1' /> Unload
              </button>
            )}
          </div>
        </div>

        {/* Installed Models */}
        {installedModels.length > 0 && (
          <div>
            <h3 className='text-xs text-gray-500 uppercase tracking-wider mb-2'>
              Models in {settings.modelsDirectory ? 'selected folder' : 'default folder'}
            </h3>
            <div className='space-y-1 max-h-48 overflow-y-auto'>
              {installedModels.map((m) => (
                <div
                  key={m.path}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                    modelStatus?.modelPath === m.path
                      ? 'bg-green-900/10 border-green-800'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className='flex items-center gap-2 min-w-0'>
                    <VscChip
                      className={`w-3.5 h-3.5 flex-shrink-0 ${modelStatus?.modelPath === m.path ? 'text-green-400' : 'text-gray-500'}`}
                    />
                    <div className='min-w-0'>
                      <p className='text-xs text-gray-300 truncate'>{m.name}</p>
                      <p className='text-[10px] text-gray-600'>{formatSize(m.size)}</p>
                    </div>
                  </div>
                  {modelStatus?.modelPath === m.path ? (
                    <span className='text-[10px] px-2 py-0.5 bg-green-900/20 text-green-400 rounded'>
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={() => handleLoadModel(m.path)}
                      className='text-[10px] px-2 py-0.5 bg-indigo-900/20 text-indigo-400 hover:bg-indigo-900/30 rounded transition-colors'
                    >
                      Load
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generation Parameters */}
      <div className='bg-gray-900 rounded-lg border border-gray-800 p-5 mb-4'>
        <h2 className='text-sm font-semibold text-gray-300 mb-4'>Generation Parameters</h2>
        <div className='space-y-4'>
          <div>
            <div className='flex items-center justify-between mb-1.5'>
              <label className='text-xs text-gray-400'>Temperature</label>
              <span className='text-xs text-gray-500'>{settings.temperature?.toFixed(1)}</span>
            </div>
            <input
              type='range'
              min='0'
              max='2'
              step='0.1'
              value={settings.temperature || 0.7}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, temperature: parseFloat(e.target.value) }))
              }
              className='w-full accent-indigo-500'
            />
            <div className='flex justify-between text-[10px] text-gray-600 mt-1'>
              <span>Precise (0)</span>
              <span>Creative (2)</span>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div>
              <label className='block text-xs text-gray-400 mb-1.5'>Max Tokens</label>
              <input
                type='number'
                value={settings.maxTokens || 2048}
                min={100}
                max={8192}
                step={100}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, maxTokens: parseInt(e.target.value) }))
                }
                className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500'
              />
            </div>
            <div>
              <label className='block text-xs text-gray-400 mb-1.5'>Context Size</label>
              <select
                value={settings.contextSize || 4096}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, contextSize: parseInt(e.target.value) }))
                }
                className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500'
              >
                <option value='1024'>1,024</option>
                <option value='2048'>2,048</option>
                <option value='4096'>4,096</option>
                <option value='8192'>8,192</option>
              </select>
            </div>
            <div>
              <label className='block text-xs text-gray-400 mb-1.5'>CPU Threads</label>
              <select
                value={settings.threads || 4}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, threads: parseInt(e.target.value) }))
                }
                className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500'
              >
                <option value='2'>2</option>
                <option value='4'>4</option>
                <option value='6'>6</option>
                <option value='8'>8</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* System Prompt */}
      <div className='bg-gray-900 rounded-lg border border-gray-800 p-5 mb-4'>
        <h2 className='text-sm font-semibold text-gray-300 mb-4'>System Prompt</h2>
        <textarea
          value={settings.systemPrompt || ''}
          onChange={(e) => setSettings((prev) => ({ ...prev, systemPrompt: e.target.value }))}
          placeholder='Custom system prompt (leave empty for default)...'
          rows={4}
          className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none'
        />
      </div>

      {/* Auto-load */}
      <div className='bg-gray-900 rounded-lg border border-gray-800 p-5'>
        <label className='flex items-center justify-between cursor-pointer'>
          <div>
            <p className='text-sm text-gray-300'>Auto-load last model on startup</p>
            <p className='text-xs text-gray-500'>Automatically load the previously used model</p>
          </div>
          <input
            type='checkbox'
            checked={settings.autoLoadModel || false}
            onChange={(e) => setSettings((prev) => ({ ...prev, autoLoadModel: e.target.checked }))}
            className="w-9 h-5 bg-gray-700 rounded-full appearance-none cursor-pointer relative
                       checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5
                       after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-transform
                       checked:after:translate-x-4"
          />
        </label>
      </div>
    </div>
  );
}
