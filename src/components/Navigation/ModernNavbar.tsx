import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConnection } from '../../context/ConnectionContext';
import { Home, Search, Plus, MessageCircle, User, Settings, LogOut, Heart, Mic } from 'lucide-react';
import MoodSelector from './MoodSelector';
import YouTubeBackground from './YouTubeBackground';
import SettingsModal from '../Settings/SettingsModal';
import '../../styles/MoodAnimations.css';

interface ModernNavbarProps {
  currentView: 'home' | 'feed' | 'discover' | 'messages' | 'profile' | 'vent';
  onViewChange: (view: 'home' | 'feed' | 'discover' | 'messages' | 'profile' | 'vent') => void;
  onCreatePost?: () => void;
}

type Mood = 'sad' | 'angry' | 'happy' | 'calm' | 'default' | null;

const ModernNavbar: React.FC<ModernNavbarProps> = ({ currentView, onViewChange, onCreatePost }) => {
  const { user, logout } = useAuth();
  const { pendingRequests } = useConnection();
  const [currentMood, setCurrentMood] = React.useState<Mood>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleMoodChange = (mood: Mood) => {
    setCurrentMood(mood);
    // Apply mood theme to body with proper class management
    document.body.classList.remove('mood-sad', 'mood-angry', 'mood-happy', 'mood-calm');
    document.body.classList.remove('mood-transition');
    
    if (mood) {
      document.body.classList.add(`mood-${mood}`, 'mood-transition');
    } else {
      document.body.classList.add('mood-transition');
    }
  };

  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'discover' as const, icon: Search, label: 'Discover' },
    { id: 'messages' as const, icon: MessageCircle, label: 'Messages' },
    { id: 'vent' as const, icon: Heart, label: 'Vent' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* YouTube Background for Sad Mood */}
      <YouTubeBackground videoId="5yTpvU2j9r8" isActive={currentMood === 'sad'} />
      
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Connexa</span>
            </div>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center space-x-1 bg-gray-50 rounded-xl p-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                const hasBadge = item.id === 'messages' && pendingRequests.length > 0;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-violet-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {hasBadge && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                );
              })}
              
              {/* Create Button in Center */}
              <button
                onClick={onCreatePost}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Create</span>
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Mood Selector */}
              <MoodSelector onMoodChange={handleMoodChange} currentMood={currentMood} />
              
              {/* Happy emojis */}
              {currentMood === 'happy' && (
                <>
                  <div className="happy-1"></div>
                  <div className="happy-2"></div>
                  <div className="happy-3"></div>
                  <div className="happy-4"></div>
                  <div className="happy-5"></div>
                  <div className="happy-6"></div>
                  <div className="happy-7"></div>
                </>
              )}
              
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <button 
                      onClick={() => setShowSettings(true)}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Settings</span>
                    </button>
                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={onCreatePost}
                className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};

export default ModernNavbar;
