import React, { createContext, useState, useCallback, useEffect } from 'react';

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actionButtons?: ActionButton[];
}

export interface ActionButton {
  label: string;
  action: string;
  variant?: 'default' | 'outline' | 'secondary';
}

interface UnibotContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  loadMessages: () => void;
  updateLastMessage: (updatedMessage: Message) => void;
}

export const UnibotContext = createContext<UnibotContextType | undefined>(undefined);

const STORAGE_KEY = 'unibotMessages';

export function UnibotProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load messages from localStorage on mount
  const loadMessages = useCallback(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
        console.log(`✅ Loaded ${messagesWithDates.length} messages from localStorage`);
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('❌ Error loading messages from localStorage:', error);
      setIsInitialized(true);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        console.log(`✅ Saved ${messages.length} messages to localStorage`);
      } catch (error) {
        console.error('❌ Error saving messages to localStorage:', error);
      }
    }
  }, [messages, isInitialized]);

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const updateLastMessage = useCallback((updatedMessage: Message) => {
    setMessages((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = updatedMessage;
      }
      return updated;
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Chat history cleared');
  }, []);

  return (
    <UnibotContext.Provider
      value={{
        messages,
        addMessage,
        clearMessages,
        loadMessages,
        updateLastMessage,
      }}
    >
      {children}
    </UnibotContext.Provider>
  );
}

/**
 * Hook to use Unibot context
 * Must be called within UnibotProvider
 */
export function useUnibotChat() {
  const context = React.useContext(UnibotContext);
  if (context === undefined) {
    throw new Error('useUnibotChat must be used within UnibotProvider');
  }
  return context;
}
