import React, { useState, useRef } from 'react';
import { usePost } from '../../context/PostContext';
import { Image, Video, Send, X } from 'lucide-react';

const PostCreator: React.FC = () => {
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<'text' | 'image' | 'video'>('text');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createPost } = usePost();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      setMediaType(type);
      // In a real app, you would upload the file and get a URL
      // For demo, we'll use a placeholder URL
      const placeholderUrl = type === 'image' 
        ? `https://picsum.photos/seed/${Date.now()}/400/300.jpg`
        : 'https://example.com/video.mp4';
      setMediaUrl(placeholderUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl) return;

    setIsCreating(true);
    try {
      await createPost(content.trim(), mediaType, mediaUrl || undefined);
      setContent('');
      setMediaUrl('');
      setMediaType('text');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const removeMedia = () => {
    setMediaUrl('');
    setMediaType('text');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Create a Post</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Content */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows={3}
          />
        </div>

        {/* Media Preview */}
        {mediaUrl && (
          <div className="relative">
            {mediaType === 'image' ? (
              <img
                src={mediaUrl}
                alt="Post media"
                className="w-full max-h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full bg-gray-100 rounded-lg p-8 text-center">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Video preview</p>
              </div>
            )}
            <button
              type="button"
              onClick={removeMedia}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="media-upload"
            />
            <label
              htmlFor="media-upload"
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer transition-colors"
            >
              <Image className="w-4 h-4 mr-2" />
              Image
            </label>
            <label
              htmlFor="media-upload"
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer transition-colors"
            >
              <Video className="w-4 h-4 mr-2" />
              Video
            </label>
          </div>

          <button
            type="submit"
            disabled={isCreating || (!content.trim() && !mediaUrl)}
            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4 mr-2" />
            {isCreating ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostCreator;
