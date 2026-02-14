import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMessage } from '../../context/MessageContext';
import ChatWindow from './ChatWindow';
import { User, Message } from '../../types';
import { MessageCircle, User as UserIcon } from 'lucide-react';

const MessageList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { getMessages } = useMessage();
  const [selectedChat, setSelectedChat] = useState<User | null>(null);

  // Mock connected users for demo
  const connectedUsers: User[] = [
    {
      id: '2',
      username: 'jane_smith',
      email: 'jane@example.com',
      fullName: 'Jane Smith',
      bio: 'Designer and creative thinker',
      isPrivate: true,
      postsCount: 8,
      connectionsCount: 23,
      createdAt: new Date('2024-02-20'),
    },
    {
      id: '3',
      username: 'mike_wilson',
      email: 'mike@example.com',
      fullName: 'Mike Wilson',
      bio: 'Entrepreneur and startup enthusiast',
      isPrivate: false,
      postsCount: 25,
      connectionsCount: 67,
      createdAt: new Date('2024-01-10'),
    },
  ];

  const getUnreadCount = (userId: string): number => {
    return getMessages(userId).filter(
      msg => msg.senderId === userId && !msg.readAt
    ).length;
  };

  const getLastMessage = (userId: string): Message | null => {
    const userMessages = getMessages(userId);
    return userMessages.length > 0 ? userMessages[userMessages.length - 1] : null;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (selectedChat) {
    return (
      <ChatWindow
        recipient={selectedChat}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Chat with your connections</p>
        </div>

        {/* Message List */}
        <div className="divide-y divide-gray-200">
          {connectedUsers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600">Connect with people to start messaging</p>
            </div>
          ) : (
            connectedUsers.map((user) => {
              const lastMessage = getLastMessage(user.id);
              const unreadCount = getUnreadCount(user.id);
              
              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedChat(user)}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      <UserIcon className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {user.fullName}
                        </h3>
                        {lastMessage && (
                          <span className="text-sm text-gray-500">
                            {formatTime(lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {lastMessage ? (
                            <>
                              {lastMessage.senderId === currentUser?.id && 'You: '}
                              {lastMessage.content}
                            </>
                          ) : (
                            'No messages yet'
                          )}
                        </p>
                        {unreadCount > 0 && (
                          <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageList;
