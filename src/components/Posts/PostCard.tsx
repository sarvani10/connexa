import React from 'react';
import { Post } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { usePost } from '../../context/PostContext';
import { Heart, MessageCircle, Share2, Trash2, Image, Video, Calendar } from 'lucide-react';

interface PostCardProps {
  post: Post;
  authorName: string;
  showDeleteButton?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, authorName, showDeleteButton = false }) => {
  const { user } = useAuth();
  const { likePost, deletePost } = usePost();
  const [isLiking, setIsLiking] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await likePost(post.id);
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    setIsDeleting(true);
    try {
      await deletePost(post.id);
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      setIsDeleting(false);
    }
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
      return postDate.toLocaleDateString();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-gray-600">
              {authorName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{authorName}</h4>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(post.createdAt)}
            </div>
          </div>
        </div>
        
        {showDeleteButton && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Delete post"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        {post.content && (
          <p className="text-gray-800 mb-3">{post.content}</p>
        )}
        
        {/* Media Content */}
        {post.mediaUrl && (
          <div className="rounded-lg overflow-hidden">
            {post.mediaType === 'image' ? (
              <img
                src={post.mediaUrl}
                alt="Post image"
                className="w-full max-h-96 object-cover"
              />
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Video content</p>
                <p className="text-xs text-gray-500 mt-1">{post.mediaUrl}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="flex items-center text-gray-600 hover:text-red-500 transition-colors"
          >
            <Heart className="w-5 h-5 mr-1" />
            <span className="text-sm">{post.likesCount}</span>
          </button>
          
          <button className="flex items-center text-gray-600 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-5 h-5 mr-1" />
            <span className="text-sm">{post.commentsCount}</span>
          </button>
          
          <button className="flex items-center text-gray-600 hover:text-green-500 transition-colors">
            <Share2 className="w-5 h-5 mr-1" />
            <span className="text-sm">Share</span>
          </button>
        </div>

        {/* Media Type Indicator */}
        <div className="flex items-center text-gray-400">
          {post.mediaType === 'image' ? (
            <Image className="w-4 h-4" />
          ) : post.mediaType === 'video' ? (
            <Video className="w-4 h-4" />
          ) : (
            <span className="text-xs">Text</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
