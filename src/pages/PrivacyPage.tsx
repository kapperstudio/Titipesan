import React from 'react';
import { AlertTriangle, Lock, EyeOff, ShieldCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <div className="mb-10 pb-6 border-b border-[#EAE3D5]">
        <span className="text-xs font-meta text-[#8C867C] uppercase tracking-wider block mb-2">
          Kebijakan & Privasi
        </span>
        <h1 className="font-editorial text-4xl sm:text-6xl text-[#191817] leading-tight mb-3">
          Privacy.
        </h1>
        <p className="text-sm text-[#666159] leading-relaxed">
          Keterbukaan mengenai bagaimana data, nama samaran, dan pesanmu ditangani di Titipesan.
        </p>
      </div>

      <div className="space-y-8 text-[14.5px] text-[#47433B] leading-relaxed">
        {/* Warning Banner */}
        <div className="p-5 bg-[#FAF0F0] border border-[#ECDADA] rounded-sm flex items-start gap-3.5 text-[#8A3838]">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-sm">Peringatan Penting Keamanan Data</p>
            <p>
              Jangan pernah memasukkan kata sandi (password), nomor identitas resmi (KTP/NIK/Paspor), nomor rekening bank, kartu kredit, rahasia perusahaan, atau data sensitif pribadi lainnya ke dalam pesan Titipesan.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#191817] font-semibold text-base">
            <EyeOff className="w-4 h-4 text-[#757067]" />
            <h3>Nama Samaran Otomatis</h3>
          </div>
          <p>
            Titipesan sengaja tidak meminta identitas asli pengirim (nama lengkap, nomor telepon, maupun email). Setiap peramban mendapatkan identitas acak berupa perpaduan kata sifat, kata benda, dan angka (contoh: <code className="font-meta text-xs bg-[#EAE3D5] px-1 py-0.5 rounded-xs">QuietMoon482913</code>). Nama ini disimpan secara lokal di browsermu agar konsisten saat kamu menulis pesan berikutnya.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#191817] font-semibold text-base">
            <Lock className="w-4 h-4 text-[#757067]" />
            <h3>Penyimpanan Lokal (localStorage)</h3>
          </div>
          <p>
            Pesan yang kamu buat disimpan di memori peramban (<em className="font-meta text-xs">localStorage</em>). Kami tidak memproses data formulirmu untuk keperluan profil periklanan, pelacakan pihak ketiga, maupun monetisasi data pribadi.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#191817] font-semibold text-base">
            <ShieldCheck className="w-4 h-4 text-[#757067]" />
            <h3>Tautan Berbagi (Shared Link)</h3>
          </div>
          <p>
            Ketika kamu memilih &ldquo;Salin tautan&rdquo; untuk membagikan surat kepada penerima, data pesan (nama penerima, isi pesan, warna kertas, dan cuplikan lagu) dienkripsi secara aman langsung ke dalam segmen URL (<em className="font-meta text-xs">URL Hash</em>).
          </p>
          <p>
            Artinya, siapa pun yang menerima tautan tersebut dapat membaca isi pesan langsung di browser mereka tanpa perlu mendaftar atau mengakses basis data pihak ketiga. Karena URL tersebut memuat isi pesan, bagikan hanya kepada orang yang kamu tuju.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h3 className="font-semibold text-[#191817]">Batasan Layanan</h3>
          <p>
            Titipesan tidak membuat klaim enkripsi ujung-ke-ujung (end-to-end military grade) yang menyesatkan. Kami adalah platform editorial untuk ekspresi literatur dan pesan kenangan, bukan aplikasi komunikasi terenkripsi rahasia negara.
          </p>
        </section>
      </div>
    </div>
  );
};
