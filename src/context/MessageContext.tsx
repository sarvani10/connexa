import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Message } from '../types';

interface MessageContextType {
  messages: Message[];
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  getMessages: (userId: string) => Message[];
  markAsRead: (messageId: string) => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

type MessageAction =
  | { type: 'SEND_MESSAGE'; payload: Message }
  | { type: 'MARK_READ'; payload: string }
  | { type: 'SET_MESSAGES'; payload: Message[] };

const messageReducer = (state: Message[], action: MessageAction): Message[] => {
  switch (action.type) {
    case 'SEND_MESSAGE':
      return [...state, action.payload];
    case 'MARK_READ':
      return state.map(msg =>
        msg.id === action.payload ? { ...msg, readAt: new Date() } : msg
      );
    case 'SET_MESSAGES':
      return action.payload;
    default:
      return state;
  }
};

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: '2',
    content: 'Hey Jane! How are you doing?',
    createdAt: new Date('2024-03-10T10:00:00'),
    readAt: new Date('2024-03-10T10:05:00'),
  },
  {
    id: '2',
    senderId: '2',
    receiverId: '1',
    content: 'Hi John! I\'m doing great, thanks for asking!',
    createdAt: new Date('2024-03-10T10:15:00'),
    readAt: new Date('2024-03-10T10:20:00'),
  },
  {
    id: '3',
    senderId: '1',
    receiverId: '2',
    content: 'Would you like to grab coffee sometime?',
    createdAt: new Date('2024-03-10T11:00:00'),
  },
];

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, dispatch] = useReducer(messageReducer, mockMessages);

  const sendMessage = async (receiverId: string, content: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: '1', // Assuming current user is '1' for demo
        receiverId,
        content,
        createdAt: new Date(),
      };
      dispatch({ type: 'SEND_MESSAGE', payload: newMessage });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const getMessages = (userId: string): Message[] => {
    return messages.filter(
      msg => (msg.senderId === '1' && msg.receiverId === userId) ||
             (msg.senderId === userId && msg.receiverId === '1')
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  };

  const markAsRead = async (messageId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      dispatch({ type: 'MARK_READ', payload: messageId });
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        sendMessage,
        getMessages,
        markAsRead,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};
