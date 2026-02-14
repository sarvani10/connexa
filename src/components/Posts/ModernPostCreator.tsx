import React, { useState, useRef } from 'react';
import { usePost } from '../../context/PostContext';
import { useAuth } from '../../context/AuthContext';
import { Image, Video, X, Send, User, EyeOff } from 'lucide-react';

interface ModernPostCreatorProps {
  onClose?: () => void;
}

const ModernPostCreator: React.FC<ModernPostCreatorProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<'text' | 'image' | 'video'>('text');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
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
        ? `https://picsum.photos/seed/${Date.now()}/600/400.jpg`
        : 'https://example.com/video.mp4';
      setMediaUrl(placeholderUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl) return;

    setIsCreating(true);
    try {
      await createPost(content.trim(), mediaType, mediaUrl || undefined, isAnonymous);
      setContent('');
      setMediaUrl('');
      setMediaType('text');
      setIsAnonymous(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose?.(); // Close modal after successful post
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">U</span>
        </div>
        <h3 className="font-semibold text-gray-900">Create Post</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Content */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-colors"
            rows={4}
          />
        </div>

        {/* Media Preview */}
        {mediaUrl && (
          <div className="relative rounded-xl overflow-hidden">
            {mediaType === 'image' ? (
              <img
                src={mediaUrl}
                alt="Post media"
                className="w-full max-h-64 object-cover"
              />
            ) : (
              <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 text-center">
                <Video className="w-12 h-12 text-white mx-auto mb-2" />
                <p className="text-gray-300">Video preview</p>
              </div>
            )}
            <button
              type="button"
              onClick={removeMedia}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Happy Mood Particles */}
        {mediaType === 'text' && (
          <div className="particles">
            {Array.from({ length: 30 }, (_, index) => (
              <div
                key={index}
                className="particle"
                style={{
                  left: `${Math.random() * 90 + 5}%`,
                  animationDelay: `${Math.random() * 12}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
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
                className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <Image className="w-4 h-4" />
                <span className="text-sm font-medium">Image</span>
              </label>
              <label
                htmlFor="media-upload"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <Video className="w-4 h-4" />
                <span className="text-sm font-medium">Video</span>
              </label>
            </div>
            
            {/* Anonymous Toggle */}
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-11 h-6 rounded-full transition-colors ${
                  isAnonymous ? 'bg-purple-600' : 'bg-gray-200'
                }`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    isAnonymous ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
                <span className="flex items-center space-x-1 text-sm text-gray-600">
                  {isAnonymous ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span>Anonymous</span>
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      <span>Named</span>
                    </>
                  )}
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreating || (!content.trim() && !mediaUrl)}
            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="w-4 h-4" />
            <span className="font-medium">{isCreating ? 'Posting...' : 'Post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModernPostCreator;
