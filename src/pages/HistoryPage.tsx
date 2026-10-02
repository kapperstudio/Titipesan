import React from 'react';
import { TitipesanMessage, AppRoute } from '../types';
import { PaperCard } from '../components/PaperCard';
import { getMyMessageIds } from '../utils/storage';
import { Feather, Plus } from 'lucide-react';

interface HistoryPageProps {
  messages: TitipesanMessage[];
  onNavigate: (route: AppRoute) => void;
  onOpenDetail: (msg: TitipesanMessage) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  messages,
  onNavigate,
  onOpenDetail,
}) => {
  const myIds = getMyMessageIds();
  const myMessages = messages.filter((m) => myIds.includes(m.id));

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <span className="text-xs font-meta text-[#8C867C] uppercase tracking-wider block mb-2">
          03 / History
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#191817] leading-tight mb-3">
          Pesan yang pernah kamu buat.
        </h1>
        <p className="text-sm text-[#666159] leading-relaxed">
          Catatan riwayat surat yang pernah kamu titipkan dari peramban ini.
          Tersimpan secara lokal tanpa akun atau pelacakan.
        </p>
      </div>

      {myMessages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {myMessages.map((msg, idx) => (
            <PaperCard
              key={msg.id}
              message={msg}
              index={idx}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-[#DDD5C5] rounded-sm bg-[#FAF7F0]/50 max-w-md mx-auto p-8">
          <Feather className="w-8 h-8 text-[#A8A196] mb-3 stroke-[1.5]" />
          <h3 className="font-editorial text-2xl text-[#191817] mb-2">
            Belum ada pesan.
          </h3>
          <p className="text-sm text-[#7A756D] font-serif italic mb-6">
            Kamu belum pernah menitipkan pesan dari peramban ini.
          </p>
          <button
            onClick={() => onNavigate('/create')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#191817] text-[#FAF8F5] text-xs font-medium rounded-sm hover:bg-[#322F2C] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Pesan</span>
          </button>
        </div>
      )}
    </div>
  );
};
