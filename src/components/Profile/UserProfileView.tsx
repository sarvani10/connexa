import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useConnection } from '../../context/ConnectionContext';
import { useMessage } from '../../context/MessageContext';
import { usePost } from '../../context/PostContext';
import { User as UserIcon, Mail, Lock, Globe, MessageCircle, Users, FileText, Calendar } from 'lucide-react';
import PostFeed from '../Posts/PostFeed';

interface UserProfileViewProps {
  user: User;
  onBack?: () => void;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ user, onBack }) => {
  const { user: currentUser } = useAuth();
  const { sendConnectionRequest, isConnected, isPendingConnection, getConnectedUsers } = useConnection();
  const { getMessages } = useMessage();
  const { posts } = usePost();
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Calculate dynamic counts
  const userPostsCount = useMemo(() => {
    return posts.filter(post => post.authorId === user.id).length;
  }, [posts, user.id]);

  const userConnectionsCount = useMemo(() => {
    const connectedUsers = getConnectedUsers();
    return connectedUsers.filter(userId => 
      userId === user.id || connectedUsers.includes(userId)
    ).length;
  }, [getConnectedUsers, user.id]);

  // Calculate relative join date
  const getRelativeJoinDate = (dateString: string | Date) => {
    const joinDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffMonths === 1) return '1 month ago';
    if (diffMonths < 12) return `${diffMonths} months ago`;
    if (diffYears === 1) return '1 year ago';
    return `${diffYears} years ago`;
  };

  const joinDate = user.createdAt ? getRelativeJoinDate(user.createdAt) : 'Unknown';

  const handleConnect = () => {
    sendConnectionRequest(user.id);
  };

  const handleMessage = () => {
    setShowMessageModal(true);
  };

  const canMessage = isConnected(user.id);
  const hasMessages = getMessages(user.id).length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            ← Back
          </button>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-indigo-600" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{user.fullName}</h1>
                <p className="text-indigo-100 mb-2">@{user.username}</p>
                <div className="flex items-center space-x-2">
                  {user.isPrivate ? (
                    <div className="flex items-center text-indigo-100">
                      <Lock className="w-4 h-4 mr-1" />
                      <span className="text-sm">Private Account</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-indigo-100">
                      <Globe className="w-4 h-4 mr-1" />
                      <span className="text-sm">Public Account</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {user.bio && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700">{user.bio}</p>
            </div>
          )}

          {/* Stats Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-indigo-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{userPostsCount}</div>
                  <div className="text-sm text-gray-600">No. of posts</div>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="w-8 h-8 text-indigo-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{userConnectionsCount}</div>
                  <div className="text-sm text-gray-600">No. of Connections</div>
                </div>
              </div>
            </div>
          </div>

          {/* Joined Date Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-indigo-600 mr-3" />
              <div>
                <div className="text-sm font-bold text-gray-900">
                  {joinDate}
                </div>
                <div className="text-sm text-gray-600">Joined</div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              <span>{user.email}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {currentUser?.id !== user.id && (
            <div className="p-6 bg-gray-50">
              <div className="flex space-x-4">
                {!isConnected(user.id) && !isPendingConnection(user.id) && (
                  <button
                    onClick={handleConnect}
                    className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Connect
                  </button>
                )}
                
                {isPendingConnection(user.id) && (
                  <button
                    disabled
                    className="flex-1 bg-yellow-600 text-white py-3 px-6 rounded-md cursor-not-allowed font-medium"
                  >
                    Connection Request Sent
                  </button>
                )}

                {isConnected(user.id) && (
                  <>
                    <button
                      disabled
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md cursor-not-allowed font-medium"
                    >
                      Connected
                    </button>
                    
                    <button
                      onClick={handleMessage}
                      className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 transition-colors font-medium flex items-center justify-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </button>
                  </>
                )}
              </div>

              {!canMessage && currentUser?.id !== user.id && (
                <p className="text-sm text-gray-500 text-center mt-3">
                  Connect with {user.fullName} to send messages
                </p>
              )}
            </div>
          )}
        </div>

        {/* Message Modal */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Message {user.fullName}
              </h3>
              <p className="text-gray-600 mb-4">
                You have {hasMessages ? 'existing' : 'no'} messages with {user.fullName}.
                {hasMessages && ' Go to Messages to continue the conversation.'}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                {hasMessages && (
                  <button
                    onClick={() => {
                      setShowMessageModal(false);
                      // Navigate to messages - this would need routing implementation
                      window.location.href = '/messages';
                    }}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Go to Messages
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User's Posts */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts</h2>
        <PostFeed userId={user.id} />
      </div>
    </div>
  );
};

export default UserProfileView;
