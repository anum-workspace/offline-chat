import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAppContext } from "@context/AppContext";
import ChatMessage from "@components/ChatMessage";
import ChatInput from "@components/ChatInput";
import ThinkingIndicator from "@components/ThinkingIndicator";
import Sidebar from "@components/Sidebar";
import ModelSelector from "@components/ModelSelector";
import { VscChip } from "react-icons/vsc";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";

export default function ChatPage() {
  const { currentChat, setCurrentChat, chats, setChats, modelStatus, loadChats, checkModelStatus } =
    useAppContext();
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);
  const abortRef = useRef(false);

  useEffect(() => {
    if (currentChat) loadMessages(currentChat.id);
  }, [currentChat?.id]);
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const loadMessages = async (chatId) => {
    const msgs = await window.api.getMessages(chatId);
    setMessages(msgs || []);
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // const handleSend = async (content, attachments) => {
  //   console.log('=== handleSend ===');
  //   console.log('Content:', content);
  //   console.log('Model status:', modelStatus);

  //   if (!modelStatus?.initialized) {
  //     alert('Please load a model first from Settings or the model selector.');
  //     return;
  //   }

  //   // Create chat if none exists
  //   let chat = currentChat;
  //   if (!chat) {
  //     chat = { id: uuidv4(), title: content.slice(0, 50), model: modelStatus?.modelName };
  //     await window.api.createChat(chat.id, chat.title, chat.model);
  //     setCurrentChat(chat);
  //     setChats((prev) => [chat, ...prev]);
  //   }

  //   // Add user message to UI immediately
  //   const userMsg = {
  //     id: uuidv4(),
  //     chat_id: chat.id,
  //     role: 'user',
  //     content,
  //     attachments: attachments || [],
  //     created_at: new Date().toISOString(),
  //   };

  //   await window.api.addMessage(userMsg.id, chat.id, 'user', content, attachments);
  //   setMessages((prev) => [...prev, userMsg]);
  //   scrollToBottom();

  //   // Process RAG context
  //   let ragContext = '';
  //   if (attachments?.length) {
  //     for (const file of attachments) {
  //       if (file.path) {
  //         try {
  //           const result = await window.api.processFile(file.path);
  //           if (result?.text)
  //             ragContext += `\n\n[File: ${file.name}]\n${result.text.slice(0, 2000)}\n`;
  //         } catch (e) {}
  //       }
  //     }
  //   }

  //   // Build messages for LLM
  //   const llmMessages = [
  //     ...(ragContext ? [{ role: 'system', content: `Use this context:\n${ragContext}` }] : []),
  //     ...messages.map((m) => ({ role: m.role, content: m.content })),
  //     { role: 'user', content },
  //   ];

  //   console.log('Sending to LLM:', llmMessages.length, 'messages');

  //   setIsGenerating(true);
  //   setStreamingContent('');

  //   try {
  //     // Try streaming first, fall back to non-streaming
  //     console.log('Calling streamMessage...');

  //     const cleanup = window.api.streamMessage(llmMessages, (token) => {
  //       setStreamingContent((prev) => prev + token);
  //       scrollToBottom();
  //     });

  //     // Wait a bit for streaming to complete
  //     await new Promise((resolve, reject) => {
  //       const timeout = setTimeout(() => {
  //         cleanup();
  //         reject(new Error('Generation timed out'));
  //       }, 60000); // 60 second timeout

  //       // Listen for done event via a poll
  //       const pollInterval = setInterval(async () => {
  //         if (!isGenerating) {
  //           clearInterval(pollInterval);
  //           clearTimeout(timeout);
  //           resolve();
  //         }
  //       }, 500);
  //     });
  //   } catch (streamError) {
  //     console.warn('Streaming failed, trying non-streaming:', streamError.message);

  //     // Fallback to non-streaming
  //     try {
  //       const response = await window.api.sendMessage(llmMessages);
  //       console.log('Non-streaming response:', response?.length, 'chars');

  //       if (response) {
  //         setStreamingContent(response);
  //       }
  //     } catch (error) {
  //       console.error('Both methods failed:', error.message);
  //       setStreamingContent('Error: ' + error.message);
  //     }
  //   }

  //   // Save assistant message
  //   if (streamingContent) {
  //     const assistantMsg = {
  //       id: uuidv4(),
  //       chat_id: chat.id,
  //       role: 'assistant',
  //       content: streamingContent,
  //       created_at: new Date().toISOString(),
  //     };

  //     await window.api.addMessage(assistantMsg.id, chat.id, 'assistant', streamingContent);
  //     setMessages((prev) => [...prev, assistantMsg]);
  //     setStreamingContent('');
  //   }

  //   // Update chat title
  //   if (messages.length === 0) {
  //     const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
  //     await window.api.updateChatTitle(chat.id, title);
  //     setChats((prev) => prev.map((c) => (c.id === chat.id ? { ...c, title } : c)));
  //   }

  //   setIsGenerating(false);
  // };
  const handleSend = async (content, attachments) => {
    if (!modelStatus?.initialized) {
      alert("Please load a model first.");
      return;
    }

    // Create chat if needed
    let chat = currentChat;
    if (!chat) {
      chat = { id: uuidv4(), title: content.slice(0, 50), model: modelStatus?.modelName };
      await window.api.createChat(chat.id, chat.title, chat.model);
      setCurrentChat(chat);
      setChats((prev) => [chat, ...prev]);
    }

    // Add user message
    const userMsg = {
      id: uuidv4(),
      chat_id: chat.id,
      role: "user",
      content,
      attachments: attachments || [],
      created_at: new Date().toISOString(),
    };
    await window.api.addMessage(userMsg.id, chat.id, "user", content, attachments);
    setMessages((prev) => [...prev, userMsg]);

    // Build LLM messages
    const llmMessages = messages
      .concat([userMsg])
      .map((m) => ({ role: m.role, content: m.content }));

    // Get response
    setIsGenerating(true);

    try {
      const response = await window.api.sendMessage(llmMessages);

      if (response) {
        const assistantMsg = {
          id: uuidv4(),
          chat_id: chat.id,
          role: "assistant",
          content: response,
          created_at: new Date().toISOString(),
        };
        await window.api.addMessage(assistantMsg.id, chat.id, "assistant", response);
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      alert("Failed to get response: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleNewChat = () => {
    setCurrentChat(null);
    setMessages([]);
  };
  const handleSelectChat = (chat) => {
    setCurrentChat(chat);
  };
  const handleDeleteChat = async (id) => {
    await window.api.deleteChat(id);
    if (currentChat?.id === id) {
      setCurrentChat(null);
      setMessages([]);
    }
    setChats((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="flex h-full">
      {showSidebar && (
        <Sidebar
          chats={chats}
          currentChat={currentChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onNewChat={handleNewChat}
          onClose={() => setShowSidebar(false)}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Title bar */}
        <div className="flex h-10 items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
          {/* Sidebar toggle */}
          <div className="flex items-center gap-2">
            {showSidebar ? (
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded"
              >
                <LuPanelLeftClose className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded"
              >
                <LuPanelLeftOpen className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-sm font-medium text-gray-300 truncate">
              {currentChat?.title || "New Chat"}
            </h2>
          </div>
          {/* Model selector */}
          <div className="flex items-center gap-2">
            <ModelSelector onModelChange={checkModelStatus} />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 && !isGenerating && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <h1 className="text-2xl font-bold text-gray-300 mb-2">Offline AI Chat</h1>
                <p className="text-gray-500 text-sm">
                  {modelStatus?.initialized
                    ? "Start a conversation. Your messages stay on your device."
                    : "Load a model to start chatting."}
                </p>
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isGenerating && streamingContent && (
            <ChatMessage message={{ role: "assistant", content: streamingContent }} isStreaming />
          )}
          {isGenerating && !streamingContent && <ThinkingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        <ChatInput
          onSend={handleSend}
          onStop={() => {
            abortRef.current = true;
            setIsGenerating(false);
          }}
          isGenerating={isGenerating}
          disabled={!modelStatus?.initialized}
        />
      </div>
    </div>
  );
}
