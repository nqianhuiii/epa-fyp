import { useState, useCallback, useRef } from 'react';
import ChatbotService from '../services/chatbotService';
import { ChatbotConfig, ChatMessage } from '../types/chatbotType';

export interface UseChatbotReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  retryLastMessage: () => Promise<void>;
  updateConfig: (config: Partial<ChatbotConfig>) => void;
  getConfig: () => ChatbotConfig;
}

export const useChatbot = (apiKey: string): UseChatbotReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hai! Saya E-bot, pembantu pembelajaran untuk Asas Sains Komputer Tingkatan 1. Boleh tanya saya apa-apa soalan berkaitan subjek ini! 🤖',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatbotService = useRef(new ChatbotService(apiKey));
  const lastUserMessage = useRef<string>('');

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addMessage = useCallback((text: string, isUser: boolean, isError = false) => {
    const newMessage: ChatMessage = {
      id: generateId(),
      text,
      isUser,
      timestamp: new Date(),
      isError,
    };

    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);
    lastUserMessage.current = message;

    // Add user message
    addMessage(message, true);

    try {
      const response = await chatbotService.current.sendMessage(message);
      addMessage(response, false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ralat tidak diketahui berlaku';
      setError(errorMessage);
      addMessage(errorMessage, false, true);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addMessage]);

  const retryLastMessage = useCallback(async () => {
    if (!lastUserMessage.current || isLoading) return;
    
    // Remove the last error message if it exists
    setMessages(prev => {
      const lastMessage = prev[prev.length - 1];
      if (!lastMessage.isUser && lastMessage.isError) {
        return prev.slice(0, -1);
      }
      return prev;
    });

    await sendMessage(lastUserMessage.current);
  }, [isLoading, sendMessage]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        text: '  Saya E-bot, pembantu pembelajaran untuk Asas Sains Komputer Tingkatan 1. Boleh tanya saya apa-apa soalan berkaitan subjek ini! 🤖',
        isUser: false,
        timestamp: new Date(),
      }
    ]);
    setError(null);
    lastUserMessage.current = '';
  }, []);

  const updateConfig = useCallback((config: Partial<ChatbotConfig>) => {
    chatbotService.current.updateConfig(config);
  }, []);

  const getConfig = useCallback(() => {
    return chatbotService.current.getConfig();
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    retryLastMessage,
    updateConfig,
    getConfig,
  };
};