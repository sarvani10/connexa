import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Trash2, Download, Users, Volume2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/VoiceChat.css';

interface VoiceMessage {
  id: string;
  audioUrl: string;
  duration: number;
  timestamp: Date;
  authorId: string;
  authorName: string;
  isPlaying: boolean;
}

const VoiceChat: React.FC = () => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRefsRef = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`voiceMessages_${user?.id || 'anonymous'}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [user?.id]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`voiceMessages_${user?.id || 'anonymous'}`, JSON.stringify(messages));
    }
  }, [messages, user?.id]);

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
          
          setMessages(prev => [message, ...prev]);
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

  const playMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
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
        setMessages(prev => prev.map(m => 
          m.id === messageId ? { ...m, isPlaying: true } : { ...m, isPlaying: false }
        ));
      } else {
        audio.pause();
        setCurrentPlayingId(null);
        setMessages(prev => prev.map(m => 
          m.id === messageId ? { ...m, isPlaying: false } : m
        ));
      }
    }
  };

  const handleAudioEnded = (messageId: string) => {
    setCurrentPlayingId(null);
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, isPlaying: false } : m
    ));
  };

  const deleteMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
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
      
      setMessages(prev => prev.filter(m => m.id !== messageId));
    }
  };

  const downloadMessage = (message: VoiceMessage) => {
    const a = document.createElement('a');
    a.href = message.audioUrl;
    a.download = `voice-message-${message.id}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const clearAllMessages = () => {
    if (window.confirm('Are you sure you want to delete all voice messages? This cannot be undone.')) {
      // Clean up all audio URLs and elements
      messages.forEach(message => {
        URL.revokeObjectURL(message.audioUrl);
        const audio = audioRefsRef.current[message.id];
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
      
      audioRefsRef.current = {};
      setMessages([]);
      localStorage.removeItem(`voiceMessages_${user?.id || 'anonymous'}`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="voice-chat">
      <div className="voice-chat-header">
        <div className="header-content">
          <div className="header-title">
            <h1 className="voice-title">Voice Chat</h1>
            <div className="voice-badge">
              <Mic className="mic-icon" />
              <span>Voice Messages</span>
            </div>
          </div>
          <p className="voice-description">
            Record and manage your voice messages privately
          </p>
        </div>
        <div className="voice-stats">
          <div className="stat-item">
            <Users className="stat-icon" />
            <span className="stat-number">{messages.length}</span>
            <span className="stat-label">Messages</span>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearAllMessages}
              className="btn btn-danger"
              title="Clear all messages"
            >
              <Trash2 className="icon" />
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="voice-chat-content">
        {/* Recording Section */}
        <div className="recording-section">
          <div className="recording-header">
            <h3>Record Voice Message</h3>
            <div className="recording-info">
              {isRecording && (
                <div className="recording-time">
                  <div className="recording-indicator"></div>
                  <span>{formatTime(recordingTime)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="recording-controls">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="btn btn-record"
                title="Start recording"
              >
                <Mic className="icon" />
                Start Recording
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
              </div>
            )}
          </div>
        </div>

        {/* Messages Section */}
        <div className="messages-section">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Mic className="icon" />
              </div>
              <h3>No voice messages yet</h3>
              <p>Start by recording your first voice message above. Your messages are private and stored locally.</p>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map(message => (
                <div key={message.id} className="voice-message">
                  <div className="message-header">
                    <div className="message-author">
                      <span className="author-name">{message.authorName}</span>
                      <span className="message-time">
                        {new Date(message.timestamp).toLocaleDateString()} at {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="message-actions">
                      <button
                        onClick={() => downloadMessage(message)}
                        className="btn btn-icon"
                        title="Download message"
                      >
                        <Download className="icon" />
                      </button>
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className="btn btn-icon"
                        title="Delete message"
                      >
                        <Trash2 className="icon" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="message-content">
                    <div className="audio-player">
                      <button
                        onClick={() => playMessage(message.id)}
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
                      <Volume2 className="volume-icon" />
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
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
