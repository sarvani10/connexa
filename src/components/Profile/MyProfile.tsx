import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConnection } from '../../context/ConnectionContext';
import { usePost } from '../../context/PostContext';
import { Settings, Edit2, Globe, Lock, Mail, Calendar, Users, FileText } from 'lucide-react';

const MyProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { pendingRequests, acceptConnectionRequest, rejectConnectionRequest, getConnectedUsers } = useConnection();
  const { posts } = usePost();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    isPrivate: user?.isPrivate || false,
  });

  // Calculate dynamic counts
  const userPostsCount = useMemo(() => {
    return posts.filter(post => post.authorId === user?.id).length;
  }, [posts, user?.id]);

  const userConnectionsCount = useMemo(() => {
    const connectedUsers = getConnectedUsers();
    return connectedUsers.filter(userId => 
      userId === user?.id || connectedUsers.includes(userId)
    ).length;
  }, [getConnectedUsers, user?.id]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      fullName: user?.fullName || '',
      bio: user?.bio || '',
      isPrivate: user?.isPrivate || false,
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              {isEditing ? (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-600">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPrivate"
                      checked={editForm.isPrivate}
                      onChange={(e) => setEditForm({ ...editForm, isPrivate: e.target.checked })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-900">
                      Make my account private
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
                  <p className="text-gray-600">@{user.username}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {user.isPrivate ? (
                      <div className="flex items-center text-gray-500">
                        <Lock className="w-4 h-4 mr-1" />
                        <span className="text-sm">Private Account</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-500">
                        <Globe className="w-4 h-4 mr-1" />
                        <span className="text-sm">Public Account</span>
                      </div>
                    )}
                  </div>
                  {user.bio && (
                    <p className="text-gray-700 mt-3">{user.bio}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-indigo-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{userPostsCount}</div>
                <div className="text-sm text-gray-600">Posts</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-indigo-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{userConnectionsCount}</div>
                <div className="text-sm text-gray-600">Connections</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        {/* Connection Requests */}
        {pendingRequests.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Connection Requests ({pendingRequests.length})
            </h3>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div>
                    <p className="font-medium text-gray-900">User ID: {request.requesterId}</p>
                    <p className="text-sm text-gray-600">
                      Sent {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => acceptConnectionRequest(request.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => rejectConnectionRequest(request.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
