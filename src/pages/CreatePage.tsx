import React, { useState, useEffect, useRef } from 'react';
import {
  TitipesanMessage,
  TitipesanSong,
  PaperColor,
  PAPER_COLORS,
  AppRoute,
} from '../types';
import { saveNewMessage, getExistingAliases } from '../utils/storage';
import { getBrowserAlias } from '../utils/alias';
import { audioManager } from '../utils/audio';
import {
  Search,
  Music,
  Play,
  Pause,
  X,
  Check,
  Send,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface CreatePageProps {
  onMessageCreated: (msg: TitipesanMessage) => void;
  onNavigate: (route: AppRoute) => void;
}

export const CreatePage: React.FC<CreatePageProps> = ({
  onMessageCreated,
  onNavigate,
}) => {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState<PaperColor>('Warm Paper');
  const [selectedSong, setSelectedSong] = useState<TitipesanSong | null>(null);

  // Form validation errors
  const [errors, setErrors] = useState<{ recipient?: string; message?: string }>({});

  // Sender alias
  const [senderAlias, setSenderAlias] = useState('');

  // iTunes music search state
  const [musicQuery, setMusicQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TitipesanSong[]>([]);
  const [isSearchingMusic, setIsSearchingMusic] = useState(false);
  const [musicSearchError, setMusicSearchError] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // Audio preview playing state for song search
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    const existing = getExistingAliases();
    const alias = getBrowserAlias(existing);
    setSenderAlias(alias);

    try {
      const url = new URL(window.location.href);
      let toParam = url.searchParams.get('to');
      if (!toParam && window.location.hash.includes('to=')) {
        const hashQuery = window.location.hash.split('?')[1];
        if (hashQuery) {
          const sp = new URLSearchParams(hashQuery);
          toParam = sp.get('to');
        }
      }
      if (toParam && toParam.trim()) {
        setRecipient(toParam.trim());
      }
    } catch {}
  }, []);

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((state) => {
      setActivePreviewUrl(state.currentUrl);
      setIsPlayingAudio(state.isPlaying);
    });
    return unsubscribe;
  }, []);

  // Cleanup audio preview when leaving create page
  useEffect(() => {
    return () => {
      audioManager.stopPreview();
    };
  }, []);

  // iTunes Search Handler
  const handleSearchChange = (q: string) => {
    setMusicQuery(q);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!q.trim()) {
      setSearchResults([]);
      setIsSearchingMusic(false);
      return;
    }

    setIsSearchingMusic(true);
    setMusicSearchError(null);
    setSearchOpen(true);

    debounceTimer.current = window.setTimeout(async () => {
      try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
          q.trim()
        )}&entity=song&limit=8&country=ID`;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Gagal mengambil data lagu dari iTunes.');
        }

        const data = await res.json();
        if (data.results && Array.isArray(data.results)) {
          const songs: TitipesanSong[] = data.results.map((item: any) => ({
            trackId: item.trackId,
            trackName: item.trackName || 'Lagu Tanpa Judul',
            artistName: item.artistName || 'Artis',
            collectionName: item.collectionName || '',
            artworkUrl100: item.artworkUrl100
              ? item.artworkUrl100.replace('100x100bb', '200x200bb')
              : undefined,
            previewUrl: item.previewUrl || undefined,
            trackViewUrl: item.trackViewUrl || undefined,
          }));
          setSearchResults(songs);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.warn('iTunes API error:', err);
        setMusicSearchError('Koneksi pencarian musik terganggu. Coba kata lain.');
        setSearchResults([]);
      } finally {
        setIsSearchingMusic(false);
      }
    }, 450);
  };

  const handleSelectSong = (song: TitipesanSong) => {
    setSelectedSong(song);
    setSearchOpen(false);
    setMusicQuery('');
  };

  const handleRemoveSong = () => {
    audioManager.stopPreview();
    setSelectedSong(null);
  };

  const handlePreviewAudio = (e: React.MouseEvent, previewUrl?: string) => {
    e.stopPropagation();
    if (!previewUrl) return;
    audioManager.playPreview(previewUrl);
  };

  // Format date in Indonesian locale (e.g. "02 Okt 2026")
  const getFormattedDate = () => {
    const d = new Date();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { recipient?: string; message?: string } = {};
    if (!recipient.trim()) {
      newErrors.recipient = 'Nama penerima tidak boleh kosong.';
    }
    if (!message.trim()) {
      newErrors.message = 'Isi pesan tidak boleh kosong.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const newMessage: TitipesanMessage = {
      id: 'tp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      to: recipient.trim(),
      message: message.trim(),
      color: selectedColor,
      song: selectedSong,
      from: senderAlias,
      date: getFormattedDate(),
      createdAt: Date.now(),
    };

    saveNewMessage(newMessage);
    onMessageCreated(newMessage);
  };

  const currentColorConfig =
    PAPER_COLORS.find((c) => c.id === selectedColor) || PAPER_COLORS[0];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      {/* Page Header */}
      <div className="max-w-3xl mb-10">
        <span className="text-xs font-meta text-[#8C867C] uppercase tracking-wider block mb-2">
          Buat Pesan
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl text-[#191817] leading-tight mb-3">
          Tulis surat tanpa rasa ragu.
        </h1>
        <p className="text-sm text-[#666159] leading-relaxed">
          Pesanmu akan terbungkus dalam lembaran kertas bertekstur lembut dan
          diantar hanya dengan nama samaran.
        </p>
      </div>

      {/* Main Creation Grid: Form on Left, Realtime Paper Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Form (7 cols) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-[#FAF7F0] p-6 sm:p-8 rounded-sm border border-[#E8E1D3] shadow-xs space-y-7"
        >
          {/* Recipient Field */}
          <div>
            <label
              htmlFor="recipient-input"
              className="block text-xs font-meta uppercase tracking-wider text-[#544F47] mb-2"
            >
              Untuk siapa pesan ini? <span className="text-stone-400">*</span>
            </label>
            <input
              id="recipient-input"
              type="text"
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                if (errors.recipient) setErrors({ ...errors, recipient: undefined });
              }}
              placeholder="Nama penerima..."
              className="w-full px-4 py-3 bg-[#FCFBF7] border border-[#DDD5C5] rounded-sm text-sm text-[#191817] placeholder:text-[#9C968B] transition-colors"
            />
            {errors.recipient && (
              <p className="mt-1.5 text-xs text-[#9E3E3E] font-medium">
                {errors.recipient}
              </p>
            )}
          </div>

          {/* Paper Color Selection */}
          <div>
            <label className="block text-xs font-meta uppercase tracking-wider text-[#544F47] mb-2.5">
              Pilihan Kertas
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PAPER_COLORS.map((col) => {
                const isSelected = selectedColor === col.id;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedColor(col.id)}
                    style={{ backgroundColor: col.bgHex, borderColor: col.borderHex }}
                    className={`flex items-center justify-between p-2.5 rounded-sm border text-xs font-medium text-[#2E2B27] transition-all text-left ${
                      isSelected
                        ? 'ring-2 ring-[#191817] shadow-xs'
                        : 'hover:brightness-98 opacity-90 hover:opacity-100'
                    }`}
                  >
                    <span className="truncate">{col.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#191817] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="message-textarea"
                className="text-xs font-meta uppercase tracking-wider text-[#544F47]"
              >
                Pesan <span className="text-stone-400">*</span>
              </label>
              <span className="text-[11px] font-meta text-[#8C867C]">
                {message.length} karakter
              </span>
            </div>
            <textarea
              id="message-textarea"
              rows={6}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors({ ...errors, message: undefined });
              }}
              placeholder="Tulis sesuatu yang mungkin ingin mereka baca suatu hari nanti..."
              className="w-full px-4 py-3 bg-[#FCFBF7] border border-[#DDD5C5] rounded-sm text-sm text-[#191817] placeholder:text-[#9C968B] transition-colors resize-y leading-relaxed font-ui"
            />
            {errors.message && (
              <p className="mt-1.5 text-xs text-[#9E3E3E] font-medium">
                {errors.message}
              </p>
            )}
          </div>

          {/* Music Search from iTunes */}
          <div className="relative">
            <label className="block text-xs font-meta uppercase tracking-wider text-[#544F47] mb-2">
              Musik Pengiring (iTunes)
            </label>

            {/* Selected Song Badge */}
            {selectedSong ? (
              <div className="p-3 bg-[#FCFBF7] border border-[#DDD5C5] rounded-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {selectedSong.artworkUrl100 ? (
                    <img
                      src={selectedSong.artworkUrl100}
                      alt={selectedSong.trackName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xs object-cover bg-[#E5DFD3] shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xs bg-[#E5DFD3] flex items-center justify-center text-[#555047] shrink-0">
                      <Music className="w-4 h-4" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#191817] truncate">
                      {selectedSong.trackName}
                    </p>
                    <p className="text-[11px] text-[#78736B] truncate">
                      {selectedSong.artistName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {selectedSong.previewUrl && (
                    <button
                      type="button"
                      onClick={(e) => handlePreviewAudio(e, selectedSong.previewUrl)}
                      className="p-1.5 text-[#544F47] hover:text-[#191817] rounded-sm transition-colors"
                      title={
                        isPlayingAudio && activePreviewUrl === selectedSong.previewUrl
                          ? 'Jeda'
                          : 'Dengarkan'
                      }
                    >
                      {isPlayingAudio && activePreviewUrl === selectedSong.previewUrl ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveSong}
                    className="p-1.5 text-[#78736B] hover:text-[#9E3E3E] rounded-sm transition-colors"
                    title="Hapus lagu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={musicQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => {
                      if (searchResults.length > 0) setSearchOpen(true);
                    }}
                    placeholder="Cari lagu di Apple Music (cth: Tulus, Banda Neira)..."
                    className="w-full pl-9 pr-4 py-2.5 bg-[#FCFBF7] border border-[#DDD5C5] rounded-sm text-xs text-[#191817] placeholder:text-[#9C968B] transition-colors"
                  />
                  <Search className="w-4 h-4 text-[#8C867C] absolute left-3 pointer-events-none" />
                  {isSearchingMusic && (
                    <div className="absolute right-3 text-[11px] font-meta text-[#8C867C]">
                      Mencari...
                    </div>
                  )}
                </div>

                {/* Music Search Dropdown */}
                {searchOpen && (searchResults.length > 0 || musicSearchError) && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-[#FCFAF5] border border-[#DDD5C5] rounded-sm shadow-lg max-h-60 overflow-y-auto p-1.5 space-y-1">
                    {musicSearchError ? (
                      <div className="p-3 text-xs text-[#9E3E3E] text-center">
                        {musicSearchError}
                      </div>
                    ) : (
                      searchResults.map((song) => {
                        const isThisPlaying =
                          isPlayingAudio && activePreviewUrl === song.previewUrl;
                        return (
                          <div
                            key={song.trackId || song.trackName + song.artistName}
                            onClick={() => handleSelectSong(song)}
                            className="flex items-center justify-between p-2 rounded-sm hover:bg-[#F2ECE1] cursor-pointer transition-colors group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              {song.artworkUrl100 ? (
                                <img
                                  src={song.artworkUrl100}
                                  alt={song.trackName}
                                  referrerPolicy="no-referrer"
                                  className="w-8 h-8 rounded-xs object-cover bg-[#E5DFD3] shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-xs bg-[#E5DFD3] flex items-center justify-center text-[#555047] shrink-0">
                                  <Music className="w-3.5 h-3.5" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-[#191817] truncate">
                                  {song.trackName}
                                </p>
                                <p className="text-[11px] text-[#7A756D] truncate">
                                  {song.artistName}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {song.previewUrl && (
                                <button
                                  type="button"
                                  onClick={(e) => handlePreviewAudio(e, song.previewUrl)}
                                  className="p-1 text-[#69645C] hover:text-[#191817] transition-colors"
                                  title={isThisPlaying ? 'Jeda' : 'Audisi cuplikan'}
                                >
                                  {isThisPlaying ? (
                                    <Pause className="w-3.5 h-3.5 fill-current" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Alias Notice */}
          <div className="pt-2 border-t border-[#E8E1D3] flex items-center justify-between text-xs text-[#706B62]">
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="font-meta text-[#8C867C]">Nama Samaranmu:</span>
              <span className="font-meta font-medium text-[#191817] truncate">
                {senderAlias || 'Memuat...'}
              </span>
            </div>
            <span
              className="text-[#8C867C] hover:text-[#191817] cursor-help shrink-0"
              title="Identitas aslimu tidak pernah diminta atau disimpan. Nama samaran ini acak dan unik untuk browsermu."
            >
              <HelpCircle className="w-4 h-4" />
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-[#191817] text-[#FAF8F5] hover:bg-[#34302C] text-sm font-medium rounded-sm transition-colors shadow-xs active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>Titipkan Pesan Ini</span>
            </button>
          </div>
        </form>

        {/* Right: Realtime Paper Live Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-3">
          <div className="flex items-center justify-between text-xs font-meta text-[#8C867C] px-1">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pratinjau Kertas Realtime</span>
            </span>
            <span>{selectedColor}</span>
          </div>

          {/* Authentic Paper Container */}
          <div
            style={{
              backgroundColor: currentColorConfig.bgHex,
              borderColor: currentColorConfig.borderHex,
            }}
            className="p-7 sm:p-8 rounded-sm border shadow-md flex flex-col justify-between min-h-[380px] transition-colors"
          >
            {/* Paper Top */}
            <div className="flex items-center justify-between pb-3 border-b border-[#191817]/10 text-xs font-meta text-[#7A756D]">
              <span className="uppercase tracking-wider">Pesan Baru</span>
              <span>{getFormattedDate()}</span>
            </div>

            {/* Handwritten Message */}
            <div className="my-6 flex-1">
              <p className="font-handwritten text-[24px] sm:text-[27px] leading-relaxed text-[#23211F] overflow-wrap-anywhere word-break-break-word whitespace-pre-line">
                {message.trim() ? (
                  `“${message}”`
                ) : (
                  <span className="text-[#8C867C] italic opacity-75">
                    “Tulis sesuatu di samping, dan kata-katamu akan muncul di lembaran kertas ini...”
                  </span>
                )}
              </p>
            </div>

            {/* Attached Song Preview */}
            {selectedSong && (
              <div className="mb-4 p-2.5 bg-[#191817]/4 border border-[#191817]/6 rounded-xs flex items-center gap-2.5">
                {selectedSong.artworkUrl100 ? (
                  <img
                    src={selectedSong.artworkUrl100}
                    alt={selectedSong.trackName}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-xs object-cover bg-[#E5DFD3] shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xs bg-[#E5DFD3] flex items-center justify-center text-[#555047] shrink-0">
                    <Music className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#191817] truncate">
                    {selectedSong.trackName}
                  </p>
                  <p className="text-[11px] text-[#7A756D] truncate">
                    {selectedSong.artistName}
                  </p>
                </div>
              </div>
            )}

            {/* Paper Footer */}
            <div className="pt-3 border-t border-[#191817]/10 flex items-center justify-between text-xs text-[#666159]">
              <div className="flex items-center gap-1.5 truncate pr-2">
                <span className="font-meta text-[#8C867C]">Untuk</span>
                <span className="text-[#8C867C]">·</span>
                <span className="font-medium text-[#191817] truncate">
                  {recipient.trim() || 'Nama penerima'}
                </span>
              </div>
              <div className="font-meta text-[11px] text-[#8C867C] shrink-0">
                Oleh {senderAlias}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
