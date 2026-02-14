import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConnection } from '../../context/ConnectionContext';
import { User } from '../../types';
import UserProfileView from '../Profile/UserProfileView';
import InstagramFeed from '../Posts/InstagramFeed';

const InstagramHome: React.FC = () => {
  const { user } = useAuth();
  const { sendConnectionRequest, isConnected, isPendingConnection } = useConnection();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'following' | 'suggestions'>('following');

  // Mock following users
  const followingUsers: User[] = [
    {
      id: '2',
      username: 'jane_smith',
      email: 'jane@example.com',
      fullName: 'Jane Smith',
      bio: 'Designer and creative thinker',
      isPrivate: false,
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

  // Mock connection suggestions
  const suggestionUsers: User[] = [
    {
      id: '4',
      username: 'sarah_jones',
      email: 'sarah@example.com',
      fullName: 'Sarah Jones',
      bio: 'Marketing expert and content creator',
      isPrivate: false,
      postsCount: 12,
      connectionsCount: 34,
      createdAt: new Date('2024-03-05'),
    },
    {
      id: '5',
      username: 'alex_brown',
      email: 'alex@example.com',
      fullName: 'Alex Brown',
      bio: 'Data scientist and machine learning enthusiast',
      isPrivate: true,
      postsCount: 20,
      connectionsCount: 15,
      createdAt: new Date('2024-02-15'),
    },
  ];

  const handleConnect = (userId: string) => {
    sendConnectionRequest(userId);
  };

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
  };

  if (selectedUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserProfileView 
          user={selectedUser} 
          onBack={() => setSelectedUser(null)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            <InstagramFeed />
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            {/* User Profile Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">
                    {user?.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{user?.fullName}</h3>
                  <p className="text-gray-500 text-sm">@{user?.username}</p>
                </div>
              </div>
              <div className="flex justify-around text-center text-sm">
                <div>
                  <div className="font-semibold">{user?.postsCount}</div>
                  <div className="text-gray-500">posts</div>
                </div>
                <div>
                  <div className="font-semibold">{user?.connectionsCount}</div>
                  <div className="text-gray-500">connections</div>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-gray-900">Suggestions For You</h3>
                <button className="text-xs font-semibold text-blue-500 hover:text-blue-600">
                  See All
                </button>
              </div>

              {/* Tabs */}
              <div className="flex mb-4 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('following')}
                  className={`flex-1 pb-2 text-sm font-medium transition-colors ${
                    activeTab === 'following'
                      ? 'text-blue-500 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Following
                </button>
                <button
                  onClick={() => setActiveTab('suggestions')}
                  className={`flex-1 pb-2 text-sm font-medium transition-colors ${
                    activeTab === 'suggestions'
                      ? 'text-blue-500 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Suggestions
                </button>
              </div>

              {/* User List */}
              <div className="space-y-3">
                {(activeTab === 'following' ? followingUsers : suggestionUsers).map((suggestion) => (
                  <div key={suggestion.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleViewProfile(suggestion)}
                        className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mr-3"
                      >
                        <span className="text-white text-xs font-semibold">
                          {suggestion.fullName.charAt(0).toUpperCase()}
                        </span>
                      </button>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{suggestion.fullName}</p>
                        <p className="text-xs text-gray-500">{suggestion.username}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleConnect(suggestion.id)}
                      disabled={isConnected(suggestion.id) || isPendingConnection(suggestion.id)}
                      className={`text-xs font-medium transition-colors ${
                        isConnected(suggestion.id)
                          ? 'text-green-600'
                          : isPendingConnection(suggestion.id)
                          ? 'text-yellow-600'
                          : 'text-blue-500 hover:text-blue-600'
                      }`}
                    >
                      {isConnected(suggestion.id) ? 'Connected' : 
                       isPendingConnection(suggestion.id) ? 'Pending' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramHome;
