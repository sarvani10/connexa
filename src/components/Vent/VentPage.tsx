import React, { useState, useEffect, useRef } from 'react';
import { Search, MessageCircle, Heart, Trash2, Edit3, Lock, Mic, MicOff, Play, Pause, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/VentPage.css';

interface VentPost {
  id: string;
  content: string;
  authorId: string;
  timestamp: Date;
  isPrivate: boolean;
  isAnonymous: boolean;
}

interface VoiceMessage {
  id: string;
  audioUrl: string;
  duration: number;
  timestamp: Date;
  authorId: string;
  authorName: string;
  isPlaying: boolean;
}

const VentPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<VentPost[]>([]);
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([]);
  const [newPost, setNewPost] = useState('');
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRefsRef = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Load posts from localStorage for privacy
  useEffect(() => {
    const savedPosts = localStorage.getItem(`ventPosts_${user?.id || 'anonymous'}`);
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      // Migrate existing posts to basic structure
      const migratedPosts = parsedPosts.map((post: any) => ({
        id: post.id,
        content: post.content,
        authorId: post.authorId,
        timestamp: post.timestamp,
        isPrivate: post.isPrivate,
        isAnonymous: false // Force all posts to be non-anonymous
      }));
      setPosts(migratedPosts);
    }
    
    const savedVoiceMessages = localStorage.getItem(`voiceMessages_${user?.id || 'anonymous'}`);
    if (savedVoiceMessages) {
      setVoiceMessages(JSON.parse(savedVoiceMessages));
    }
  }, [user?.id]);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem(`ventPosts_${user?.id || 'anonymous'}`, JSON.stringify(posts));
    }
  }, [posts, user?.id]);

  // Save voice messages to localStorage whenever they change
  useEffect(() => {
    if (voiceMessages.length > 0) {
      localStorage.setItem(`voiceMessages_${user?.id || 'anonymous'}`, JSON.stringify(voiceMessages));
    }
  }, [voiceMessages, user?.id]);

  // Cleanup audio elements on unmount
  useEffect(() => {
    return () => {
      Object.values(audioRefsRef.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post: VentPost = {
      id: Date.now().toString(),
      content: newPost,
      authorId: user?.id || 'anonymous',
      timestamp: new Date(),
      isPrivate: true,
      isAnonymous: false
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleEditPost = (postId: string, content: string) => {
    setEditingPostId(postId);
    setEditingPost(content);
  };

  const saveEditedPost = (postId: string) => {
    if (!editingPost) return;

    setPosts(posts.map(post => 
      post.id === postId ? { ...post, content: editingPost } : post
    ));
    setEditingPost(null);
    setEditingPostId(null);
  };

  const clearAllPosts = () => {
    if (window.confirm('Are you sure you want to delete all your vent posts? This cannot be undone.')) {
      setPosts([]);
      localStorage.removeItem(`ventPosts_${user?.id || 'anonymous'}`);
    }
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Get audio duration
        const audio = new Audio(audioUrl);
        audio.addEventListener('loadedmetadata', () => {
          const message: VoiceMessage = {
            id: Date.now().toString(),
            audioUrl,
            duration: audio.duration,
            timestamp: new Date(),
            authorId: user?.id || 'anonymous',
            authorName: user?.fullName || 'Anonymous',
            isPlaying: false
          };
          
          setVoiceMessages(prev => [message, ...prev]);
        });
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      
      setRecordingTime(0);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const playVoiceMessage = (messageId: string) => {
    const message = voiceMessages.find(m => m.id === messageId);
    if (!message) return;

    // Stop any currently playing audio
    if (currentPlayingId && currentPlayingId !== messageId) {
      const currentAudio = audioRefsRef.current[currentPlayingId];
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    }

    const audio = audioRefsRef.current[messageId];
    if (audio) {
      if (audio.paused) {
        audio.play();
        setCurrentPlayingId(messageId);
        setVoiceMessages(prev => prev.map(m => 
          m.id === messageId ? { ...m, isPlaying: true } : { ...m, isPlaying: false }
        ));
      } else {
        audio.pause();
        setCurrentPlayingId(null);
        setVoiceMessages(prev => prev.map(m => 
          m.id === messageId ? { ...m, isPlaying: false } : m
        ));
      }
    }
  };

  const handleAudioEnded = (messageId: string) => {
    setCurrentPlayingId(null);
    setVoiceMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, isPlaying: false } : m
    ));
  };

  const deleteVoiceMessage = (messageId: string) => {
    const message = voiceMessages.find(m => m.id === messageId);
    if (message) {
      // Clean up audio URL
      URL.revokeObjectURL(message.audioUrl);
      
      // Stop and clean up audio element
      const audio = audioRefsRef.current[messageId];
      if (audio) {
        audio.pause();
        audio.src = '';
        delete audioRefsRef.current[messageId];
      }
      
      setVoiceMessages(prev => prev.filter(m => m.id !== messageId));
    }
  };

  const downloadVoiceMessage = (message: VoiceMessage) => {
    const a = document.createElement('a');
    a.href = message.audioUrl;
    a.download = `vent-voice-${message.id}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const clearAllVoiceMessages = () => {
    if (window.confirm('Are you sure you want to delete all voice messages? This cannot be undone.')) {
      // Clean up all audio URLs and elements
      voiceMessages.forEach(message => {
        URL.revokeObjectURL(message.audioUrl);
        const audio = audioRefsRef.current[message.id];
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
      
      audioRefsRef.current = {};
      setVoiceMessages([]);
      localStorage.removeItem(`voiceMessages_${user?.id || 'anonymous'}`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="vent-page">
      <div className="vent-header">
        <div className="vent-header-content">
          <div className="header-title">
            <h1 className="vent-title">Personal Vent Space</h1>
            <div className="privacy-badge">
              <Lock className="lock-icon" />
              <span>Private Journal</span>
            </div>
          </div>
          <p className="vent-description">
            A safe, private space to express your thoughts and feelings. Only you can see these posts.
          </p>
        </div>
        <div className="vent-stats">
          <div className="stat-item">
            <MessageCircle className="stat-icon" />
            <span className="stat-number">{posts.length}</span>
            <span className="stat-label">Text Posts</span>
          </div>
          <div className="stat-item">
            <Mic className="stat-icon" />
            <span className="stat-number">{voiceMessages.length}</span>
            <span className="stat-label">Voice Notes</span>
          </div>
          {(posts.length > 0 || voiceMessages.length > 0) && (
            <div className="clear-actions">
              {posts.length > 0 && (
                <button
                  onClick={clearAllPosts}
                  className="btn btn-danger"
                  title="Clear all text posts"
                >
                  <Trash2 className="icon" />
                  Clear Text
                </button>
              )}
              {voiceMessages.length > 0 && (
                <button
                  onClick={clearAllVoiceMessages}
                  className="btn btn-danger"
                  title="Clear all voice messages"
                >
                  <Trash2 className="icon" />
                  Clear Voice
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="vent-content">
        {/* Voice Recording Section */}
        <div className="create-post">
          <div className="create-post-header">
            <h3>Voice Recording</h3>
            <div className="post-options">
              <div className="privacy-indicator">
                <Lock className="lock-icon" />
                <span>Private - Only visible to you</span>
              </div>
            </div>
          </div>
          
          <div className="voice-recording-section">
            <div className="recording-controls">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="btn btn-record"
                  title="Start recording"
                >
                  <Mic className="icon" />
                  Start Voice Recording
                </button>
              ) : (
                <div className="recording-actions">
                  {!isPaused ? (
                    <button
                      onClick={pauseRecording}
                      className="btn btn-pause"
                      title="Pause recording"
                    >
                      <Pause className="icon" />
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={resumeRecording}
                      className="btn btn-resume"
                      title="Resume recording"
                    >
                      <Play className="icon" />
                      Resume
                    </button>
                  )}
                  <button
                    onClick={stopRecording}
                    className="btn btn-stop"
                    title="Stop recording"
                  >
                    <MicOff className="icon" />
                    Stop
                  </button>
                  <div className="recording-time">
                    <div className="recording-indicator"></div>
                    <span>{formatTime(recordingTime)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Text Post Section */}
        <div className="create-post">
          <div className="create-post-header">
            <h3>Write Your Thoughts</h3>
            <div className="post-options">
              <div className="privacy-indicator">
                <Lock className="lock-icon" />
                <span>Private - Only visible to you</span>
              </div>
            </div>
          </div>
          <textarea
            value={editingPostId ? editingPost || '' : newPost}
            onChange={(e) => editingPostId ? setEditingPost(e.target.value) : setNewPost(e.target.value)}
            placeholder="What's on your mind? This is your private space to vent..."
            className="vent-textarea"
            rows={4}
          />
          <div className="post-actions">
            {editingPostId ? (
              <>
                <button
                  onClick={() => saveEditedPost(editingPostId)}
                  className="btn btn-primary"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingPost(null);
                    setEditingPostId(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleCreatePost}
                className="btn btn-primary"
                disabled={!newPost.trim()}
              >
                Post
              </button>
            )}
          </div>
        </div>

        {/* Voice Messages Feed */}
        {voiceMessages.length > 0 && (
          <div className="posts-feed">
            <h3 className="feed-title">Voice Notes</h3>
            {voiceMessages.map(message => (
              <div key={message.id} className="vent-post voice-post">
                <div className="post-header">
                  <div className="post-author">
                    <div className="author-info">
                      <span className="author-name">My Voice Note</span>
                      <div className="privacy-badge-small">
                        <Lock className="lock-icon" />
                        <span>Private</span>
                      </div>
                    </div>
                    <span className="post-time">
                      {new Date(message.timestamp).toLocaleDateString()} at {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="post-actions">
                    <button
                      onClick={() => downloadVoiceMessage(message)}
                      className="btn btn-icon"
                      title="Download voice note"
                    >
                      <Download className="icon" />
                    </button>
                    <button
                      onClick={() => deleteVoiceMessage(message.id)}
                      className="btn btn-icon"
                      title="Delete voice note"
                    >
                      <Trash2 className="icon" />
                    </button>
                  </div>
                </div>
                <div className="post-content">
                  <div className="audio-player">
                    <button
                      onClick={() => playVoiceMessage(message.id)}
                      className="btn btn-play"
                      title={message.isPlaying ? "Pause" : "Play"}
                    >
                      {message.isPlaying ? <Pause className="icon" /> : <Play className="icon" />}
                    </button>
                    <div className="audio-info">
                      <div className="audio-waveform">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className={`wave-bar ${message.isPlaying ? 'active' : ''}`}
                            style={{ height: `${Math.random() * 40 + 10}%` }}
                          ></div>
                        ))}
                      </div>
                      <span className="duration">{formatTime(Math.floor(message.duration))}</span>
                    </div>
                  </div>
                  <audio
                    ref={(el) => {
                      if (el) audioRefsRef.current[message.id] = el;
                    }}
                    src={message.audioUrl}
                    onEnded={() => handleAudioEnded(message.id)}
                    preload="metadata"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Text Posts Feed */}
        <div className="posts-feed">
          <h3 className="feed-title">Written Posts</h3>
          {posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Lock className="icon" />
              </div>
              <h3>Your private journal is empty</h3>
              <p>Start by writing your first vent post or recording a voice note above. Remember, this is completely private - only you can see these thoughts.</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="vent-post">
                <div className="post-header">
                  <div className="post-author">
                    <div className="author-info">
                      <span className="author-name">
                        My Private Thought
                      </span>
                      <div className="privacy-badge-small">
                        <Lock className="lock-icon" />
                        <span>Private</span>
                      </div>
                    </div>
                    <span className="post-time">
                      {new Date(post.timestamp).toLocaleDateString()} at {new Date(post.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="post-actions">
                    <button
                      onClick={() => handleEditPost(post.id, post.content)}
                      className="btn btn-icon"
                      title="Edit post"
                    >
                      <Edit3 className="icon" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="btn btn-icon"
                      title="Delete post"
                    >
                      <Trash2 className="icon" />
                    </button>
                  </div>
                </div>
                <div className="post-content">
                  {editingPostId === post.id ? (
                    <textarea
                      value={editingPost || ''}
                      onChange={(e) => setEditingPost(e.target.value)}
                      className="edit-textarea"
                      rows={4}
                    />
                  ) : (
                    <p>{post.content}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VentPage;
