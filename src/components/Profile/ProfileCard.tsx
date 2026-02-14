import React from 'react';
import { User } from '../../types';
import { User as UserIcon, Mail, Lock, Globe } from 'lucide-react';

interface ProfileCardProps {
  user: User;
  onConnect?: () => void;
  onMessage?: () => void;
  isConnected?: boolean;
  isPendingConnection?: boolean;
  canMessage?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  onConnect,
  onMessage,
  isConnected = false,
  isPendingConnection = false,
  canMessage = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <UserIcon className="w-8 h-8 text-gray-500" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
          <p className="text-gray-600">@{user.username}</p>
          <div className="flex items-center space-x-2 mt-1">
            {user.isPrivate ? (
              <div className="flex items-center text-gray-500">
                <Lock className="w-4 h-4 mr-1" />
                <span className="text-xs">Private</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-500">
                <Globe className="w-4 h-4 mr-1" />
                <span className="text-xs">Public</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {user.bio && (
        <p className="text-gray-700 mb-4">{user.bio}</p>
      )}

      <div className="flex space-x-4 mb-4 text-center">
        <div className="flex-1">
          <div className="text-2xl font-bold text-gray-900">{user.postsCount}</div>
          <div className="text-sm text-gray-600">Posts</div>
        </div>
        <div className="flex-1">
          <div className="text-2xl font-bold text-gray-900">{user.connectionsCount}</div>
          <div className="text-sm text-gray-600">Connections</div>
        </div>
      </div>

      <div className="flex space-x-2">
        {!isConnected && !isPendingConnection && onConnect && (
          <button
            onClick={onConnect}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Connect
          </button>
        )}
        
        {isPendingConnection && (
          <button
            disabled
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md cursor-not-allowed"
          >
            Pending
          </button>
        )}

        {isConnected && (
          <button
            disabled
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md cursor-not-allowed"
          >
            Connected
          </button>
        )}

        {canMessage && onMessage && (
          <button
            onClick={onMessage}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
          >
            Message
          </button>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          <span className="text-sm">{user.email}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
