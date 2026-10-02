import React, { useState, useEffect } from 'react';
import { TitipesanMessage, PAPER_COLORS } from '../types';
import { audioManager } from '../utils/audio';
import { Play, Pause, Music, ArrowUpRight } from 'lucide-react';

interface PaperCardProps {
  message: TitipesanMessage;
  index: number;
  onOpenDetail: (msg: TitipesanMessage) => void;
  disableRotation?: boolean;
}

export const PaperCard: React.FC<PaperCardProps> = ({
  message,
  index,
  onOpenDetail,
  disableRotation = false,
}) => {
  const [isPlayingThis, setIsPlayingThis] = useState(false);

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((state) => {
      const match = message.song?.previewUrl && state.currentUrl === message.song.previewUrl;
      setIsPlayingThis(Boolean(match && state.isPlaying));
    });
    return unsubscribe;
  }, [message.song?.previewUrl]);

  const colorConfig =
    PAPER_COLORS.find((c) => c.id === message.color) || PAPER_COLORS[0];

  const handleAudioClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!message.song?.previewUrl) return;
    audioManager.playPreview(message.song.previewUrl);
  };

  const padNum = String(index + 1).padStart(2, '0');

  // 4-cycle subtle rotation
  const rotationClass = disableRotation
    ? ''
    : index % 4 === 0
    ? 'paper-rotate-1'
    : index % 4 === 1
    ? 'paper-rotate-2'
    : index % 4 === 2
    ? 'paper-rotate-3'
    : 'paper-rotate-4';

  return (
    <article
      tabIndex={0}
      role="button"
      aria-label={`Buka pesan untuk ${message.to}`}
      onClick={() => onOpenDetail(message)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetail(message);
        }
      }}
      style={{
        backgroundColor: colorConfig.bgHex,
        borderColor: colorConfig.borderHex,
      }}
      className={`paper-card ${rotationClass} paper-item relative flex flex-col justify-between p-6 sm:p-7 rounded-sm border shadow-xs hover:shadow-md cursor-pointer text-left select-none outline-none group`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#191817]/8 text-xs font-meta text-[#7A756D]">
        <span className="tracking-wider uppercase">Pesan #{padNum}</span>
        <span>{message.date}</span>
      </div>

      {/* Message Body */}
      <div className="my-5 flex-1">
        <blockquote className="font-handwritten text-[22px] sm:text-[25px] leading-relaxed text-[#23211F] overflow-wrap-anywhere word-break-break-word">
          “{message.message}”
        </blockquote>
      </div>

      {/* Song Section (if present) */}
      {message.song && (
        <div
          onClick={handleAudioClick}
          className="mb-4 flex items-center gap-3 p-2 bg-[#191817]/4 hover:bg-[#191817]/8 transition-colors rounded-sm text-left group/song"
          title={isPlayingThis ? 'Jeda preview musik' : 'Putar preview musik'}
          role="button"
          tabIndex={-1}
        >
          {message.song.artworkUrl100 ? (
            <div className="relative w-9 h-9 shrink-0 rounded-xs overflow-hidden bg-[#E2DBD0]">
              <img
                src={message.song.artworkUrl100}
                alt={message.song.trackName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-80 group-hover/song:opacity-100 transition-opacity">
                {isPlayingThis ? (
                  <Pause className="w-3.5 h-3.5 text-white fill-white" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                )}
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 shrink-0 rounded-xs bg-[#E2DBD0] flex items-center justify-center text-[#555047]">
              <Music className="w-4 h-4" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-[#191817] truncate leading-tight">
              {message.song.trackName}
            </p>
            <p className="text-[11px] text-[#78736B] truncate">
              {message.song.artistName}
            </p>
          </div>

          <button
            type="button"
            aria-label={isPlayingThis ? 'Pause' : 'Play'}
            className="p-1.5 text-[#59544C] group-hover/song:text-[#191817] transition-colors"
          >
            {isPlayingThis ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
          </button>
        </div>
      )}

      {/* Footer Details */}
      <div className="pt-3 border-t border-[#191817]/8 flex items-center justify-between text-xs text-[#615C54]">
        <div className="flex items-center gap-1.5 truncate pr-2">
          <span className="font-meta text-[#8F8A80]">Untuk</span>
          <span className="text-[#8F8A80]">·</span>
          <span className="font-medium text-[#191817] truncate">
            {message.to}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-meta text-[#78736B] group-hover:text-[#191817] transition-colors shrink-0">
          <span>Detail</span>
          <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </article>
  );
};
