import { VscAccount, VscHubot } from 'react-icons/vsc';
import MarkdownRenderer from './MarkdownRenderer';

export default function ChatMessage({ message, isStreaming }) {
  const isUser = message.role === 'user';

  // Safe parse of attachments
  let attachments = [];
  if (message.attachments) {
    if (typeof message.attachments === 'string') {
      try {
        attachments = JSON.parse(message.attachments);
      } catch (e) {
        console.warn('Failed to parse attachments:', e);
        attachments = [];
      }
    } else if (Array.isArray(message.attachments)) {
      attachments = message.attachments;
    }
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Bot Avatar */}
      {!isUser && (
        <div className='w-8 h-8 rounded-full bg-indigo-900/30 border border-indigo-800 flex items-center justify-center flex-shrink-0 mt-1'>
          <VscHubot className='w-4 h-4 text-indigo-400' />
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-[75%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-indigo-900/30 border border-indigo-800'
              : 'bg-gray-800 border border-gray-700'
          }`}
        >
          {/* Attachments */}
          {attachments.length > 0 && (
            <div className='flex gap-1.5 mb-2 flex-wrap'>
              {attachments.map((file, i) => (
                <div
                  key={i}
                  className='flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300'
                >
                  <span className='text-gray-400'>📎</span>
                  <span className='truncate max-w-[120px]'>
                    {typeof file === 'string' ? file : file?.name || 'File'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Message Text */}
          {isUser ? (
            <p className='text-sm text-gray-200 whitespace-pre-wrap break-words'>
              {message.content || ''}
            </p>
          ) : (
            <div className={`text-sm ${isStreaming ? 'streaming-cursor' : ''}`}>
              <MarkdownRenderer content={message.content || ''} />
            </div>
          )}
        </div>

        {/* Timestamp */}
        {message.created_at && (
          <p className='text-[10px] text-gray-600 mt-1 px-2'>
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className='w-8 h-8 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center flex-shrink-0 mt-1'>
          <VscAccount className='w-4 h-4 text-gray-400' />
        </div>
      )}
    </div>
  );
}
