import { useState, useEffect, useRef } from 'react';
import { VscChip, VscChevronDown, VscAdd, VscTrash, VscLoading } from 'react-icons/vsc';
import { useAppContext } from '@context/AppContext';

export default function ModelSelector({ onModelChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const { modelStatus, checkModelStatus } = useAppContext();
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadModels();
  }, [modelStatus]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadModels = async () => {
    try {
      setModels(await window.api.getModels());
    } catch (e) {}
  };

  const handleSelectFile = async () => {
    setIsOpen(false);
    const result = await window.api.selectModelFile();
    if (result) {
      setLoading(true);
      const loadResult = await window.api.loadModel(result.path);
      if (loadResult?.success) {
        checkModelStatus();
        onModelChange?.(result.name);
      }
      setLoading(false);
      loadModels();
    }
  };

  const handleLoadModel = async (path) => {
    setLoading(true);
    const result = await window.api.loadModel(path);
    if (result?.success) {
      checkModelStatus();
      onModelChange?.(result.name);
    }
    setLoading(false);
  };

  const handleUnload = async () => {
    await window.api.unloadModel();
    checkModelStatus();
    onModelChange?.(null);
  };

  const handleOpenFolder = () => {
    window.api.openModelsFolder();
    setTimeout(loadModels, 1500);
  };

  const handleDeleteModel = async (path, name) => {
    if (modelStatus?.modelName === name) {
      await window.api.unloadModel();
      checkModelStatus();
    }
    await window.api.deleteModel(path);
    loadModels();
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 border border-gray-700 transition-colors'
      >
        {loading ? (
          <VscLoading className='w-3.5 h-3.5 animate-spin text-indigo-400' />
        ) : (
          <VscChip
            className={`w-3.5 h-3.5 ${modelStatus?.initialized ? 'text-green-400' : 'text-gray-500'}`}
          />
        )}
        <span className='truncate max-w-[120px]'>{modelStatus?.modelName || 'No Model'}</span>
        <VscChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className='absolute top-full left-0 mt-1 w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50'>
          <div className='p-2 border-b border-gray-800'>
            <button
              onClick={handleSelectFile}
              className='w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 rounded transition-colors'
            >
              <VscAdd className='w-3.5 h-3.5 text-green-400' />
              Add Model File
            </button>
            <button
              onClick={handleOpenFolder}
              className='w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 rounded transition-colors'
            >
              <VscAdd className='w-3.5 h-3.5 text-blue-400' />
              Open Models Folder
            </button>
            {modelStatus?.initialized && (
              <button
                onClick={handleUnload}
                className='w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-gray-800 rounded transition-colors'
              >
                <VscTrash className='w-3.5 h-3.5' />
                Unload Model
              </button>
            )}
          </div>

          <div className='max-h-60 overflow-y-auto p-2'>
            <div className='px-2 py-1 text-[10px] text-gray-500 uppercase font-semibold'>
              Installed Models
            </div>
            {models.length === 0 ? (
              <p className='px-2 py-3 text-xs text-gray-600'>No models installed</p>
            ) : (
              models.map((m) => (
                <div
                  key={m.path}
                  className='flex items-center justify-between px-2 py-1.5 text-xs rounded hover:bg-gray-800 group'
                >
                  <button
                    onClick={() => handleLoadModel(m.path)}
                    className={`flex-1 text-left truncate ${modelStatus?.modelName === m.name ? 'text-indigo-300' : 'text-gray-400'}`}
                  >
                    {m.name}
                  </button>
                  <span className='text-[10px] text-gray-600 mr-2'>
                    {(m.size / 1e9).toFixed(1)}GB
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteModel(m.path, m.name);
                    }}
                    className='text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all'
                  >
                    <VscTrash className='w-3 h-3' />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
