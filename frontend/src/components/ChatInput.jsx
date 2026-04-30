import { useState, useRef, useEffect } from 'react';
import {
  VscSend,
  VscAdd,
  VscClose,
  VscFileMedia,
  VscFilePdf,
  VscFileCode,
  VscStopCircle,
} from 'react-icons/vsc';

export default function ChatInput({ onSend, onStop, isGenerating, disabled }) {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState([]);
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [isGenerating]);

  const handleSubmit = () => {
    if (isGenerating) {
      onStop();
      return;
    }
    if (!input.trim() && !attachments.length) return;
    onSend(input, attachments);
    setInput('');
    setAttachments([]);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAddFile = async () => {
    const file = await window.api.selectFile();
    if (file) setAttachments((prev) => [...prev, file]);
  };

  const getFileIcon = (type) => {
    if (type?.startsWith('image')) return <VscFileMedia className='w-4 h-4' />;
    if (type?.startsWith('.pdf')) return <VscFilePdf className='w-4 h-4' />;
    return <VscFileCode className='w-4 h-4' />;
  };

  return (
    <div className='border-t border-gray-800 bg-gray-900 p-4'>
      {attachments.length > 0 && (
        <div className='flex gap-2 mb-2 flex-wrap'>
          {attachments.map((file, i) => (
            <div
              key={i}
              className='flex items-center gap-1.5 bg-gray-800 rounded-lg px-3 py-1.5 text-xs'
            >
              {getFileIcon(file.type)}
              <span className='text-gray-300 truncate max-w-[150px]'>{file.name}</span>
              <button
                onClick={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
                className='text-gray-500 hover:text-gray-300'
              >
                <VscClose className='w-3 h-3' />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className='flex items-end gap-2'>
        <button
          onClick={handleAddFile}
          className='p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors'
          title='Attach file'
        >
          <VscAdd className='w-4 h-4' />
        </button>
        <div className='flex-1 relative'>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 'Load a model to start...' : 'Type a message...'}
            disabled={disabled}
            className='w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed'
            rows={1}
            style={{ maxHeight: '150px', minHeight: '42px' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
            }}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={disabled || (!input.trim() && !attachments.length && !isGenerating)}
          className={`p-2.5 rounded-xl transition-colors ${isGenerating ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50'}`}
        >
          {isGenerating ? <VscStopCircle className='w-5 h-5' /> : <VscSend className='w-5 h-5' />}
        </button>
      </div>
    </div>
  );
}
