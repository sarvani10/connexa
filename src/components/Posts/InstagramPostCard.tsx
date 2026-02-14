import React, { useState } from 'react';
import { Post } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { usePost } from '../../context/PostContext';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Heart as HeartFilled } from 'lucide-react';

interface InstagramPostCardProps {
  post: Post;
  authorName: string;
  authorAvatar?: string;
  showDeleteButton?: boolean;
}

const InstagramPostCard: React.FC<InstagramPostCardProps> = ({ 
  post, 
  authorName, 
  authorAvatar,
  showDeleteButton = false 
}) => {
  const { user } = useAuth();
  const { likePost, deletePost } = usePost();
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await likePost(post.id);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

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

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-4 max-w-2xl mx-auto">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mr-3">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold">
                {authorName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">{authorName}</h3>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-gray-600 hover:text-gray-900"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          {showOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              {showDeleteButton && (
                <button
                  onClick={() => deletePost(post.id)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  Delete Post
                </button>
              )}
              <button
                onClick={() => setShowOptions(false)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Media */}
      <div className="relative bg-gray-100">
        {post.mediaUrl ? (
          post.mediaType === 'image' ? (
            <img
              src={post.mediaUrl}
              alt="Post"
              className="w-full object-cover"
              style={{ maxHeight: '600px' }}
            />
          ) : (
            <div className="w-full bg-gray-900 flex items-center justify-center" style={{ minHeight: '400px' }}>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">▶</span>
                </div>
                <p className="text-gray-400">Video Content</p>
              </div>
            </div>
          )
        ) : (
          <div className="w-full bg-gray-50 flex items-center justify-center" style={{ minHeight: '200px' }}>
            <p className="text-gray-400 text-center px-4">{post.content}</p>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className="transition-colors"
            >
              {isLiked ? (
                <HeartFilled className="w-6 h-6 text-red-500" />
              ) : (
                <Heart className="w-6 h-6 text-gray-900 hover:text-gray-700" />
              )}
            </button>
            
            <button className="text-gray-900 hover:text-gray-700">
              <MessageCircle className="w-6 h-6" />
            </button>
            
            <button className="text-gray-900 hover:text-gray-700">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
          
          <button
            onClick={handleSave}
            className={`transition-colors ${
              isSaved ? 'text-gray-900' : 'text-gray-900 hover:text-gray-700'
            }`}
          >
            <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Likes */}
        <div className="mb-2">
          <p className="font-semibold text-sm text-gray-900">
            {post.likesCount + (isLiked ? 1 : 0)} likes
          </p>
        </div>

        {/* Caption */}
        <div className="mb-2">
          <p className="text-sm text-gray-900">
            <span className="font-semibold mr-2">{authorName}</span>
            {post.content}
          </p>
        </div>

        {/* Comments */}
        {post.commentsCount > 0 && (
          <div className="mb-2">
            <button className="text-sm text-gray-500 hover:text-gray-700">
              View all {post.commentsCount} comments
            </button>
          </div>
        )}

        {/* Timestamp */}
        <div>
          <p className="text-xs text-gray-500 uppercase">{formatDate(post.createdAt)}</p>
        </div>

        {/* Add Comment */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <form className="flex items-center">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 text-sm outline-none"
            />
            <button
              type="submit"
              className="text-sm font-semibold text-blue-500 hover:text-blue-600"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InstagramPostCard;
