import { useState } from 'react';

const TipCard = ({ tip }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get the message - could be in message field or allMessages array
  const displayMessage = tip.message || 
    (tip.allMessages && tip.allMessages.length > 0 
      ? (typeof tip.allMessages[0] === 'string' 
          ? tip.allMessages[0] 
          : tip.allMessages[0]?.message || tip.allMessages.find(m => m.language === 'EN')?.message)
      : '') ||
    tip.key;

  // Get localized messages if available
  const localizedMessages = tip.allMessages || [];
  const hasMultipleLanguages = localizedMessages.length > 1;

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  // Color schemes based on tip type or random for variety
  const colorSchemes = [
    { gradient: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700' },
    { gradient: 'from-orange-400 to-amber-500', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' },
    { gradient: 'from-blue-400 to-cyan-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
    { gradient: 'from-purple-400 to-pink-500', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
    { gradient: 'from-green-400 to-emerald-500', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
  ];

  // Select color scheme based on tip id or index
  const colorIndex = (tip.id?.charCodeAt(0) || 0) % colorSchemes.length;
  const colors = colorSchemes[colorIndex];

  return (
    <div 
      className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 ${colors.border} transform hover:-translate-y-2 overflow-hidden`}
      onClick={handleClick}
    >
      {/* Gradient Header */}
      <div className={`bg-gradient-to-r ${colors.gradient} p-6`}>
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg`}>
            <span className="text-3xl">{tip.uiHints?.glyph || tip.uiHints?.icon || '💡'}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">
              {tip.key?.replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Nutrition Tip'}
            </h3>
            {tip.triggerEvent && (
              <span className={`inline-block px-3 py-1 ${colors.badge} text-xs font-semibold rounded-full shadow-sm`}>
                {tip.triggerEvent}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className={`${colors.text} mb-4 leading-relaxed text-base`}>{displayMessage}</p>
        
        {isExpanded && hasMultipleLanguages && (
          <div className={`mt-4 pt-4 border-t-2 ${colors.border} space-y-3 animate-fadeIn`}>
            <p className={`text-sm font-bold ${colors.text} mb-3 flex items-center`}>
              <span className="mr-2">🌍</span>
              Available in other languages:
            </p>
            {localizedMessages.map((msg, idx) => {
              const lang = typeof msg === 'object' ? msg.language : 'EN';
              const text = typeof msg === 'object' ? msg.message : msg;
              if (lang === 'EN' && displayMessage === text) return null;
              return (
                <div key={idx} className={`text-sm ${colors.text} bg-white/50 rounded-lg p-3 border ${colors.border}`}>
                  <span className="font-bold">{lang}:</span> {text}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          {hasMultipleLanguages && (
            <button 
              className={`text-sm font-semibold ${colors.text} hover:underline flex items-center`}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              {isExpanded ? (
                <>
                  <span className="mr-1">▲</span> Collapse
                </>
              ) : (
                <>
                  <span className="mr-1">▼</span> See More Languages
                </>
              )}
            </button>
          )}
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.gradient} ${!hasMultipleLanguages ? 'ml-auto' : ''}`}></div>
        </div>
      </div>
    </div>
  );
};

export default TipCard;

