import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConnection } from '../../context/ConnectionContext';
import { User } from '../../types';
import UserProfileView from '../Profile/UserProfileView';

const WelcomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { sendConnectionRequest, isConnected, isPendingConnection } = useConnection();
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  // Mock connection suggestions
  const connectionSuggestions: User[] = [
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
  ];

  const handleConnect = (userId: string) => {
    sendConnectionRequest(userId);
  };

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
  };

  if (selectedUser) {
    return (
      <UserProfileView 
        user={selectedUser} 
        onBack={() => setSelectedUser(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Hi, {user?.fullName || 'User'}! Welcome.
          </h1>
          <p className="text-xl text-gray-600">Connect here,</p>
        </div>

        {/* Connection Suggestions */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            People you may know
          </h2>
          <div className="flex justify-center space-x-8 flex-wrap gap-y-8">
            {connectionSuggestions.slice(0, 3).map((suggestion, index) => (
              <div key={suggestion.id} className="flex flex-col items-center">
                <button
                  onClick={() => handleViewProfile(suggestion)}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-2 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                >
                  {suggestion.fullName.split(' ').map(n => n[0]).join('')}
                </button>
                <span className="text-sm text-gray-700 font-medium">{suggestion.fullName}</span>
                <span className="text-xs text-gray-500 mb-3">@{suggestion.username}</span>
                <button
                  onClick={() => handleConnect(suggestion.id)}
                  disabled={isConnected(suggestion.id) || isPendingConnection(suggestion.id)}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                    isConnected(suggestion.id)
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : isPendingConnection(suggestion.id)
                      ? 'bg-yellow-100 text-yellow-700 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isConnected(suggestion.id) ? 'Connected' : 
                   isPendingConnection(suggestion.id) ? 'Pending' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Profile */}
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Featured Profile
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg">
              Pr
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile User</h3>
            <p className="text-gray-600 text-center mb-4">Software developer passionate about building connections</p>
            
            <button className="mb-6 px-8 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              connect
            </button>
            
            <div className="w-full flex justify-around text-center border-t pt-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">42</div>
                <div className="text-sm text-gray-600">No. of posts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">128</div>
                <div className="text-sm text-gray-600">No. of Connections</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
