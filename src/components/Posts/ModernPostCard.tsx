import React, { useState } from 'react';
import { Post } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { usePost } from '../../context/PostContext';
import { MoreHorizontal, Image, Video, EyeOff } from 'lucide-react';

interface ModernPostCardProps {
  post: Post;
  authorAvatar?: string;
  showDeleteButton?: boolean;
}

const ModernPostCard: React.FC<ModernPostCardProps> = ({ 
  post, 
  authorAvatar,
  showDeleteButton = false 
}) => {
  const { user } = useAuth();
  const { deletePost } = usePost();
  const [showOptions, setShowOptions] = useState(false);

  const getAuthorName = (post: Post, user?: any): string => {
    // If the post is anonymous, show "Anonymous"
    if (post.isAnonymous) {
      return 'Anonymous';
    }
    
    // If the post author is the current user, return their actual name
    if (post.authorId === user?.id) {
      return user.fullName;
    }
    
    // Mock author names for other users - in a real app, you'd fetch user data
    const authorNames: Record<string, string> = {
      '1': 'John Doe',
      '2': 'Jane Smith',
      '3': 'Mike Wilson',
      '4': 'Sarah Jones',
    };
    return authorNames[post.authorId] || 'Unknown User';
  };

  const authorName = getAuthorName(post, user);

  const formatDate = (date: Date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getMediaIcon = () => {
    switch (post.mediaType) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 max-w-3xl mx-auto">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              post.isAnonymous 
                ? 'bg-gray-500' 
                : 'bg-gradient-to-br from-violet-400 to-purple-500'
            }`}>
              {post.isAnonymous ? (
                <EyeOff 
                  className="w-5 h-5 text-white flex-shrink-0" 
                  style={{ display: 'block', visibility: 'visible' }}
                />
              ) : authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-lg leading-none">
                  {authorName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {!post.isAnonymous && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{authorName}</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{formatDate(post.createdAt)}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                {getMediaIcon()}
                <span>{post.mediaType}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
          
          {showOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
              {showDeleteButton && (
                <button
                  onClick={() => deletePost(post.id)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete Post
                </button>
              )}
              <button
                onClick={() => setShowOptions(false)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-4">
        {post.content && (
          <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
        )}
        
        {/* Media Content */}
        {post.mediaUrl && (
          <div className="rounded-xl overflow-hidden bg-gray-50">
            {post.mediaType === 'image' ? (
              <img
                src={post.mediaUrl}
                alt="Post content"
                className="w-full object-cover"
                style={{ maxHeight: '500px' }}
              />
            ) : (
              <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center" style={{ minHeight: '300px' }}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-300">Video Content</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Actions - Minimal */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* No actions - minimal design */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernPostCard;
