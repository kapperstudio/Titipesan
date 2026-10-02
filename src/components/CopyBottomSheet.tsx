import React, { useEffect, useState } from 'react';
import { TitipesanMessage } from '../types';
import { buildShareUrl, generateSocialCopy } from '../utils/share';
import { Copy, Check, X, Instagram, MessageCircle } from 'lucide-react';

interface CopyBottomSheetProps {
  message: TitipesanMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onOpenStoryModal?: (msg: TitipesanMessage) => void;
}

export const CopyBottomSheet: React.FC<CopyBottomSheetProps> = ({
  message,
  isOpen,
  onClose,
  onShowToast,
  onOpenStoryModal,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCopiedUrl(false);
      setCopiedCaption(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !message) return null;

  const shareUrl = buildShareUrl(message);

  const handleCopyUrl = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        window.prompt('Salin tautan pesan ini:', shareUrl);
      }
      setCopiedUrl(true);
      onShowToast('Tautan berhasil disalin.');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch {
      window.prompt('Salin tautan pesan ini:', shareUrl);
      onShowToast('Tautan berhasil disalin.');
      onClose();
    }
  };

  const handleCopyCaption = async () => {
    const text = generateSocialCopy(message);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        window.prompt('Salin format pesan ini:', text);
      }
      setCopiedCaption(true);
      onShowToast('Format pesan WhatsApp/IG tersalin.');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch {
      window.prompt('Salin format pesan ini:', text);
      onShowToast('Format pesan WhatsApp/IG tersalin.');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-end justify-center bg-black/55 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sheet-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#FCFAF5] border-t border-x border-[#E0D9CB] rounded-t-2xl shadow-2xl p-6 sm:p-8 animate-in slide-in-from-bottom duration-250 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-[#D1C9BC] rounded-full mx-auto mb-5" />

        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 id="sheet-title" className="font-editorial text-2xl sm:text-3xl text-[#191817]">
            Salin tautan.
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-[#78736B] hover:text-[#191817] transition-colors rounded-sm"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[13.5px] text-[#69645C] leading-relaxed mb-4">
          Bagikan pesan ini tanpa perlu menjelaskan siapa pengirimnya. Tautan ini akan memunculkan pratinjau kartu saat dikirim di WhatsApp, Twitter, atau Instagram.
        </p>

        {/* URL Box */}
        <div className="mb-5 p-3 bg-[#F2EDE2] border border-[#DDD5C5] rounded-sm flex items-center justify-between gap-3">
          <input
            type="text"
            readOnly
            value={shareUrl}
            onFocus={(e) => e.target.select()}
            className="w-full bg-transparent text-xs font-meta text-[#2D2A26] outline-none select-all truncate"
            aria-label="URL tautan pesan"
          />
        </div>

        {/* Quick Social Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
          <button
            type="button"
            onClick={handleCopyCaption}
            className="flex items-center justify-center gap-2 p-2.5 text-xs font-medium border border-[#D5CDBD] bg-[#F7F3EA] hover:bg-[#EFE8DC] text-[#292622] rounded-sm transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>{copiedCaption ? 'Tersalin!' : 'Salin Format WA/Chat'}</span>
          </button>

          {onOpenStoryModal && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenStoryModal(message);
              }}
              className="flex items-center justify-center gap-2 p-2.5 text-xs font-medium border border-[#D5CDBD] bg-[#F7F3EA] hover:bg-[#EFE8DC] text-[#292622] rounded-sm transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-[#B83E75]" />
              <span>Buka Kartu Instagram Story</span>
            </button>
          )}
        </div>

        {/* Primary Action Row */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAE3D5]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-medium text-[#69645C] hover:text-[#191817] hover:bg-[#EAE4D8]/50 rounded-sm transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleCopyUrl}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium bg-[#191817] text-[#FBF9F5] hover:bg-[#34302C] rounded-sm transition-colors shadow-xs active:scale-[0.98]"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin tautan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
