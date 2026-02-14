// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com';
export const GOOGLE_CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET || 'your-google-client-secret';

// Google OAuth Scopes
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'openid'
];

// Google OAuth URLs
export const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';
