import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <div className="mb-10 pb-6 border-b border-[#EAE3D5]">
        <span className="text-xs font-meta text-[#8C867C] uppercase tracking-wider block mb-2">
          Tentang Titipesan
        </span>
        <h1 className="font-editorial text-4xl sm:text-6xl text-[#191817] leading-tight mb-4">
          Sebuah ruang kecil untuk kata-kata yang belum sempat sampai.
        </h1>
        <p className="text-base sm:text-lg font-serif italic text-[#635E55]">
          “Leave something worth remembering.”
        </p>
      </div>

      <div className="space-y-8 text-[15px] text-[#47433B] leading-relaxed">
        <p>
          Terkadang ada perasaan, permohonan maaf, atau sekadar salam perpisahan yang terlalu berat jika diucapkan bertatap muka. Ada juga kata-kata penyemangat yang ingin kamu sampaikan kepada seseorang tanpa ingin membuat mereka merasa berutang budi.
        </p>

        <p>
          <strong className="text-[#191817] font-medium">Titipesan</strong> lahir dari gagasan sederhana: bagaimana jika ada medium digital yang memperlakukan kata-kata dengan kehormatan yang sama seperti surat kertas fisik yang ditulis di meja kayu pada malam yang tenang?
        </p>

        <div className="my-8 p-6 bg-[#FAF7F0] border-l-2 border-[#191817] rounded-r-sm space-y-4">
          <h3 className="font-editorial text-2xl text-[#191817]">
            Empat Inti Pengalaman Titipesan
          </h3>
          <ul className="space-y-3 text-sm text-[#544F46]">
            <li>
              <strong className="text-[#191817]">1. Nama Samaran Otomatis:</strong> Setiap pengguna diberi alias puitis unik secara acak. Tidak ada formulir pendaftaran akun atau pencatatan alamat email.
            </li>
            <li>
              <strong className="text-[#191817]">2. Kurasi Lembaran Kertas:</strong> Tujuh variasi warna kertas hangat (Warm Paper, Soft Pink, Pale Blue, Cream, Lavender, Sage, Sand) dengan sentuhan tipografi tulisan tangan.
            </li>
            <li>
              <strong className="text-[#191817]">3. Resonansi Musik:</strong> Pilihan audio 30 detik dari katalog resmi Apple Music untuk melengkapi nuansa emosional pesanmu.
            </li>
            <li>
              <strong className="text-[#191817]">4. Tautan Mandiri:</strong> Pesan dapat dibagikan melalui tautan terenkripsi yang membawa isi surat di dalam URL tanpa bergantung pada akun pengguna lain.
            </li>
          </ul>
        </div>

        <p>
          Semoga pesan apa pun yang kamu titipkan di sini menemukan tujuannya pada waktu yang tepat.
        </p>
      </div>
    </div>
  );
};
