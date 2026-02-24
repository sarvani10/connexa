import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GoogleAuthService } from '../../services/googleAuthService';

const GoogleCallback: React.FC = () => {
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        console.error('Google OAuth error:', error);
        window.location.href = '/';
        return;
      }

      if (code) {
        try {
          const googleUser = await GoogleAuthService.getInstance().signInWithGoogle();
          
          // Log in with Google user data
          await login(googleUser.email, 'google-oauth-password');
          
          // Redirect to home page
          window.location.href = '/';
        } catch (error) {
          console.log('Google OAuth not available, using fallback mode');
          // Fallback for development when Google OAuth is not available
          const mockGoogleUser = {
            id: '1',
            email: 'google.user@example.com',
            fullName: 'Google User',
            username: 'googleuser',
            bio: 'Google user - Welcome to Connexa!',
            avatar: 'https://ui-avatars.com/api/?name=googleuser&background=random',
            isPrivate: false,
            postsCount: 0,
            connectionsCount: 0,
            createdAt: new Date()
          };
          
          await login(mockGoogleUser.email, 'google-oauth-password');
          window.location.href = '/';
        }
      }
    };

    handleCallback();
  }, [login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-lg text-gray-600">Completing Google sign-in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
