import React, { useState, useMemo } from 'react';
import { TitipesanMessage } from '../types';
import { PaperCard } from '../components/PaperCard';
import { Search, Inbox } from 'lucide-react';

interface SearchPageProps {
  messages: TitipesanMessage[];
  onOpenDetail: (msg: TitipesanMessage) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  messages,
  onOpenDetail,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMessages = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return messages;

    return messages.filter((msg) => {
      const matchTo = msg.to.toLowerCase().includes(term);
      const matchBody = msg.message.toLowerCase().includes(term);
      const matchSong =
        msg.song?.trackName.toLowerCase().includes(term) ||
        msg.song?.artistName.toLowerCase().includes(term);
      return matchTo || matchBody || matchSong;
    });
  }, [messages, searchTerm]);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <span className="text-xs font-meta text-[#8C867C] uppercase tracking-wider block mb-2">
          02 / Search
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#191817] leading-tight mb-2">
          Cari Pesan.
        </h1>
        <p className="text-sm font-serif italic text-[#706B62]">
          Tap a paper to open
        </p>
      </div>

      {/* Realtime Search Input */}
      <div className="max-w-xl mb-12">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ketik nama penerima atau penggalan isi pesan..."
            className="w-full pl-11 pr-4 py-3.5 bg-[#FAF7F0] border border-[#DDD5C5] rounded-sm text-sm text-[#191817] placeholder:text-[#9C968B] shadow-xs focus:bg-white transition-all"
            aria-label="Cari pesan"
          />
          <Search className="w-4 h-4 text-[#8C867C] absolute left-4 pointer-events-none" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 text-xs text-[#8C867C] hover:text-[#191817] py-1 px-1.5"
            >
              Hapus
            </button>
          )}
        </div>
      </div>

      {/* Archive Grid */}
      {filteredMessages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredMessages.map((msg, idx) => (
            <PaperCard
              key={msg.id}
              message={msg}
              index={idx}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-[#DDD5C5] rounded-sm bg-[#FAF7F0]/50 max-w-lg mx-auto">
          <Inbox className="w-8 h-8 text-[#A8A196] mb-3 stroke-[1.5]" />
          <h3 className="font-editorial text-2xl text-[#191817] mb-1">
            Tidak ditemukan.
          </h3>
          <p className="text-sm text-[#7A756D] font-serif italic">
            Coba kata lain atau periksa kembali ejaan nama penerima.
          </p>
        </div>
      )}
    </div>
  );
};
