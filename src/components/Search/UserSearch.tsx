import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useConnection } from '../../context/ConnectionContext';
import ProfileCard from '../Profile/ProfileCard';
import { Search, Filter } from 'lucide-react';

const UserSearch: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { sendConnectionRequest, isConnected, isPendingConnection } = useConnection();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'public' | 'private'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const mockUsers: User[] = [
    {
      id: '1',
      username: 'john_doe',
      email: 'john@example.com',
      fullName: 'John Doe',
      bio: 'Software developer passionate about connections',
      isPrivate: false,
      postsCount: 15,
      connectionsCount: 42,
      createdAt: new Date('2024-01-15'),
    },
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
    {
      id: '6',
      username: 'emma_davis',
      email: 'emma@example.com',
      fullName: 'Emma Davis',
      bio: 'Product manager and agile coach',
      isPrivate: false,
      postsCount: 18,
      connectionsCount: 28,
      createdAt: new Date('2024-01-25'),
    },
  ];

  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      // Exclude current user
      if (user.id === currentUser?.id) return false;
      
      // Apply search filter
      const matchesSearch = 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.bio?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      // Apply privacy filter
      if (filterBy === 'public' && user.isPrivate) return false;
      if (filterBy === 'private' && !user.isPrivate) return false;
      
      return true;
    });
  }, [searchTerm, filterBy, currentUser, mockUsers]);

  const handleConnect = (userId: string) => {
    sendConnectionRequest(userId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Discover People</h1>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, username, or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              
              {showFilters && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilterBy('all')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      filterBy === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    All Users
                  </button>
                  <button
                    onClick={() => setFilterBy('public')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      filterBy === 'public'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Public Only
                  </button>
                  <button
                    onClick={() => setFilterBy('private')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      filterBy === 'private'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Private Only
                  </button>
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {searchTerm || filterBy !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No other users available at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <ProfileCard
                key={user.id}
                user={user}
                onConnect={() => handleConnect(user.id)}
                isConnected={isConnected(user.id)}
                isPendingConnection={isPendingConnection(user.id)}
                canMessage={isConnected(user.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
