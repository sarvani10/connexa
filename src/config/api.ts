// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  GOOGLE_AUTH: `${API_BASE_URL}/api/auth/google`,
  
  // Posts endpoints
  POSTS: `${API_BASE_URL}/api/posts`,
  
  // Users endpoints
  USERS: `${API_BASE_URL}/api/users`,
  
  // Connections endpoints
  CONNECTIONS: `${API_BASE_URL}/api/connections`,
  
  // Messages endpoints
  MESSAGES: `${API_BASE_URL}/api/messages`,
};

export default API_BASE_URL;
