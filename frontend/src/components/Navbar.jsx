import { Link, useLocation } from 'react-router-dom';
import { VscComment, VscSettings, VscLibrary, VscChip } from 'react-icons/vsc';
import { useAppContext } from '@context/AppContext';

export default function Navbar() {
  const location = useLocation();
  const { modelStatus } = useAppContext();

  const navItems = [
    { path: '/', icon: VscComment, label: 'Chat' },
    { path: '/models', icon: VscLibrary, label: 'Models' },
    { path: '/settings', icon: VscSettings, label: 'Settings' },
  ];

  return (
    <nav className='flex items-center justify-between h-10 bg-gray-900 border-b border-gray-800 px-3 flex-shrink-0'>
      <div className='flex items-center gap-0.5'>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors ${location.pathname === item.path ? 'bg-gray-800 text-gray-200' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}
          >
            <item.icon className='w-3.5 h-3.5' />
            {item.label}
          </Link>
        ))}
      </div>
      <div className='flex items-center gap-2'>
        {modelStatus?.initialized && (
          <div className='flex items-center gap-1.5 px-2 py-1 bg-green-900/20 border border-green-800 rounded text-[10px] text-green-400'>
            <VscChip className='w-3 h-3' />
            <span className='truncate max-w-[100px]'>{modelStatus.modelName}</span>
          </div>
        )}
      </div>
    </nav>
  );
}
