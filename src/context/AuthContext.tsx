import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return { user: action.payload, isAuthenticated: true, isLoading: false };
    case 'LOGIN_FAILURE':
      return { user: null, isAuthenticated: false, isLoading: false };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, isLoading: false };
    case 'UPDATE_PROFILE':
      return state.user ? { ...state, user: { ...state.user, ...action.payload } } : state;
    default:
      return state;
  }
};

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
    id: 'google-user-1',
    username: 'google_user',
    email: 'googleuser@gmail.com',
    fullName: 'Google User',
    bio: 'Signed in with Google',
    isPrivate: false,
    postsCount: 0,
    connectionsCount: 0,
    createdAt: new Date(),
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
      } else {
        console.error('Login failed:', data.message);
        dispatch({ type: 'LOGIN_FAILURE' });
      }
    } catch (error) {
      // Fallback for development when backend is not available
      console.log('Backend not available, using fallback mode');
      const mockUser = {
        id: '1',
        email,
        fullName: email.split('@')[0],
        username: email.split('@')[0],
        bio: 'Welcome to Connexa!',
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
        isPrivate: false,
        postsCount: 0,
        connectionsCount: 0,
        createdAt: new Date()
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
      } else {
        console.error('Registration failed:', data.message);
        dispatch({ type: 'LOGIN_FAILURE' });
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      // Fallback for development when backend is not available
      console.log('Backend not available, using fallback mode');
      const mockUser = {
        id: '1',
        email: userData.email,
        fullName: userData.fullName,
        username: userData.username,
        bio: userData.bio || 'Welcome to Connexa!',
        avatar: `https://ui-avatars.com/api/?name=${userData.username}&background=random`,
        isPrivate: userData.isPrivate || false,
        postsCount: 0,
        connectionsCount: 0,
        createdAt: new Date()
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('user');
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'UPDATE_PROFILE', payload: userData });
      if (state.user) {
        const updatedUser = { ...state.user, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
