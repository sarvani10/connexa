import React from 'react';
import PostFeed from '../Posts/PostFeed';

const HomeFeed: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Home Feed</h1>
        <PostFeed />
      </div>
    </div>
  );
};

export default HomeFeed;
