import React, { useEffect, useState } from 'react';
import { TitipesanMessage, PAPER_COLORS, AppRoute } from '../types';
import { audioManager } from '../utils/audio';
import { getMessageReactions, toggleReaction, MessageReactions } from '../utils/reactions';
import {
  Play,
  Pause,
  Music,
  Share2,
  Calendar,
  User,
  Shield,
  ArrowLeft,
  ExternalLink,
  Plus,
  Instagram,
} from 'lucide-react';

interface DetailPageProps {
  message: TitipesanMessage | null;
  onNavigate: (route: AppRoute) => void;
  onOpenShareSheet: (msg: TitipesanMessage) => void;
  onOpenStoryModal: (msg: TitipesanMessage) => void;
}

export const DetailPage: React.FC<DetailPageProps> = ({
  message,
  onNavigate,
  onOpenShareSheet,
  onOpenStoryModal,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(30);
  const [reactions, setReactions] = useState<MessageReactions>({ hug: 0, touch: 0, pray: 0 });

  useEffect(() => {
    if (message) {
      setReactions(getMessageReactions(message.id));
    }
  }, [message]);

  useEffect(() => {
    if (!message?.song?.previewUrl) return;

    const unsubscribe = audioManager.subscribe((state) => {
      const match = state.currentUrl === message.song?.previewUrl;
      setIsPlaying(Boolean(match && state.isPlaying));
      if (match) {
        setAudioProgress(state.progress);
        setAudioCurrentTime(state.currentTime);
        setAudioDuration(state.duration);
      }
    });

    return unsubscribe;
  }, [message?.song?.previewUrl]);

  if (!message) {
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-20 text-center">
        <h2 className="font-editorial text-3xl text-[#191817] mb-3">
          Surat tidak ditemukan.
        </h2>
        <p className="text-sm text-[#736E66] font-serif italic mb-6">
          Tautan mungkin tidak lengkap atau telah usang.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="px-5 py-2.5 bg-[#191817] text-[#FAF8F5] text-xs font-medium rounded-sm hover:bg-[#34302C] transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const handleToggleAudio = () => {
    if (!message.song?.previewUrl) return;
    audioManager.playPreview(message.song.previewUrl);
  };

  const handleReactionClick = (type: 'hug' | 'touch' | 'pray') => {
    const updated = toggleReaction(message.id, type);
    setReactions(updated);
  };

  const colorConfig =
    PAPER_COLORS.find((c) => c.id === message.color) || PAPER_COLORS[0];

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-14">
      {/* Top back affordance */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-meta text-[#7A756D] hover:text-[#191817] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </button>

        <button
          onClick={() => onNavigate('/create')}
          className="inline-flex items-center gap-1.5 text-xs font-meta text-[#7A756D] hover:text-[#191817] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Pesan Sendiri</span>
        </button>
      </div>

      {/* Big Authentic Paper Box */}
      <div
        style={{
          backgroundColor: colorConfig.bgHex,
          borderColor: colorConfig.borderHex,
        }}
        className="p-7 sm:p-12 rounded-sm border shadow-lg space-y-8"
      >
        {/* Paper Header: Recipient & Sender */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-[#191817]/10">
          <div>
            <span className="block text-[11px] font-meta uppercase text-[#878278] tracking-wider mb-1">
              Untuk
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl text-[#191817] leading-tight">
              {message.to}
            </h1>
          </div>

          <div className="sm:text-right">
            <span className="block text-[11px] font-meta uppercase text-[#878278] tracking-wider mb-1">
              Pengirim
            </span>
            <div className="flex items-center sm:justify-end gap-1.5 text-sm font-meta text-[#38342E]">
              <User className="w-4 h-4 text-[#8C867C]" />
              <span className="font-semibold">{message.from}</span>
            </div>
          </div>
        </div>

        {/* Message Body */}
        <div className="py-4">
          <blockquote className="font-handwritten text-[28px] sm:text-[36px] leading-relaxed text-[#1F1E1C] overflow-wrap-anywhere word-break-break-word whitespace-pre-line">
            “{message.message}”
          </blockquote>
        </div>

        {/* Music Player (if attached) */}
        {message.song && (
          <div className="p-4 sm:p-5 rounded-sm bg-[#191817]/[0.04] border border-[#191817]/8 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5 min-w-0">
                {message.song.artworkUrl100 ? (
                  <img
                    src={message.song.artworkUrl100}
                    alt={message.song.trackName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xs object-cover bg-[#E0D8CC] shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xs bg-[#E0D8CC] flex items-center justify-center text-[#555047] shrink-0">
                    <Music className="w-6 h-6" />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#191817] truncate">
                      {message.song.trackName}
                    </h3>
                    {message.song.trackViewUrl && (
                      <a
                        href={message.song.trackViewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#878278] hover:text-[#191817] p-0.5 transition-colors"
                        title="Buka di Apple Music"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-[#69645C] truncate">
                    {message.song.artistName}
                    {message.song.collectionName && (
                      <span> · {message.song.collectionName}</span>
                    )}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleAudio}
                className="flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-medium bg-[#191817] text-[#FBF9F5] hover:bg-[#34302C] transition-colors shrink-0 shadow-xs active:scale-[0.98]"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-white" />
                    <span>Jeda</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    <span>Putar</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2.5 pt-1 text-[11px] font-meta text-[#78736B]">
              <span>{formatSeconds(audioCurrentTime)}</span>
              <div className="flex-1 h-1.5 bg-[#191817]/10 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-[#191817] transition-all duration-100 ease-linear"
                  style={{ width: `${Math.min(audioProgress * 100, 100)}%` }}
                />
              </div>
              <span>{formatSeconds(audioDuration)}</span>
            </div>
          </div>
        )}

        {/* Reactions Section */}
        <div className="pt-2">
          <span className="block text-[11px] font-meta uppercase text-[#8C867C] tracking-wider mb-2.5">
            Titipkan Resonansi Rasa
          </span>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => handleReactionClick('hug')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-medium border transition-all active:scale-95 ${
                reactions.userReacted?.hug
                  ? 'bg-[#191817] text-white border-[#191817]'
                  : 'bg-white/60 hover:bg-white text-[#332F2A] border-[#191817]/12'
              }`}
            >
              <span>🤍 Titip Peluk</span>
              <span className="font-meta text-[11px] opacity-80">{reactions.hug}</span>
            </button>

            <button
              type="button"
              onClick={() => handleReactionClick('touch')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-medium border transition-all active:scale-95 ${
                reactions.userReacted?.touch
                  ? 'bg-[#191817] text-white border-[#191817]'
                  : 'bg-white/60 hover:bg-white text-[#332F2A] border-[#191817]/12'
              }`}
            >
              <span>✨ Tersentuh</span>
              <span className="font-meta text-[11px] opacity-80">{reactions.touch}</span>
            </button>

            <button
              type="button"
              onClick={() => handleReactionClick('pray')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-medium border transition-all active:scale-95 ${
                reactions.userReacted?.pray
                  ? 'bg-[#191817] text-white border-[#191817]'
                  : 'bg-white/60 hover:bg-white text-[#332F2A] border-[#191817]/12'
              }`}
            >
              <span>🕊️ Kirim Doa</span>
              <span className="font-meta text-[11px] opacity-80">{reactions.pray}</span>
            </button>
          </div>
        </div>

        {/* Paper Footer Info */}
        <div className="pt-6 border-t border-[#191817]/10 flex flex-wrap items-center justify-between gap-4 text-xs font-meta text-[#7D786F]">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Dititipkan pada {message.date}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#5F5A52]">
            <Shield className="w-3.5 h-3.5 text-[#8F8A80]" />
            <span>Pesan anonim tanpa identitas asli</span>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenShareSheet(message)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-medium border border-[#191817]/20 bg-white/70 hover:bg-white text-[#191817] transition-colors shadow-xs active:scale-[0.98]"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Salin tautan pesan ini</span>
            </button>

            <button
              onClick={() => onOpenStoryModal(message)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-sm text-xs font-medium border border-[#191817]/20 bg-[#FAF7F0] hover:bg-white text-[#191817] transition-colors shadow-xs active:scale-[0.98]"
            >
              <Instagram className="w-3.5 h-3.5 text-[#A84B78]" />
              <span>Kartu Story IG</span>
            </button>
          </div>

          <button
            onClick={() => onNavigate('/create')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#191817] text-[#FAF8F5] text-xs font-medium rounded-sm hover:bg-[#322F2C] transition-colors shadow-xs active:scale-[0.98]"
          >
            <span>Tulis Pesan untuk Seseorang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
