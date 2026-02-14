import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConnection } from '../../context/ConnectionContext';
import { usePost } from '../../context/PostContext';
import { User, Post } from '../../types';
import UserProfileView from '../Profile/UserProfileView';
import ModernPostCreator from '../Posts/ModernPostCreator';
import ModernPostCard from '../Posts/ModernPostCard';
import { TrendingUp, Users, MessageCircle, Heart, Share2, X } from 'lucide-react';

interface ModernHomeProps {
  showCreateModal?: boolean;
  setShowCreateModal?: (show: boolean) => void;
}

const ModernHome: React.FC<ModernHomeProps> = ({ showCreateModal = false, setShowCreateModal }) => {
  const { user } = useAuth();
  const { sendConnectionRequest, isConnected, isPendingConnection } = useConnection();
  const { posts } = usePost();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Mock trending users
  const trendingUsers: User[] = [
    {
      id: '2',
      username: 'sarah_chen',
      email: 'sarah@example.com',
      fullName: 'Sarah Chen',
      bio: 'UI/UX Designer & Creative Thinker',
      isPrivate: false,
      postsCount: 24,
      connectionsCount: 892,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '3',
      username: 'mike_j',
      email: 'mike@example.com',
      fullName: 'Mike Johnson',
      bio: 'Photographer & Visual Storyteller',
      isPrivate: false,
      postsCount: 156,
      connectionsCount: 1203,
      createdAt: new Date('2024-02-20'),
    },
    {
      id: '4',
      username: 'emma_davis',
      email: 'emma@example.com',
      fullName: 'Emma Davis',
      bio: 'Product Manager & Innovation Enthusiast',
      isPrivate: false,
      postsCount: 89,
      connectionsCount: 567,
      createdAt: new Date('2024-03-05'),
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
      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
                <button
                  onClick={() => setShowCreateModal?.(false)}
                  className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <ModernPostCreator onClose={() => setShowCreateModal?.(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.map((post) => (
                <ModernPostCard
                  key={post.id}
                  post={post}
                  showDeleteButton={post.authorId === user?.id}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Users */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-violet-600" />
                  Trending Now
                </h3>
                <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {trendingUsers.map((trendingUser, index) => (
                  <div key={trendingUser.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <button
                          onClick={() => handleViewProfile(trendingUser)}
                          className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-sm font-semibold">
                            {trendingUser.fullName.charAt(0).toUpperCase()}
                          </span>
                        </button>
                        {index < 3 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{trendingUser.fullName}</p>
                        <p className="text-xs text-gray-500">{trendingUser.connectionsCount} connections</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleConnect(trendingUser.id)}
                      disabled={isConnected(trendingUser.id) || isPendingConnection(trendingUser.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isConnected(trendingUser.id)
                          ? 'bg-green-50 text-green-600'
                          : isPendingConnection(trendingUser.id)
                          ? 'bg-yellow-50 text-yellow-600'
                          : 'bg-violet-50 text-violet-600 hover:bg-violet-100'
                      }`}
                    >
                      {isConnected(trendingUser.id) ? 'Connected' : 
                       isPendingConnection(trendingUser.id) ? 'Pending' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowCreateModal?.(true)}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-white rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                    <span className="text-violet-600 font-semibold">+</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Create Post</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 bg-white rounded-xl hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Find People</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHome;
