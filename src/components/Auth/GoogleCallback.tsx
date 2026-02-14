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
          console.error('Error during Google sign-in:', error);
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
