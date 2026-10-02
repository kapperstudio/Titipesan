import React, { useRef, useState, useEffect } from 'react';
import { TitipesanMessage, PAPER_COLORS } from '../types';
import { audioManager } from '../utils/audio';
import { Play, Pause, Music, ArrowUpRight } from 'lucide-react';

interface MarqueeSectionProps {
  messages: TitipesanMessage[];
  onOpenDetail: (msg: TitipesanMessage) => void;
}

export const MarqueeSection: React.FC<MarqueeSectionProps> = ({
  messages,
  onOpenDetail,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [activeSongUrl, setActiveSongUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((state) => {
      setActiveSongUrl(state.currentUrl);
      setIsPlayingAudio(state.isPlaying);
    });
    return unsubscribe;
  }, []);

  // Ensure we have enough items for a continuous seamless loop
  const displayList = messages.length > 0 ? messages : [];
  const loopList = [...displayList, ...displayList, ...displayList];

  return (
    <section className="w-full overflow-hidden py-6 select-none relative group/marquee">
      {/* Top Section Header */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-6 flex items-end justify-between border-b border-[#EAE3D5] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-meta text-[#8C867C] uppercase tracking-wider">
              Pesan yang sedang berlayar
            </span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#191817]">
            Arsip yang mengalir tanpa henti
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="text-[11px] font-meta text-[#736E65] hover:text-[#191817] bg-[#F3EEE3] px-2.5 py-1 rounded-xs border border-[#E0D8CA] transition-colors"
          >
            {isPaused ? '▶ Lanjutkan Aliran' : '⏸ Jeda Aliran'}
          </button>
        </div>
      </div>

      {/* Edge gradient scrims for smooth fade */}
      <div className="pointer-events-none absolute left-0 top-18 bottom-0 w-12 sm:w-24 z-10 bg-gradient-to-r from-[#FBF9F5] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-18 bottom-0 w-12 sm:w-24 z-10 bg-gradient-to-l from-[#FBF9F5] to-transparent" />

      {/* Marquee Track */}
      <div
        ref={marqueeTrackRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex gap-6 sm:gap-8 w-max px-4 py-4"
        style={{
          animation: `titipesan-marquee ${Math.max(loopList.length * 5, 45)}s linear infinite`,
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        {loopList.map((msg, idx) => {
          const colorConfig =
            PAPER_COLORS.find((c) => c.id === msg.color) || PAPER_COLORS[0];
          const isThisPlaying =
            isPlayingAudio && activeSongUrl === msg.song?.previewUrl;

          // 4-cycle rotation
          const rotDegree =
            idx % 4 === 0
              ? '-1.2deg'
              : idx % 4 === 1
              ? '0.9deg'
              : idx % 4 === 2
              ? '0.4deg'
              : '-0.7deg';

          return (
            <div
              key={`${msg.id}-${idx}`}
              tabIndex={0}
              role="button"
              aria-label={`Buka pesan untuk ${msg.to}`}
              onClick={() => onOpenDetail(msg)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenDetail(msg);
                }
              }}
              style={{
                backgroundColor: colorConfig.bgHex,
                borderColor: colorConfig.borderHex,
                transform: `rotate(${rotDegree})`,
              }}
              className="w-[280px] sm:w-[320px] shrink-0 p-5 sm:p-6 rounded-sm border shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between hover:scale-[1.02] hover:rotate-0!"
            >
              {/* Card Top */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[#191817]/8 text-[11px] font-meta text-[#7A756D]">
                <span className="uppercase tracking-wider">
                  #{String((idx % displayList.length) + 1).padStart(2, '0')}
                </span>
                <span>{msg.date}</span>
              </div>

              {/* Card Quote */}
              <div className="my-4 flex-1">
                <blockquote className="font-handwritten text-[22px] sm:text-[24px] leading-relaxed text-[#23211F] line-clamp-4 overflow-wrap-anywhere">
                  “{msg.message}”
                </blockquote>
              </div>

              {/* Music Pill if any */}
              {msg.song && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (msg.song?.previewUrl) {
                      audioManager.playPreview(msg.song.previewUrl);
                    }
                  }}
                  className="mb-3 p-2 bg-[#191817]/4 hover:bg-[#191817]/8 transition-colors rounded-xs flex items-center gap-2.5"
                  title={isThisPlaying ? 'Jeda preview' : 'Putar preview'}
                >
                  {msg.song.artworkUrl100 ? (
                    <img
                      src={msg.song.artworkUrl100}
                      alt={msg.song.trackName}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-xs object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 bg-[#E0D8CC] rounded-xs flex items-center justify-center text-[#555047] shrink-0">
                      <Music className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-[#191817] truncate leading-tight">
                      {msg.song.trackName}
                    </p>
                    <p className="text-[10px] text-[#7A756D] truncate">
                      {msg.song.artistName}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={isThisPlaying ? 'Jeda' : 'Putar'}
                    className="p-1 text-[#4F4A42]"
                  >
                    {isThisPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                  </button>
                </div>
              )}

              {/* Card Bottom */}
              <div className="pt-2.5 border-t border-[#191817]/8 flex items-center justify-between text-xs text-[#615C54]">
                <div className="truncate pr-2">
                  <span className="font-meta text-[11px] text-[#8C867C]">Untuk </span>
                  <span className="font-medium text-[#191817] truncate">
                    {msg.to}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-meta text-[11px] text-[#78736B] shrink-0">
                  <span>Buka</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
