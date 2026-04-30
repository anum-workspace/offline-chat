import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useChat(modelStatus) {
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const abortRef = useRef(false);

  const sendMessage = useCallback(
    async (content, attachments = []) => {
      const userMsg = {
        id: uuidv4(),
        role: 'user',
        content,
        attachments,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      let ragContext = '';
      if (attachments.length > 0) {
        for (const file of attachments) {
          const result = await window.api.processFile(file.path);
          if (result?.text)
            ragContext += `\n\n[File: ${file.name}]\n${result.text.slice(0, 2000)}\n`;
        }
      }

      setIsGenerating(true);
      setStreamingContent('');
      abortRef.current = false;

      const systemMsg = ragContext
        ? { role: 'system', content: `Use this context:\n${ragContext}` }
        : null;
      const allMessages = [
        ...(systemMsg ? [systemMsg] : []),
        ...messages.filter((m) => m.role !== 'system'),
        userMsg,
      ];

      try {
        let fullResponse = '';
        const cleanup = await window.api.streamMessage(allMessages, (token) => {
          if (abortRef.current) return;
          fullResponse += token;
          setStreamingContent(fullResponse);
        });

        if (fullResponse) {
          const assistantMsg = {
            id: uuidv4(),
            role: 'assistant',
            content: fullResponse,
            created_at: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setStreamingContent('');
        }

        cleanup?.();
        return fullResponse;
      } catch (error) {
        console.error('Chat error:', error);
      } finally {
        setIsGenerating(false);
      }
    },
    [messages],
  );

  const stopGeneration = useCallback(() => {
    abortRef.current = true;
    setIsGenerating(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setStreamingContent('');
  }, []);

  return {
    messages,
    setMessages,
    isGenerating,
    streamingContent,
    sendMessage,
    stopGeneration,
    clearMessages,
  };
}
