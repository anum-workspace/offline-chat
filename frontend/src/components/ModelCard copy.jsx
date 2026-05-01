import {
  VscStarFull,
  VscStarEmpty,
  VscCheck,
  VscLoading,
  VscWarning,
  VscArrowCircleDown,
} from 'react-icons/vsc';

export default function ModelCard({
  model,
  isInstalled,
  isLoaded,
  onLoad,
  onDownload,
  downloadProgress,
  downloadError,
}) {
  const isDownloading =
    downloadProgress && downloadProgress.filename === model.name && downloadProgress.progress < 100;

  const isComplete =
    downloadProgress &&
    downloadProgress.filename === model.name &&
    downloadProgress.progress >= 100;

  const progress = downloadProgress?.progress || 0;
  const speed = downloadProgress?.speed || 0;
  const downloaded = downloadProgress?.downloaded || 0;
  const total = downloadProgress?.total || 0;

  // Format bytes to human readable
  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes > 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
    if (bytes > 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
    if (bytes > 1e3) return `${(bytes / 1e3).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const formatSpeed = (bytesPerSec) => {
    if (!bytesPerSec) return '';
    if (bytesPerSec > 1e6) return `${(bytesPerSec / 1e6).toFixed(1)} MB/s`;
    if (bytesPerSec > 1e3) return `${(bytesPerSec / 1e3).toFixed(0)} KB/s`;
    return `${bytesPerSec.toFixed(0)} B/s`;
  };

  const getStatusBadge = () => {
    if (isLoaded)
      return { text: 'Loaded', color: 'bg-green-900/20 text-green-400 border-green-800' };
    if (isDownloading)
      return { text: `${progress}%`, color: 'bg-blue-900/20 text-blue-400 border-blue-800' };
    if (downloadError)
      return { text: 'Failed', color: 'bg-red-900/20 text-red-400 border-red-800' };
    if (isInstalled)
      return { text: 'Installed', color: 'bg-indigo-900/20 text-indigo-400 border-indigo-800' };
    return null;
  };

  const statusBadge = getStatusBadge();

  return (
    <div
      className={`p-4 rounded-lg border transition-colors ${
        isLoaded
          ? 'bg-green-900/10 border-green-800'
          : isInstalled
            ? 'bg-indigo-900/10 border-indigo-800'
            : isDownloading
              ? 'bg-blue-900/10 border-blue-800'
              : 'bg-gray-800 border-gray-700 hover:border-gray-600'
      }`}
    >
      {/* Header */}
      <div className='flex items-start justify-between mb-2'>
        <div className='min-w-0 flex-1'>
          <h3 className='text-sm font-medium text-gray-200 truncate' title={model.name}>
            {model.name}
          </h3>
        </div>
        <div className='flex items-center gap-0.5 ml-2 flex-shrink-0'>
          {[...Array(5)].map((_, i) =>
            i < model.stars ? (
              <VscStarFull key={i} className='w-3 h-3 text-yellow-500' />
            ) : (
              <VscStarEmpty key={i} className='w-3 h-3 text-gray-600' />
            ),
          )}
        </div>
      </div>

      {/* Badges */}
      <div className='flex flex-wrap gap-1.5 mb-2'>
        <span className='text-[10px] px-1.5 py-0.5 bg-gray-700/50 rounded text-gray-400 uppercase'>
          {model.type}
        </span>
        <span className='text-[10px] px-1.5 py-0.5 bg-gray-700/50 rounded text-gray-400'>
          {model.family}
        </span>
        <span className='text-[10px] px-1.5 py-0.5 bg-gray-700/50 rounded text-gray-400'>
          {model.parameters}
        </span>
        <span className='text-[10px] px-1.5 py-0.5 bg-gray-700/50 rounded text-gray-400'>
          {model.size}
        </span>
        {statusBadge && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${statusBadge.color}`}>
            {statusBadge.text}
          </span>
        )}
      </div>

      {/* Description */}
      <p className='text-xs text-gray-500 mb-2 line-clamp-2'>{model.description}</p>

      {/* Info Row */}
      <div className='flex items-center gap-3 text-[10px] text-gray-600 mb-3'>
        <span>Context: {model.contextSize.toLocaleString()}</span>
        <span>{model.quantization}</span>
      </div>

      {/* Download Progress */}
      {isDownloading && (
        <div className='mb-3'>
          <div className='w-full bg-gray-700 rounded-full h-2 overflow-hidden'>
            <div
              className='bg-blue-500 h-2 rounded-full transition-all duration-300'
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className='flex justify-between text-[10px] text-gray-400 mt-1.5'>
            <span className='font-medium'>{progress}%</span>
            <span>
              {formatBytes(downloaded)} / {formatBytes(total)}
            </span>
          </div>
          {speed > 0 && (
            <div className='text-[10px] text-gray-500 mt-0.5'>{formatSpeed(speed)}</div>
          )}
        </div>
      )}

      {/* Download Complete */}
      {isComplete && (
        <div className='mb-3'>
          <div className='w-full bg-gray-700 rounded-full h-2 overflow-hidden'>
            <div className='bg-green-500 h-2 rounded-full w-full' />
          </div>
          <div className='text-[10px] text-green-400 mt-1.5 font-medium'>✓ Download complete</div>
        </div>
      )}

      {/* Error Message */}
      {downloadError && (
        <div className='mb-3 p-2 bg-red-900/20 rounded text-[10px] text-red-400 flex items-start gap-1'>
          <VscWarning className='w-3 h-3 flex-shrink-0 mt-0.5' />
          <span>{downloadError}</span>
        </div>
      )}

      {/* Actions */}
      <div className='flex items-center gap-2'>
        {!isInstalled && !isDownloading && (
          <button
            onClick={() => onDownload(model)}
            className='flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors'
          >
            <VscArrowCircleDown className='w-3.5 h-3.5' />
            Download
          </button>
        )}

        {isDownloading && (
          <button
            onClick={() => onDownload(null)} // Cancel
            className='flex items-center gap-1 px-3 py-1.5 bg-red-900/20 hover:bg-red-900/30 rounded text-xs text-red-400 transition-colors'
          >
            <VscLoading className='w-3.5 h-3.5 animate-spin' />
            Cancel
          </button>
        )}

        {isInstalled && (
          <button
            onClick={() => onLoad(model)}
            disabled={isLoaded}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              isLoaded
                ? 'bg-green-900/20 text-green-400'
                : 'bg-indigo-900/20 text-indigo-400 hover:bg-indigo-900/30'
            }`}
          >
            {isLoaded ? <VscCheck className='w-3.5 h-3.5' /> : 'Load'}
          </button>
        )}

        {downloadError && (
          <button
            onClick={() => onDownload(model)}
            className='px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors'
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
