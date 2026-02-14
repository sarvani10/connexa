import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ConnectionProvider } from './context/ConnectionContext';
import { MessageProvider } from './context/MessageContext';
import { PostProvider } from './context/PostContext';
import LoginForm from './components/Auth/LoginForm';
import ModernNavbar from './components/Navigation/ModernNavbar';
import ModernHome from './components/Home/ModernHome';
import ModernPostCreator from './components/Posts/ModernPostCreator';
import UserSearch from './components/Search/UserSearch';
import MessageList from './components/Messaging/MessageList';
import MyProfile from './components/Profile/MyProfile';
import VentPage from './components/Vent/VentPage';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = React.useState<'home' | 'feed' | 'discover' | 'messages' | 'profile' | 'vent'>('home');
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <ModernHome showCreateModal={showCreateModal} setShowCreateModal={setShowCreateModal} />;
      case 'feed':
        return <ModernHome showCreateModal={showCreateModal} setShowCreateModal={setShowCreateModal} />;
      case 'discover':
        return <UserSearch />;
      case 'messages':
        return <MessageList />;
      case 'profile':
        return <MyProfile />;
      case 'vent':
        return <VentPage />;
      default:
        return <ModernHome showCreateModal={showCreateModal} setShowCreateModal={setShowCreateModal} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernNavbar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onCreatePost={() => setShowCreateModal(true)}
      />
      <div className="pt-16">
        {renderCurrentView()}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ConnectionProvider>
        <MessageProvider>
          <PostProvider>
            <AppContent />
          </PostProvider>
        </MessageProvider>
      </ConnectionProvider>
    </AuthProvider>
  );
};

export default App;
