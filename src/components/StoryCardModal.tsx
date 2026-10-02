import React, { useEffect, useState } from 'react';
import { TitipesanMessage } from '../types';
import { generateStoryCardImage, generateSocialCopy } from '../utils/share';
import { X, Download, Share2, Copy, Check, Instagram, Sparkles } from 'lucide-react';

interface StoryCardModalProps {
  message: TitipesanMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const StoryCardModal: React.FC<StoryCardModalProps> = ({
  message,
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    if (!isOpen || !message) {
      setImageUrl('');
      return;
    }

    setIsGenerating(true);
    generateStoryCardImage(message)
      .then((url) => {
        setImageUrl(url);
      })
      .finally(() => {
        setIsGenerating(false);
      });
  }, [isOpen, message]);

  if (!isOpen || !message) return null;

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `titipesan-story-${message.to.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onShowToast('Gambar Instagram Story tersimpan.');
  };

  const handleWebShare = async () => {
    if (!imageUrl) return;
    try {
      // Convert data URL to Blob for native mobile share sheet
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], `titipesan-${message.to}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Pesan untuk ${message.to}`,
          text: `💌 Titipesan untuk ${message.to}. Baca atau kirim pesan anonim di titipesan.com`,
        });
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  };

  const handleCopyCaption = async () => {
    const text = generateSocialCopy(message);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      onShowToast('Teks caption tersalin.');
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      window.prompt('Salin teks ini:', text);
      onShowToast('Teks caption tersalin.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#1C1A18] text-[#FAF7F2] border border-[#38342E] rounded-md shadow-2xl p-6 sm:p-7 flex flex-col max-h-[92vh] overflow-y-auto"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#332E28] mb-4">
          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-[#C2B8A6]" />
            <h3 id="story-modal-title" className="font-editorial text-2xl text-[#FAF7F2]">
              Instagram Story Card
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9C9486] hover:text-[#FAF7F2] rounded-sm transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#A89F90] leading-relaxed mb-4">
          Unduh kartu berformat 9:16 untuk dibagikan ke Instagram Story, WhatsApp Status, atau Twitter/X persis seperti tren NGL.
        </p>

        {/* Card Image Preview */}
        <div className="relative aspect-[9/16] max-h-[380px] mx-auto rounded-sm overflow-hidden border border-[#3E3830] shadow-lg mb-5 bg-[#0D0C0B] flex items-center justify-center">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-2 text-xs font-meta text-[#9E9586]">
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>Menyusun kartu surat...</span>
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="Story Preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-xs text-[#8C8476]">Gagal memuat pratinjau</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={handleWebShare}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#F2EDE2] text-[#191817] hover:bg-white text-xs font-semibold rounded-sm transition-all shadow-xs active:scale-[0.98]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan ke Story / WA</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-4 bg-[#2C2824] hover:bg-[#3B3630] text-[#E0D8CB] text-xs font-medium rounded-sm border border-[#443E36] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Gambar</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCaption}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-3.5 bg-[#2C2824] hover:bg-[#3B3630] text-[#E0D8CB] text-xs font-medium rounded-sm border border-[#443E36] transition-colors"
            title="Salin teks caption"
          >
            {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="sm:hidden">Salin Teks</span>
          </button>
        </div>
      </div>
    </div>
  );
};
