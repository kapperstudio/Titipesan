import React, { useEffect, useState } from 'react';
import { audioManager } from '../utils/audio';
import { Play, Pause, X, Music, Volume2 } from 'lucide-react';
import { TitipesanMessage } from '../types';

interface FloatingAudioBarProps {
  currentMessage: TitipesanMessage | null;
  onOpenMessage: (msg: TitipesanMessage) => void;
}

export const FloatingAudioBar: React.FC<FloatingAudioBarProps> = ({
  currentMessage,
  onOpenMessage,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setCurrentUrl(state.currentUrl);
      setProgress(state.progress);
    });
    return unsubscribe;
  }, []);

  if (!currentUrl) return null;

  const song = currentMessage?.song;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-8 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-auto bg-[#191817]/95 text-[#FAF7F2] backdrop-blur-md rounded-md border border-[#3E3932] shadow-2xl p-3 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-200">
      {/* Artwork or Icon */}
      <div
        onClick={() => currentMessage && onOpenMessage(currentMessage)}
        className="w-10 h-10 rounded-xs bg-[#2F2B26] overflow-hidden shrink-0 cursor-pointer flex items-center justify-center relative group"
      >
        {song?.artworkUrl100 ? (
          <img
            src={song.artworkUrl100}
            alt={song.trackName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <Music className="w-4 h-4 text-[#A8A194]" />
        )}
        {isPlaying && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Volume2 className="w-3.5 h-3.5 text-white animate-pulse" />
          </div>
        )}
      </div>

      {/* Info */}
      <div
        onClick={() => currentMessage && onOpenMessage(currentMessage)}
        className="min-w-0 flex-1 cursor-pointer"
      >
        <p className="text-xs font-semibold text-[#F7F4EC] truncate">
          {song?.trackName || 'Cuplikan Musik'}
        </p>
        <p className="text-[11px] text-[#A69E90] truncate">
          {song?.artistName || 'Apple Music Preview'}
        </p>

        {/* Mini progress line */}
        <div className="w-full h-1 bg-[#3A352F] rounded-full overflow-hidden mt-1.5">
          <div
            className="h-full bg-[#E5DFD3] transition-all duration-150"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => audioManager.togglePreview()}
          className="p-2 text-[#E5DFD3] hover:text-white transition-colors"
          aria-label={isPlaying ? 'Jeda musik' : 'Lanjutkan musik'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
        </button>

        <button
          type="button"
          onClick={() => audioManager.stopPreview()}
          className="p-1.5 text-[#8A8275] hover:text-[#E5DFD3] transition-colors"
          aria-label="Tutup pemutar musik"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
