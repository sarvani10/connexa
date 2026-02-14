import React, { useState } from 'react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useConnection } from '../../context/ConnectionContext';
import ProfileCard from '../Profile/ProfileCard';

const UserList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { sendConnectionRequest, isConnected, isPendingConnection, getConnectedUsers } = useConnection();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
  ];

  const handleConnect = (userId: string) => {
    sendConnectionRequest(userId);
  };

  const handleMessage = (user: User) => {
    setSelectedUser(user);
  };

  if (selectedUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <button
            onClick={() => setSelectedUser(null)}
            className="mb-4 text-indigo-600 hover:text-indigo-500"
          >
            ← Back to Users
          </button>
          <ProfileCard
            user={selectedUser}
            onConnect={() => handleConnect(selectedUser.id)}
            onMessage={() => handleMessage(selectedUser)}
            isConnected={isConnected(selectedUser.id)}
            isPendingConnection={isPendingConnection(selectedUser.id)}
            canMessage={isConnected(selectedUser.id)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Discover People</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockUsers
            .filter(user => user.id !== currentUser?.id)
            .map(user => (
              <ProfileCard
                key={user.id}
                user={user}
                onConnect={() => handleConnect(user.id)}
                onMessage={() => handleMessage(user)}
                isConnected={isConnected(user.id)}
                isPendingConnection={isPendingConnection(user.id)}
                canMessage={isConnected(user.id)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
