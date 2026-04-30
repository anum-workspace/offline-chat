export default function ThinkingIndicator() {
  return (
    <div className='flex items-center gap-2 px-4 py-3'>
      <div className='flex items-center gap-1'>
        <div className='w-2 h-2 bg-indigo-400 rounded-full typing-dot' />
        <div className='w-2 h-2 bg-indigo-400 rounded-full typing-dot' />
        <div className='w-2 h-2 bg-indigo-400 rounded-full typing-dot' />
      </div>
      <span className='text-xs text-gray-500'>Thinking...</span>
    </div>
  );
}
