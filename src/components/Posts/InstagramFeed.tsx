import React, { useState } from 'react';
import { usePost } from '../../context/PostContext';
import { useAuth } from '../../context/AuthContext';
import InstagramPostCard from './InstagramPostCard';
import PostCreator from './PostCreator';

const InstagramFeed: React.FC<{ userId?: string }> = ({ userId }) => {
  const { user: currentUser } = useAuth();
  const { getUserPosts, posts } = usePost();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // If userId is provided, show that user's posts
  // Otherwise, show all posts
  const displayPosts = userId ? getUserPosts(userId) : posts;

  const getAuthorName = (authorId: string): string => {
    // Mock author names - in a real app, you'd fetch user data
    const authorNames: Record<string, string> = {
      '1': 'John Doe',
      '2': 'Jane Smith',
      '3': 'Mike Wilson',
      '4': 'Sarah Jones',
    };
    return authorNames[authorId] || 'Unknown User';
  };

  const showCreatePost = !userId && currentUser;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Create Post</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4">
              <PostCreator />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* Posts Feed */}
        <div>
          {displayPosts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📷</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {userId ? 'No posts yet' : 'Start sharing'}
              </h3>
              <p className="text-gray-600">
                {userId 
                  ? 'This user hasn\'t posted anything yet.'
                  : 'When you share photos, they will appear here.'}
              </p>
            </div>
          ) : (
            displayPosts.map((post) => (
              <InstagramPostCard
                key={post.id}
                post={post}
                authorName={getAuthorName(post.authorId)}
                showDeleteButton={post.authorId === currentUser?.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InstagramFeed;
