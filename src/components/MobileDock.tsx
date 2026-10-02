import React from 'react';
import { AppRoute } from '../types';
import { Home, Search, Dices, Plus, Clock } from 'lucide-react';

interface MobileDockProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onOpenRandom: () => void;
}

export const MobileDock: React.FC<MobileDockProps> = ({
  currentRoute,
  onNavigate,
  onOpenRandom,
}) => {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-lg border-t border-[#EAE4D8] px-3 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-around text-[10px] font-medium text-[#6B665E] shadow-lg"
      aria-label="Navigasi Bawah Mobile"
    >
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          currentRoute === '/' ? 'text-[#191817] font-semibold' : 'hover:text-[#191817]'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Beranda</span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate('/search')}
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          currentRoute === '/search' ? 'text-[#191817] font-semibold' : 'hover:text-[#191817]'
        }`}
      >
        <Search className="w-4 h-4" />
        <span>Cari</span>
      </button>

      {/* Random letter button with distinct stationery feel */}
      <button
        type="button"
        onClick={onOpenRandom}
        className="flex flex-col items-center gap-1 p-1 text-[#4F4B43] hover:text-[#191817] transition-transform active:scale-95"
      >
        <Dices className="w-4 h-4 text-[#8C867C]" />
        <span>Surat Acak</span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate('/create')}
        className="flex flex-col items-center gap-1 p-1 text-[#191817] font-semibold"
      >
        <div className="w-7 h-7 rounded-sm bg-[#191817] text-[#FAF7F2] flex items-center justify-center -mt-2 shadow-xs">
          <Plus className="w-4 h-4" />
        </div>
        <span>Buat</span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate('/history')}
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          currentRoute === '/history' ? 'text-[#191817] font-semibold' : 'hover:text-[#191817]'
        }`}
      >
        <Clock className="w-4 h-4" />
        <span>Riwayat</span>
      </button>
    </nav>
  );
};
