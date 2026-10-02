import React, { useState } from 'react';
import { Coffee, Server, Palette, HeartHandshake, CheckCircle2, QrCode } from 'lucide-react';

export const DonatePage: React.FC = () => {
  const [showQrModal, setShowQrModal] = useState(false);

  const tiers = [
    {
      title: 'Secangkir Kopi',
      amount: 'Rp 15.000',
      description: 'Menjaga kami tetap terjaga saat menyempurnakan tipografi dan animasi.',
      icon: Coffee,
    },
    {
      title: 'Kertas & Tinta',
      amount: 'Rp 50.000',
      description: 'Mendukung biaya server dan integrasi pencarian iTunes Apple Music.',
      icon: Palette,
    },
    {
      title: 'Pemeliharaan Ruang',
      amount: 'Rp 100.000',
      description: 'Menjaga Titipesan tetap bebas iklan dan independen untuk semua orang.',
      icon: Server,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="max-w-2xl mb-12">
        <span className="text-xs font-meta text-[#8C867C] uppercase tracking-wider block mb-2">
          04 / Donate
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#191817] leading-tight mb-4">
          Bantu Titipesan tetap hidup.
        </h1>
        <p className="text-base text-[#615C53] leading-relaxed">
          Titipesan dirancang sebagai ruang tenang, bebas dari pelacak komersial dan iklan yang mengganggu.
          Dukunganmu langsung digunakan untuk biaya operasional server, lisensi API, desain antarmuka,
          serta pemeliharaan berkelanjutan.
        </p>
      </div>

      {/* Support Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <div
              key={tier.title}
              className="p-6 bg-[#FAF7F0] border border-[#E5DFD1] rounded-sm flex flex-col justify-between hover:shadow-sm transition-shadow text-left"
            >
              <div>
                <div className="w-10 h-10 rounded-sm bg-[#F0ECE2] border border-[#DDD5C5] flex items-center justify-center text-[#524E46] mb-4">
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="font-editorial text-xl text-[#191817] mb-1">
                  {tier.title}
                </h3>
                <div className="text-lg font-meta font-medium text-[#191817] mb-3">
                  {tier.amount}
                </div>
                <p className="text-xs text-[#706B62] leading-relaxed">
                  {tier.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="mt-6 w-full py-2.5 px-3 text-xs font-medium border border-[#D5CDBD] bg-[#FCFAF5] hover:bg-[#191817] hover:text-[#FAF8F5] text-[#292622] rounded-sm transition-all"
              >
                Pilih Dukungan
              </button>
            </div>
          );
        })}
      </div>

      {/* Honest Transparency Note */}
      <div className="p-6 bg-[#FAF7F0] border border-[#E5DFD1] rounded-sm flex items-start gap-4">
        <HeartHandshake className="w-5 h-5 text-[#8C867C] shrink-0 mt-0.5" />
        <div className="text-xs text-[#6B665E] leading-relaxed space-y-1">
          <p className="font-semibold text-[#191817]">
            Transparansi Pembayaran & Dukungan
          </p>
          <p>
            Kanal pembayaran otomatis (QRIS / payment gateway) saat ini sedang dalam proses integrasi verifikasi merchant.
            Kami tidak menyematkan gerbang pembayaran tiruan untuk memastikan kejujuran penuh kepada pengguna.
          </p>
        </div>
      </div>

      {/* QRIS / Placeholder Modal */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setShowQrModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#FCFAF5] border border-[#E0D9CB] rounded-sm shadow-xl p-6 sm:p-7 text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#F0ECE2] mx-auto flex items-center justify-center text-[#4A453D]">
              <QrCode className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl text-[#191817] mb-1">
                Kanal Dukungan QRIS
              </h3>
              <p className="text-xs text-[#6E6960] leading-relaxed">
                Gerbang QRIS resmi sedang proses verifikasi administrasi perbankan.
                Terima kasih atas niat baikmu untuk menjaga ruang ini tetap bernapas!
              </p>
            </div>
            <div className="p-4 bg-[#F2ECE0] border border-[#DDD5C5] rounded-xs font-meta text-xs text-[#423E37]">
              Status: Menunggu aktivasi merchant
            </div>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 bg-[#191817] text-[#FAF8F5] text-xs font-medium rounded-sm hover:bg-[#34302C] transition-colors"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
