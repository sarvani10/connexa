import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConnection } from '../../context/ConnectionContext';
import { Home, Search, PlusSquare, MessageCircle, User, Heart } from 'lucide-react';

interface InstagramNavbarProps {
  currentView: 'home' | 'feed' | 'discover' | 'messages' | 'profile';
  onViewChange: (view: 'home' | 'feed' | 'discover' | 'messages' | 'profile') => void;
  onCreatePost?: () => void;
}

const InstagramNavbar: React.FC<InstagramNavbarProps> = ({ currentView, onViewChange, onCreatePost }) => {
  const { user, logout } = useAuth();
  const { pendingRequests } = useConnection();

  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'search' as const, icon: Search, label: 'Search' },
    { id: 'create' as const, icon: PlusSquare, label: 'Create' },
    { id: 'messages' as const, icon: MessageCircle, label: 'Messages' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.id === 'create') {
      onCreatePost?.();
    } else if (item.id === 'search') {
      onViewChange('discover');
    } else if (item.id === 'home') {
      onViewChange('home');
    } else {
      onViewChange(item.id as any);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">Connexa</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (item.id === 'search' && currentView === 'discover');
              const hasBadge = item.id === 'messages' && pendingRequests.length > 0;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`relative transition-colors ${
                    isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-6 h-6" />
                  {hasBadge && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      {pendingRequests.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center">
            <button
              onClick={logout}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="Logout"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {user?.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-around w-full absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (item.id === 'search' && currentView === 'discover');
              const hasBadge = item.id === 'messages' && pendingRequests.length > 0;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`flex flex-col items-center p-2 transition-colors relative ${
                    isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs mt-1">{item.label}</span>
                  {hasBadge && (
                    <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      {pendingRequests.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramNavbar;
