import React, { useState } from 'react';
import { TitipesanMessage, AppRoute } from '../types';
import { PaperCard } from '../components/PaperCard';
import { MarqueeSection } from '../components/MarqueeSection';
import { buildPersonalInboxUrl } from '../utils/share';
import {
  ArrowRight,
  Search,
  Feather,
  Music,
  ShieldCheck,
  Dices,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

interface HomePageProps {
  messages: TitipesanMessage[];
  onNavigate: (route: AppRoute) => void;
  onOpenDetail: (msg: TitipesanMessage) => void;
  onOpenRandom: () => void;
  onShowToast: (msg: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  messages,
  onNavigate,
  onOpenDetail,
  onOpenRandom,
  onShowToast,
}) => {
  const [personalName, setPersonalName] = useState('');
  const [copiedInbox, setCopiedInbox] = useState(false);
  const [activeMood, setActiveMood] = useState<string>('Semua');

  const moods = ['Semua', 'Rindu', 'Penyemangat', 'Terima Kasih', 'Maaf', 'Rahasia'];

  const filteredByMood = messages.filter((m) => {
    if (activeMood === 'Semua') return true;
    const text = (m.message + ' ' + m.to).toLowerCase();
    if (activeMood === 'Rindu') return text.includes('rindu') || text.includes('kangen') || text.includes('bertemu') || text.includes('hujan') || text.includes('dulu');
    if (activeMood === 'Penyemangat') return text.includes('semangat') || text.includes('berat') || text.includes('bangga') || text.includes('langkah') || text.includes('masa depan');
    if (activeMood === 'Terima Kasih') return text.includes('terima kasih') || text.includes('makasih') || text.includes('selamat');
    if (activeMood === 'Maaf') return text.includes('maaf') || text.includes('salah') || text.includes('belum sempat');
    if (activeMood === 'Rahasia') return text.includes('diam') || text.includes('rahasia') || text.includes('takut');
    return true;
  });

  const handleCopyPersonalInbox = async () => {
    const targetName = personalName.trim() || 'Saya';
    const inboxUrl = buildPersonalInboxUrl(targetName);
    const shareText = `💌 Titipkan pesan anonim dengan musik untuk ${targetName}:\n${inboxUrl}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        window.prompt('Salin link untuk Bio / Story Instagram:', shareText);
      }
      setCopiedInbox(true);
      onShowToast('Tautan kotak surat siap dipasang di Bio/Story IG!');
      setTimeout(() => setCopiedInbox(false), 2500);
    } catch {
      window.prompt('Salin link untuk Bio / Story Instagram:', shareText);
      onShowToast('Tautan kotak surat siap dipasang di Bio/Story IG!');
    }
  };

  return (
    <div className="flex flex-col gap-16 sm:gap-24 py-10 sm:py-16">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 text-center sm:text-left flex flex-col items-center sm:items-start">
        {/* Eyebrow */}
        <div className="text-xs font-meta uppercase tracking-widest text-[#8C867C] mb-4 flex items-center gap-2">
          <span>01 / Titipesan</span>
          <span className="text-[#C7C0B3]">·</span>
          <span>Anonymous Editorial Letters</span>
        </div>

        {/* Big Editorial Heading */}
        <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl text-[#191817] leading-[1.08] tracking-tight max-w-3xl mb-6">
          Titipkan sesuatu yang ingin diingat.
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-lg text-[#615C53] max-w-2xl font-normal leading-relaxed mb-8">
          Tinggalkan pesan untuk seseorang dengan nama samaran otomatis yang puitis.
          Bebas dari riwayat akun asli, lengkap dengan pilihan warna kertas
          editorial dan lagu Apple Music yang menyuarakan rasa.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3.5">
          <button
            onClick={() => onNavigate('/create')}
            className="flex items-center gap-2.5 px-6 py-3.5 text-sm font-medium bg-[#191817] text-[#FAF8F5] hover:bg-[#34302C] rounded-sm transition-colors shadow-xs active:scale-[0.98]"
          >
            <span>Buat Pesan</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('/search')}
            className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium border border-[#DCD5C7] bg-[#F7F3EA]/70 hover:bg-[#F2ECE1] text-[#302D29] rounded-sm transition-colors"
          >
            <Search className="w-4 h-4 text-[#757067]" />
            <span>Cari Pesan</span>
          </button>

          {/* Random Surprise Letter Button */}
          <button
            onClick={onOpenRandom}
            className="flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-[#4A453D] hover:text-[#191817] hover:bg-[#EAE4D8]/50 rounded-sm transition-colors"
            title="Buka surat acak"
          >
            <Dices className="w-4 h-4 text-[#7E776D]" />
            <span>Buka Surat Acak</span>
          </button>
        </div>
      </section>

      {/* Marquee Section (Pesan yang sedang berlayar dibuat marquee!) */}
      <MarqueeSection messages={messages} onOpenDetail={onOpenDetail} />

      {/* NGL-Style Viral Feature: Personal Secret Mailbox Sticker Link */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 w-full">
        <div className="p-6 sm:p-9 bg-gradient-to-br from-[#FAF5EC] to-[#F2EADB] border border-[#DDD4C3] rounded-sm shadow-xs relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="flex items-center gap-2 text-xs font-meta text-[#80796E] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#A36A47]" />
              <span>Kotak Surat Anonim Pribadi (Format NGL Instagram)</span>
            </div>

            <h3 className="font-editorial text-2xl sm:text-3xl text-[#191817] mb-2 leading-tight">
              Ingin tahu apa yang ingin orang sampaikan padamu?
            </h3>

            <p className="text-xs sm:text-sm text-[#615C53] leading-relaxed mb-6">
              Buat tautan khusus namamu. Pasang di stiker Instagram Story atau Bio TikTok/WA.
              Teman-temanmu bisa mengirimkan surat rahasia berlagu kepadamu tanpa kamu tahu siapa mereka!
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={personalName}
                onChange={(e) => setPersonalName(e.target.value)}
                placeholder="Masukkan namamu (cth: Rania)..."
                className="flex-1 px-4 py-3 bg-[#FCFAF5] border border-[#CFC5B4] rounded-sm text-sm text-[#191817] placeholder:text-[#9E9689] outline-none"
              />

              <button
                type="button"
                onClick={handleCopyPersonalInbox}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#191817] text-[#FAF8F5] text-xs font-medium rounded-sm hover:bg-[#34302C] transition-colors shadow-xs active:scale-[0.98]"
              >
                {copiedInbox ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Link Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Link Story IG</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Archive Grid with Mood Filter Tabs */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#EAE3D5]">
          <div>
            <span className="text-xs font-meta text-[#8C867C] uppercase tracking-wider block mb-1">
              Jelajah Rasa
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#191817]">
              Kumpulan Surat Pilihan
            </h2>
          </div>

          {/* Mood Filter segmented tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F2EDE2] rounded-xs border border-[#E3DBD0]">
            {moods.map((mood) => {
              const isActive = activeMood === mood;
              return (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setActiveMood(mood)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors ${
                    isActive
                      ? 'bg-[#FCFAF5] text-[#191817] shadow-xs font-semibold'
                      : 'text-[#69645C] hover:text-[#191817]'
                  }`}
                >
                  {mood}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-column paper grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {(filteredByMood.length > 0 ? filteredByMood : messages).slice(0, 6).map((msg, idx) => (
            <PaperCard
              key={msg.id}
              message={msg}
              index={idx}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      </section>

      {/* Editorial Principles / Pillars */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 w-full">
        <div className="pt-12 border-t border-[#EAE3D5] grid grid-cols-1 md:grid-cols-3 gap-8 text-[#544F47]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#191817] font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-[#7E7970]" />
              <span>Identitas Terjaga Penuh</span>
            </div>
            <p className="text-xs leading-relaxed text-[#736E65]">
              Pengirim hanya tampil sebagai nama samaran otomatis unik seperti{' '}
              <em className="font-meta font-normal text-[#2E2B27]">QuietMoon482913</em>.
              Data pribadimu tidak pernah diminta atau disimpan.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#191817] font-semibold text-sm">
              <Feather className="w-4 h-4 text-[#7E7970]" />
              <span>Sensasi Kertas Nyata</span>
            </div>
            <p className="text-xs leading-relaxed text-[#736E65]">
              Tujuh palet warna kertas hangat dipadukan dengan tipografi tulisan
              tangan yang intim dan proporsi tata letak editorial.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#191817] font-semibold text-sm">
              <Music className="w-4 h-4 text-[#7E7970]" />
              <span>Harmoni Musik iTunes</span>
            </div>
            <p className="text-xs leading-relaxed text-[#736E65]">
              Sertakan cuplikan lagu sungguhan dari katalog Apple Music untuk
              mengiringi setiap kata yang ingin kamu sampaikan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
