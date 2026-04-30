import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <div className='my-3 rounded-lg overflow-hidden border border-gray-700'>
              <div className='flex items-center justify-between px-3 py-1.5 bg-gray-800 text-xs text-gray-400 uppercase'>
                <span>{match[1]}</span>
              </div>
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag='div'
                showLineNumbers
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className='bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded text-sm' {...props}>
              {children}
            </code>
          );
        },
        p: ({ children }) => (
          <p className='text-gray-300 leading-relaxed mb-2 last:mb-0'>{children}</p>
        ),
        h1: ({ children }) => <h1 className='text-xl font-bold text-gray-100 mb-3'>{children}</h1>,
        h2: ({ children }) => (
          <h2 className='text-lg font-semibold text-gray-200 mb-2'>{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className='text-base font-semibold text-gray-300 mb-1.5'>{children}</h3>
        ),
        ul: ({ children }) => (
          <ul className='list-disc pl-5 mb-2 text-gray-300 space-y-1'>{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className='list-decimal pl-5 mb-2 text-gray-300 space-y-1'>{children}</ol>
        ),
        blockquote: ({ children }) => (
          <blockquote className='border-l-3 border-indigo-500 pl-3 my-2 text-gray-400 italic'>
            {children}
          </blockquote>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            className='text-indigo-400 hover:text-indigo-300 underline'
            target='_blank'
            rel='noopener noreferrer'
          >
            {children}
          </a>
        ),
      }}
    >
      {content || ''}
    </ReactMarkdown>
  );
}
