import { useState, useEffect } from 'react';
import {
  VscChromeMinimize,
  VscChromeMaximize,
  VscChromeRestore,
  VscChromeClose,
} from 'react-icons/vsc';
import appIcon from '@assets/icon.png';

export default function TitleBar({ title = 'OfflineChat' }) {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    window.api.isMaximized().then(setIsMaximized);
    const cleanup = window.api.onMaximizeChange((maximized) => setIsMaximized(maximized));
    return cleanup;
  }, []);

  return (
    <div
      className='flex items-center justify-between h-8 bg-gray-900 border-b border-gray-800 select-none'
      style={{ WebkitAppRegion: 'drag' }}
    >
      <div className='flex items-center gap-2 pl-3'>
        <img src={appIcon} alt='OfflineChat' className='w-4 h-4' />
        <span className='text-xs text-gray-400 font-medium'>{title}</span>
      </div>
      <div className='flex h-full' style={{ WebkitAppRegion: 'no-drag' }}>
        <button
          onClick={() => window.api.minimizeWindow()}
          className='w-12 h-full flex items-center justify-center hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors'
        >
          <VscChromeMinimize className='w-4 h-4' />
        </button>
        <button
          onClick={() =>
            isMaximized ? window.api.unmaximizeWindow() : window.api.maximizeWindow()
          }
          className='w-12 h-full flex items-center justify-center hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors'
        >
          {isMaximized ? (
            <VscChromeRestore className='w-3.5 h-3.5' />
          ) : (
            <VscChromeMaximize className='w-3.5 h-3.5' />
          )}
        </button>
        <button
          onClick={() => window.api.closeWindow()}
          className='w-12 h-full flex items-center justify-center hover:bg-red-700 text-gray-400 hover:text-white transition-colors'
        >
          <VscChromeClose className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
}
