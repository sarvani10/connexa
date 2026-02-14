import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { Post } from '../types';
import { useAuth } from './AuthContext';

interface PostContextType {
  posts: Post[];
  createPost: (content: string, mediaType: 'text' | 'image' | 'video', mediaUrl?: string, isAnonymous?: boolean) => Promise<void>;
  getUserPosts: (userId: string) => Post[];
  likePost: (postId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

type PostAction =
  | { type: 'CREATE_POST'; payload: Post }
  | { type: 'LIKE_POST'; payload: string }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'SET_POSTS'; payload: Post[] };

const postReducer = (state: Post[], action: PostAction): Post[] => {
  switch (action.type) {
    case 'CREATE_POST':
      return [action.payload, ...state];
    case 'LIKE_POST':
      return state.map(post =>
        post.id === action.payload
          ? { ...post, likesCount: post.likesCount + 1 }
          : post
      );
    case 'DELETE_POST':
      return state.filter(post => post.id !== action.payload);
    case 'SET_POSTS':
      return action.payload;
    default:
      return state;
  }
};

const mockPosts: Post[] = [
  {
    id: '1',
    authorId: '1',
    content: 'Just launched my new project! Excited to share it with everyone. 🚀',
    mediaType: 'text',
    createdAt: new Date('2024-03-10T10:00:00'),
    likesCount: 15,
    commentsCount: 3,
  },
  {
    id: '2',
    authorId: '2',
    content: 'Beautiful sunset from my morning walk',
    mediaType: 'image',
    mediaUrl: 'https://picsum.photos/seed/sunset/400/300.jpg',
    createdAt: new Date('2024-03-09T18:30:00'),
    likesCount: 28,
    commentsCount: 7,
  },
  {
    id: '3',
    authorId: '1',
    content: 'Check out this amazing tutorial I found!',
    mediaType: 'video',
    mediaUrl: 'https://example.com/video.mp4',
    createdAt: new Date('2024-03-08T14:15:00'),
    likesCount: 42,
    commentsCount: 12,
  },
];

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [posts, dispatch] = useReducer(postReducer, mockPosts);

  // Fetch posts from backend on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.POSTS);
        const backendPosts = await response.json();
        
        // Convert backend posts to frontend format
        const formattedPosts = backendPosts.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt)
        }));
        
        dispatch({ type: 'SET_POSTS', payload: formattedPosts });
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        // Keep using mock posts if backend fails
      }
    };

    fetchPosts();
  }, []);

  const createPost = async (content: string, mediaType: 'text' | 'image' | 'video', mediaUrl?: string, isAnonymous?: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.POSTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          mediaType,
          mediaUrl,
          isAnonymous: isAnonymous || false,
          authorId: user?.id
        }),
      });
      
      const newPost = await response.json();
      dispatch({ type: 'CREATE_POST', payload: newPost });
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const getUserPosts = (userId: string): Post[] => {
    return posts
      .filter(post => post.authorId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const likePost = async (postId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      dispatch({ type: 'LIKE_POST', payload: postId });
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      dispatch({ type: 'DELETE_POST', payload: postId });
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        createPost,
        getUserPosts,
        likePost,
        deletePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};
