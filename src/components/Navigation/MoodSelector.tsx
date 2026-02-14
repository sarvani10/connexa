import React, { useState } from 'react';
import { CloudRain, Flame, Smile, Waves, Home } from 'lucide-react';

type Mood = 'sad' | 'angry' | 'happy' | 'calm' | 'default' | null;

interface MoodSelectorProps {
  onMoodChange: (mood: Mood) => void;
  currentMood: Mood;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodChange, currentMood }) => {
  const [isOpen, setIsOpen] = useState(false);

  const moods = [
    {
      value: 'sad' as Mood,
      label: 'Sad',
      icon: CloudRain,
      theme: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        animation: 'rain',
        description: 'Soft blue theme with rain animation'
      }
    },
    {
      value: 'angry' as Mood,
      label: 'Angry',
      icon: Flame,
      theme: {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        animation: 'fire',
        description: 'Dark red theme with fire animation'
      }
    },
    {
      value: 'happy' as Mood,
      label: 'Happy',
      icon: Smile,
      theme: {
        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        animation: 'particles',
        description: 'Bright yellow theme with floating particles'
      }
    },
    {
      value: 'calm' as Mood,
      label: 'Calm',
      icon: Waves,
      theme: {
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        animation: 'waves',
        description: 'Soft green theme with smooth gradient waves'
      }
    },
    {
      value: 'default' as Mood,
      label: 'Default',
      icon: Home,
      theme: {
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        animation: 'none',
        description: 'Default theme with no animations'
      }
    }
  ];

  const handleMoodSelect = (mood: Mood) => {
    onMoodChange(mood);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-violet-300 hover:shadow-sm transition-all duration-200"
      >
        {currentMood ? (
          <>
            {(() => {
              const Icon = moods.find(m => m.value === currentMood)?.icon;
              return Icon ? <Icon className="w-4 h-4 text-violet-600" /> : null;
            })()}
            <span className="text-sm font-medium text-gray-700 capitalize">{currentMood}</span>
          </>
        ) : (
          <>
            <Smile className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-500">Mood</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
          <div className="p-2">
            {moods.map((mood) => {
              const Icon = mood.icon;
              const isActive = mood.value === currentMood;
              
              return (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood.value)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-violet-50 text-violet-700 border border-violet-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: mood.theme.background }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{mood.label}</div>
                    <div className="text-xs text-gray-500">{mood.theme.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodSelector;
