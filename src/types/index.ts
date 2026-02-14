export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  avatar?: string;
  isPrivate: boolean;
  postsCount: number;
  connectionsCount: number;
  createdAt: Date;
}

export interface Connection {
  id: string;
  requesterId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  readAt?: Date;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  mediaType: 'text' | 'image' | 'video';
  mediaUrl?: string;
  createdAt: Date;
  likesCount: number;
  commentsCount: number;
  isAnonymous?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
