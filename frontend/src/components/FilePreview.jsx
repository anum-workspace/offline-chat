import { VscFilePdf, VscFileMedia, VscFileCode, VscClose } from 'react-icons/vsc';

export default function FilePreview({ file, onRemove }) {
  const getIcon = (type) => {
    if (type?.startsWith('image')) return <VscFileMedia className='w-6 h-6 text-blue-400' />;
    if (type?.includes('pdf') || type?.includes('.pdf'))
      return <VscFilePdf className='w-6 h-6 text-red-400' />;
    return <VscFileCode className='w-6 h-6 text-green-400' />;
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes > 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
    if (bytes > 1e3) return `${(bytes / 1e3).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  return (
    <div className='flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700'>
      {getIcon(file.type)}
      <div className='flex-1 min-w-0'>
        <p className='text-sm text-gray-300 truncate'>{file.name}</p>
        {file.size && <p className='text-xs text-gray-500'>{formatSize(file.size)}</p>}
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className='p-1 text-gray-500 hover:text-red-400 rounded transition-colors'
        >
          <VscClose className='w-4 h-4' />
        </button>
      )}
    </div>
  );
}
