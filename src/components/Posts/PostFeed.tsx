import React from 'react';
import { usePost } from '../../context/PostContext';
import { useAuth } from '../../context/AuthContext';
import PostCard from './PostCard';
import PostCreator from './PostCreator';

const PostFeed: React.FC<{ userId?: string }> = ({ userId }) => {
  const { user: currentUser } = useAuth();
  const { getUserPosts, posts } = usePost();

  // If userId is provided, show that user's posts
  // Otherwise, show all posts
  const displayPosts = userId ? getUserPosts(userId) : posts;

  const getAuthorName = (authorId: string): string => {
    // If the post author is the current user, return their actual name
    if (authorId === currentUser?.id) {
      return currentUser.fullName;
    }
    
    // Mock author names for other users - in a real app, you'd fetch user data
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
    <div className="max-w-2xl mx-auto">
      {/* Post Creator - only show on general feed, not on specific user profiles */}
      {showCreatePost && <PostCreator />}

      {/* Posts Feed */}
      <div>
        {displayPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {userId ? 'No posts yet' : 'No posts in your feed'}
            </h3>
            <p className="text-gray-600">
              {userId 
                ? 'This user hasn\'t posted anything yet.'
                : 'Start following people to see their posts here, or create your first post above!'}
            </p>
          </div>
        ) : (
          displayPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              authorName={getAuthorName(post.authorId)}
              showDeleteButton={post.authorId === currentUser?.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PostFeed;
