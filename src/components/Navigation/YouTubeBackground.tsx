import React from 'react';

interface YouTubeBackgroundProps {
  videoId: string;
  isActive: boolean;
}

const YouTubeBackground: React.FC<YouTubeBackgroundProps> = ({ videoId, isActive }) => {
  if (!isActive) return null;

  return (
    <>
      {/* Video thumbnail with animation effect */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1000,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '120%',
            backgroundImage: `url('https://img.youtube.com/vi/${videoId}/maxresdefault.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(1px)',
            animation: 'videoPulse 4s ease-in-out infinite'
          }}
        />
        
        {/* Simulated video effect overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
            animation: 'shimmer 3s ease-in-out infinite'
          }}
        />
      </div>
      
      {/* Gradient overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -999,
          pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.7), rgba(118, 75, 162, 0.7))'
        }}
      />

      {/* Add CSS animations */}
      <style>{`
        @keyframes videoPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
};

export default YouTubeBackground;
