import React, { useState } from 'react';
import { Heart, ArrowUpRight, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

export const SupportPage: React.FC = () => {
  const [showStatusModal, setShowStatusModal] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <div className="mb-10 pb-6 border-b border-[#EAE3D5]">
        <span className="text-xs font-meta text-[#8C867C] uppercase tracking-wider block mb-2">
          Dukungan Komunitas
        </span>
        <h1 className="font-editorial text-4xl sm:text-6xl text-[#191817] leading-tight mb-3">
          Support.
        </h1>
        <p className="text-lg font-serif italic text-[#59554C]">
          Kalau Titipesan berguna untukmu, bantu agar ruang ini tetap hidup.
        </p>
      </div>

      <div className="space-y-8 text-[15px] text-[#47433B] leading-relaxed">
        <p>
          Titipesan dipertahankan secara independen tanpa investor komersial, tanpa spam, dan tanpa pelacak iklan yang melanggar kenyamanan membacamu.
        </p>

        <p>
          Bantuan dari pembaca dan penulis pesan di Titipesan secara langsung berkontribusi pada:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="p-4 bg-[#FAF7F0] border border-[#E5DFD1] rounded-sm">
            <h4 className="font-semibold text-sm text-[#191817] mb-1">
              • Infrastruktur Server
            </h4>
            <p className="text-xs text-[#6B665E]">
              Memastikan kecepatan akses halaman dan ketersediaan tautan pesan 24 jam sehari.
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F0] border border-[#E5DFD1] rounded-sm">
            <h4 className="font-semibold text-sm text-[#191817] mb-1">
              • Desain & Rekayasa Antarmuka
            </h4>
            <p className="text-xs text-[#6B665E]">
              Penyempurnaan tipografi kertas, optimasi mobile, dan audio engine yang mulus.
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F0] border border-[#E5DFD1] rounded-sm">
            <h4 className="font-semibold text-sm text-[#191817] mb-1">
              • Lisensi & Integrasi iTunes API
            </h4>
            <p className="text-xs text-[#6B665E]">
              Menjaga kelancaran pencarian lagu dan pemutaran cuplikan audio legal di Indonesia.
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F0] border border-[#E5DFD1] rounded-sm">
            <h4 className="font-semibold text-sm text-[#191817] mb-1">
              • Pemeliharaan & Keamanan
            </h4>
            <p className="text-xs text-[#6B665E]">
              Pembersihan berkala, perlindungan XSS, dan perlindungan privasi pengguna.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            onClick={() => setShowStatusModal(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-[#191817] text-[#FAF8F5] text-xs font-medium rounded-sm hover:bg-[#34302C] transition-colors shadow-xs active:scale-[0.98]"
          >
            <span>Support Titipesan</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <a
            href="mailto:kapperstudio1@gmail.com?subject=Titipesan%20Feedback%20%26%20Support"
            className="flex items-center gap-2 px-5 py-3.5 border border-[#D5CDBD] text-[#33302B] text-xs font-medium rounded-sm hover:bg-[#F2ECE1] transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#736E66]" />
            <span>Kirim Surat/Saran</span>
          </a>
        </div>
      </div>

      {showStatusModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setShowStatusModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#FCFAF5] border border-[#E0D9CB] rounded-sm shadow-xl p-6 sm:p-7 text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF0F0] text-[#9E4D4D] mx-auto flex items-center justify-center">
              <Heart className="w-6 h-6 stroke-[1.5] fill-current" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl text-[#191817] mb-1">
                Terima Kasih Atas Niat Baikmu
              </h3>
              <p className="text-xs text-[#6E6960] leading-relaxed">
                Integrasi pembayaran langsung sedang dalam tahap verifikasi merchant. Kami tidak memproses transaksi pura-pura atau simulasi palsu. Kamu dapat menyampaikan pesan dan dukungan langsung melalui surel kami.
              </p>
            </div>
            <button
              onClick={() => setShowStatusModal(false)}
              className="w-full py-2.5 bg-[#191817] text-[#FAF8F5] text-xs font-medium rounded-sm hover:bg-[#34302C] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
